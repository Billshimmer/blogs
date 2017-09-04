package com.lightappbuilder.lab4.labmap.dynamicmap;

import android.os.Handler;
import android.os.HandlerThread;
import android.os.Process;
import android.os.SystemClock;
import android.util.Log;
import android.util.SparseArray;

import com.baidu.mapapi.map.BaiduMap;
import com.baidu.mapapi.map.Marker;
import com.baidu.mapapi.map.MarkerOptions;
import com.baidu.mapapi.model.LatLng;
import com.baidu.mapapi.model.LatLngBounds;
import com.facebook.react.bridge.ReadableMap;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Callable;
import java.util.concurrent.FutureTask;

/**
 * Created by yinhf on 2016/12/26.
 */

public class Layer implements LayerLoader.Callback {
    private static final String TAG = "Layer";
    private static final boolean DEBUG = LABDynamicMapView.DEBUG;

    private LABDynamicMapView dynamicMapView;
    private BaiduMap map;
    private String url;
    private volatile boolean visible;
    private float minZoom;
    private float maxZoom;
    private LatLngBounds layerBounds;
    private VisibleBounds visibleBounds;
    private float blockSize;
    private float blockScale;
    private String markerType;

    private final SparseArray<BlockOverlay> blockMap = new SparseArray<>(64);
    //地图上的覆盖物数量
    private int mapOverlayCount;

    private BlockCache blockCache;
    private LayerLoader layerLoader;
    private volatile boolean isDestroyed;

    private static final int MAX_OVERLAY_COUNT = 100;

    private static HandlerThread renderThread = new HandlerThread("LayerRenderThread", Process.THREAD_PRIORITY_BACKGROUND);
    private static Handler layerHandler;
    static {
        renderThread.start();
        layerHandler = new Handler(renderThread.getLooper());
    }

    public Layer(LABDynamicMapView dynamicMapView, ReadableMap config) {
        this.dynamicMapView = dynamicMapView;
        this.map = dynamicMapView.getMap();
        this.url = config.getString("url");
        if (config.hasKey("minZoom")) {
            minZoom = (float) config.getDouble("minZoom");
        } else {
            minZoom = 3;
        }
        if (config.hasKey("maxZoom")) {
            maxZoom = (float) config.getDouble("maxZoom");
        } else {
            maxZoom = 23;
        }
        double minLongitude = 0;
        if (config.hasKey("minLongitude")) {
            minLongitude = config.getDouble("minLongitude");
        }
        double minLatitude = 0;
        if (config.hasKey("minLatitude")) {
            minLatitude = config.getDouble("minLatitude");
        }
        double maxLongitude;
        if (config.hasKey("maxLongitude")) {
            maxLongitude = config.getDouble("maxLongitude");
        } else {
            maxLongitude = 180;
        }
        double maxLatitude;
        if (config.hasKey("maxLatitude")) {
            maxLatitude = config.getDouble("maxLatitude");
        } else {
            maxLatitude = 90;
        }
        layerBounds = new LatLngBounds.Builder().include(new LatLng(maxLatitude, maxLongitude)).include(new LatLng(minLatitude, minLongitude)).build();

        blockSize = (float) config.getDouble("blockSize");
        blockScale = 1 / blockSize;
        visibleBounds = new VisibleBounds(blockSize, blockScale);

        ReadableMap markerConfig = config.getMap("marker");
        markerType = markerConfig.getString("type");

        blockCache = new BlockCache();
        layerLoader = new LayerLoader(this, this);
    }

    public BaiduMap getMap() {
        return map;
    }

    public String getUrl() {
        return url;
    }

    public float getMinZoom() {
        return minZoom;
    }

    public float getMaxZoom() {
        return maxZoom;
    }

    public LatLngBounds getLayerBounds() {
        return layerBounds;
    }

    public boolean isVisible() {
        return visible;
    }

    public void setVisible(boolean visible) {
        this.visible = visible;
        //TODO map.clear
    }

    BlockCache getBlockCache() {
        return blockCache;
    }

    public void load(LatLngBounds bounds) {
        if (DEBUG) Log.i(TAG, "load visibleBounds=" + visibleBounds);
        if (isDestroyed) {
            Log.w(TAG, "load: isDestroyed");
            return;
        }
        if (bounds.northeast.longitude > layerBounds.southwest.longitude && bounds.northeast.latitude > layerBounds.southwest.latitude
                && bounds.southwest.longitude < layerBounds.northeast.longitude && bounds.southwest.latitude < layerBounds.northeast.latitude) {
            boolean isBoundsChanged = visibleBounds.update(bounds);
            if (!isBoundsChanged) {
                if (DEBUG) Log.i(TAG, "load bounds !isBoundsChanged");
                return;
            }
            postOnLayerThread(new Runnable() {
                @Override
                public void run() {
                    loadInternal(true);
                }
            });
        }
    }

    private void postOnLayerThread(Runnable r) {
        if (isDestroyed) {
            return;
        }
        layerHandler.postAtTime(r, this, SystemClock.uptimeMillis());
    }

