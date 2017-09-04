package com.lightappbuilder.lab4.labmap.dynamicmap;

import android.os.AsyncTask;
import android.util.Log;
import android.util.SparseArray;

import com.facebook.react.modules.network.OkHttpClientProvider;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

import okhttp3.Request;
import okhttp3.Response;

/**
 * 图层数据加载
 * Created by yinhf on 2016/12/26.
 */
public class LayerLoader {
    private static final String TAG = "LayerLoader";
    private static final boolean DEBUG = LABDynamicMapView.DEBUG;

    private Layer layer;
    private Callback callback;
    private LoadTask curLoadTask;
    private BlockBounds loadingBounds;
    private BlockBounds pendingBounds;
    private SparseArray<BlockData> tempMap = new SparseArray<>();

    public LayerLoader(Layer layer, Callback callback) {
        this.layer = layer;
        this.callback = callback;
    }

    public synchronized void load(BlockBounds blockBounds) {
        if (DEBUG) Log.i(TAG, "load: bounds:" + blockBounds);

        if (loadingBounds != null && loadingBounds.contains(blockBounds)) {
            // 需要加载的区域处于当前正在加载的范围中
            return;
        }
        // 扩大需要加载的范围
        final int MIN_LOAD_EDGE_SIZE = 10; //最少加载10 x 10 区域的block
        int minLngId = blockBounds.minLngId;
        int minLatId = blockBounds.minLatId;
        int maxLngId = blockBounds.maxLngId;
        int maxLatId = blockBounds.maxLatId;
        int width = maxLngId - minLngId + 1;
        int height = maxLatId - minLatId + 1;
        if (width < MIN_LOAD_EDGE_SIZE) {
            minLngId = Math.max(minLngId - (MIN_LOAD_EDGE_SIZE - width + 1) / 2, 0);
            maxLngId = maxLngId + (MIN_LOAD_EDGE_SIZE - width) / 2;
        }
        if (height < MIN_LOAD_EDGE_SIZE) {
            minLatId = Math.max(minLatId - (MIN_LOAD_EDGE_SIZE - height + 1) / 2, 0);
            maxLatId = maxLatId + (MIN_LOAD_EDGE_SIZE - height) / 2;
        }
        blockBounds = new BlockBounds(minLngId, maxLngId, minLatId, maxLatId, blockBounds.blockSize);

        if (curLoadTask == null) {
            curLoadTask = new LoadTask();
            loadingBounds = blockBounds;
            curLoadTask.executeOnExecutor(AsyncTask.THREAD_POOL_EXECUTOR);
        } else {
            pendingBounds = blockBounds;
        }
    }

    public synchronized void cancel() {
        if (curLoadTask != null) {
            curLoadTask.cancel(false);
            curLoadTask = null;
            loadingBounds = null;
        }
        pendingBounds = null;
    }

    private void loadPending() {
        if (pendingBounds != null) {
            curLoadTask = new LoadTask();
            loadingBounds = pendingBounds;
            pendingBounds = null;
            curLoadTask.executeOnExecutor(AsyncTask.THREAD_POOL_EXECUTOR);
        }
    }

    private String buildRequestUrl(BlockBounds bounds) {
        String url = layer.getUrl();
        StringBuilder sb = new StringBuilder(url.length() + 50);
        sb.append(url);
        if (url.indexOf('?') > 0) {
            sb.append("&bounds=");
        } else {
            sb.append("?bounds=");
        }
        sb.append(bounds.minLng())
                .append(',')
                .append(bounds.minLat())
                .append(';')
                .append(bounds.maxLng())
                .append(',')
                .append(bounds.maxLat());
        return sb.toString();
    }

    private List<BlockData> parseData(JSONArray dataArr, BlockBounds blockBounds) throws Exception {
        ArrayList<BlockData> blockDataList = new ArrayList<>();
        PointData pointData;
        int blockId;
        SparseArray<BlockData> groupingMap = tempMap;
        BlockData blockData;
        for(int i = 0, len = dataArr.length(); i < len; ++i) {
            JSONObject pointDataJson = dataArr.optJSONObject(i);
            if(pointDataJson == null) {
                continue;
            }
            pointData = new PointData(pointDataJson);
            blockId = layer.coordToBlockId(pointData.position.longitude, pointData.position.latitude);
            blockData = groupingMap.get(blockId);
            if(blockData == null) {
                blockData = new BlockData(blockId);
                groupingMap.put(blockId, blockData);
                blockDataList.add(blockData);
            }
            blockData.points.add(pointData);
        }

        //空白BlockData
        int x, y;
        for (x = blockBounds.minLngId; x <= blockBounds.maxLngId; ++x) {
            for (y = blockBounds.minLatId; y <= blockBounds.maxLatId; ++y) {
                blockId = (x << 16) | y;
                if (groupingMap.get(blockId) == null) {
                    blockDataList.add(BlockData.empty(blockId));
                }
            }
        }
        tempMap.clear();
        return blockDataList;
    }

    private void cacheData(List<BlockData> blockDataList) {
        for (BlockData blockData : blockDataList) {
            layer.getBlockCache().put(blockData);
        }
    }

    private class LoadTask extends AsyncTask<Void, Void, Void> {

        @Override
        protected Void doInBackground(Void... params) {
            List<BlockData> blockDataList = null;
            try {
                Request request = new Request.Builder().url(buildRequestUrl(loadingBounds)).build();
                Response response = OkHttpClientProvider.getOkHttpClient().newCall(request).execute();
                if (isCancelled()) {
                    return null;
                }
                JSONObject jsonObject = new JSONObject(response.body().string());
                if ("ok".equalsIgnoreCase(jsonObject.getString("CODE"))) {
                    JSONArray data = jsonObject.getJSONObject("DATA").getJSONArray("list");
                    if (isCancelled()) {
                        return null;
                    }
                    blockDataList = parseData(data, loadingBounds);
                    if (!blockDataList.isEmpty()) {
                        cacheData(blockDataList);
                    }
                }
            } catch (Exception e) {
                if (DEBUG) e.printStackTrace();
            } finally {
                if (blockDataList != null) {
                    callback.onData(blockDataList);
                }
                synchronized (LayerLoader.this) {
                    curLoadTask = null;
                    if (!isCancelled()) {
                        loadPending();
                    }
                }
            }

            return null;
        }
    }

    interface Callback {
        void onData(List<BlockData> blockDataList);
    }
}