    private void loadInternal(boolean enableNetworkLoad) {
        if (isDestroyed || !visible) {
            return;
        }
        // 获取需要请求的id
        ArrayList<Integer> requireIds = new ArrayList<>();
        BlockBounds blockBounds = visibleBounds.getBlockBounds();
        int x, y, blockId;
        for (x = blockBounds.minLngId; x <= blockBounds.maxLngId; ++x) {
            for (y = blockBounds.minLatId; y <= blockBounds.maxLatId; ++y) {
                blockId = (x << 16) | y;
                if (blockMap.get(blockId) == null) {
                    requireIds.add(blockId);
                }
            }
        }
        if (DEBUG) Log.i(TAG, "load requireIds=" + requireIds);
        if (requireIds.isEmpty()) {
            return;
        }

        //检查缓存
        ArrayList<BlockData> cachedData = new ArrayList<>();
        for (int i = requireIds.size() - 1; i >= 0; --i) {
            BlockData blockData = blockCache.get(requireIds.get(i));
            if (blockData != null) {
                cachedData.add(blockData);
                requireIds.remove(i);
            }
        }
        if (!cachedData.isEmpty()) {
            renderBlockOverlays(cachedData);
            if (isDestroyed || !visible) {
                return;
            }
        }

        //请求网络
        if (enableNetworkLoad && !requireIds.isEmpty()) {
            // TODO layerLoader 应该可配置支持 blockId模式或者经纬度范围模式
            layerLoader.load(visibleBounds.getBlockBounds());
        }

    }

    @Override
    public void onData(List<BlockData> blockDataList) {
        postOnLayerThread(new Runnable() {
            @Override
            public void run() {
                loadInternal(false);
            }
        });
    }

    private void renderBlockOverlays(List<BlockData> blockDataList) {
        long start;
        if (DEBUG) {
            Log.d(TAG, "RenderTask start");
            start = SystemClock.elapsedRealtime();
        }

        //清理不可见block
        trimBlockMap(blockDataList);

        if (isDestroyed || !visible) {
            return;
        }

        //渲染
        render(blockDataList);

        if (DEBUG) Log.i(TAG, "RenderTask run time=" + (SystemClock.elapsedRealtime() - start) + " task:" + hashCode());
    }

    /**
     * 删除不可见区域的block使容量不超过最大值
     */
    private void trimBlockMap(List<BlockData> blockDataList) {
        int count = 0;
        for (BlockData blockData : blockDataList) {
            count += blockData.count();
        }
        int expectOverlayCount = mapOverlayCount + count;
        if (DEBUG)
            Log.i(TAG, "RenderTask trimBlockMap expectOverlayCount=" + expectOverlayCount);
        if (expectOverlayCount > MAX_OVERLAY_COUNT) {
            ArrayList<BlockOverlay> removeOverlays = new ArrayList<>();
            for (int i = 0, len = blockMap.size(); i < len; ++i) {
                BlockOverlay blockOverlay = blockMap.valueAt(i);
                if (!visibleBounds.contains(blockOverlay.id)) {
                    if (blockOverlay.isEmpty() && blockMap.size() - removeOverlays.size() < 4096) {
                        //对于空白的blockOverlay 只有当前blockMap.size 超过4096才删除
                        continue;
                    }
                    removeOverlays.add(blockOverlay);
                    expectOverlayCount -= blockOverlay.count();
                    if (expectOverlayCount <= MAX_OVERLAY_COUNT) {
                        break;
                    }
                }
            }
            for (BlockOverlay blockOverlay : removeOverlays) {
                blockMap.remove(blockOverlay.id);
                mapOverlayCount -= blockOverlay.count();
                blockOverlay.removeFromMap();
            }
            if (DEBUG)
                Log.i(TAG, "RenderTask trimBlockMap after trim expectOverlayCount=" + expectOverlayCount);
        }
    }

    /**
     * 渲染
     */
    private void render(List<BlockData> blockDataList) {
        long start;
        int oldMapOverlayCount;
        if (DEBUG) {
            Log.i(TAG, "RenderTask render start");
            start = SystemClock.elapsedRealtime();
            oldMapOverlayCount = mapOverlayCount;
        }
        BlockOverlay blockOverlay;
        ArrayList<MarkerOptions> mopList = new ArrayList<>();
        for (BlockData blockData : blockDataList) {
            //检测是否可见
            if (!visibleBounds.contains(blockData.id)) {
                continue;
            }

            if (mapOverlayCount > MAX_OVERLAY_COUNT * 1.5) {
                // 如果目前地图上的点过多则跳过剩余的渲染
                Log.w(TAG, "render: too many overlays skip render!");
                break;
            }

            //创建MarkerOptions
            for (PointData data : blockData.points) {
                mopList.add(dynamicMapView.createLayerMarkerOptions(markerType, data));
            }

            //addOverlay
            blockOverlay = new BlockOverlay(Layer.this, blockData.id);
            blockOverlay.addToMap(mopList);
            blockMap.put(blockOverlay.id, blockOverlay);
            mapOverlayCount += blockOverlay.count();

            mopList.clear();
        }

        if (DEBUG)
            Log.i(TAG, "RenderTask render time=" + (SystemClock.elapsedRealtime() - start) + " count=" + (mapOverlayCount - oldMapOverlayCount));
    }

    /**
     * 将坐标转换为blockId
     */
    int coordToBlockId(double longitude, double latitude) {
        int lngId = ((int) (longitude * blockScale)) & 0xffff;
        int latId = ((int) (latitude * blockScale)) & 0xffff;
        return (lngId << 16) | latId;
    }

    public void setQuery(String query) {
        // TODO
    }

    /**
     * 会阻塞等待Layer 线程当前layer的所有任务结束
     */
    public void onDestroy(final boolean clear) {
        if (isDestroyed) {
            return;
        }
        isDestroyed = true;
        visible = false;
        layerLoader.cancel();
        FutureTask<Void> future = new FutureTask<>(new Callable<Void>() {
            @Override
            public Void call() throws Exception {
                if (clear) {
                    // TODO 暂时清空所有,如果有需求则需要只清空本图层的
                    map.clear();
                }
                return null;
            }
        });
        layerHandler.postAtFrontOfQueue(future);
        layerHandler.removeCallbacksAndMessages(this);
        try {
            future.get();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
