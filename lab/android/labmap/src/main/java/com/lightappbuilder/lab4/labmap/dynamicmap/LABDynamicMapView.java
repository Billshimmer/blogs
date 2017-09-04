package com.lightappbuilder.lab4.labmap.dynamicmap;

import android.content.Context;
import android.text.TextUtils;
import android.util.Log;

import com.baidu.mapapi.map.MapStatus;
import com.baidu.mapapi.map.Marker;
import com.baidu.mapapi.map.MarkerOptions;
import com.baidu.mapapi.model.LatLngBounds;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.lightappbuilder.lab4.labmap.AnnotationEventHelper;
import com.lightappbuilder.lab4.labmap.LABMapView;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Created by yinhf on 2016/12/26.
 */
public class LABDynamicMapView extends LABMapView {
    private static final String TAG = "LABDynamicMapView";
    public static final boolean DEBUG = true;

    private List<Layer> layers = Collections.emptyList();
    private String query;

    private static LayerMarkerOptionsProvider sLayerMarkerOptionsProvider;

    public static void setLayerMarkerOptionsProvider(LayerMarkerOptionsProvider provider) {
        sLayerMarkerOptionsProvider = provider;
    }

    public LABDynamicMapView(Context context, ReactApplicationContext reactApplicationContext) {
        super(context, reactApplicationContext);
    }

    private Runnable doStatusChange = new Runnable() {
        @Override
        public void run() {
            if(isDestroyed) {
                return;
            }
            if (layers.isEmpty()) {
                return;
            }
            MapStatus mapStatus = map.getMapStatus();
            if(DEBUG) Log.i(TAG, "doStatusChange mapStatus=" + mapStatus);
            LatLngBounds bounds = mapStatus.bound;
            float zoom = mapStatus.zoom;

            for (Layer layer : layers) {
                boolean visible = zoom >= layer.getMinZoom() && zoom <= layer.getMaxZoom();
                if (visible != layer.isVisible()) {
                    layer.setVisible(visible);
                }
                if (visible) {
                    layer.load(bounds);
                }
            }
        }
    };

    @Override
    protected void initMap() {
        super.initMap();
        map.setMaxAndMinZoomLevel(23, 6);
    }

    @Override
    public void onDropViewInstance() {
        if (!layers.isEmpty()) {
            for (Layer layer : layers) {
                layer.onDestroy(false);
            }
        }
        super.onDropViewInstance();
    }

    @Override
    public void onMapStatusChangeFinish(MapStatus mapStatus) {
        super.onMapStatusChangeFinish(mapStatus);
        if (layers.isEmpty()) {
            return;
        }
        removeCallbacks(doStatusChange);
        postDelayed(doStatusChange, 80);
    }

    @Override
    public boolean onMarkerClick(Marker marker) {
        if(DEBUG) Log.i(TAG, "onMarkerClick title:" + marker.getTitle());
        String data = marker.getTitle();
        if (TextUtils.isEmpty(data)) {
            return false;
        }
        // TODO 判断marker 是来自哪个图层的

        AnnotationEventHelper.emitPress(reactApplicationContext, this, data);

        return true;
    }

    public void setLayers(ReadableArray layerConfigs) {
        final List<Layer> newLayers = new ArrayList<>();
        final List<Layer> curLayers = new ArrayList<>(layers);
        for (int i = 0; i < layerConfigs.size(); ++i) {
            ReadableMap layerConfig = layerConfigs.getMap(i);
            String url = layerConfig.getString("url");
            Layer addLayer = null;
            for (Layer layer : curLayers) {
                if (url.equals(layer.getUrl())) {
                    addLayer = layer;
                    curLayers.remove(layer);
                    break;
                }
            }
            if (addLayer == null) {
                addLayer = new Layer(this, layerConfig);
            }
            newLayers.add(addLayer);
        }
        if (!curLayers.isEmpty()) {
            for (Layer layer : layers) {
                layer.onDestroy(true);
            }
        }
        layers = newLayers;
        postDelayed(doStatusChange, 500);
    }

    public void setQuery(final String query) {
        if (!TextUtils.equals(query, this.query)) {
            this.query = query;
            for (Layer layer : layers) {
                layer.setQuery(query);
            }
        }
    }

    @Override
    public void setAnnotations(ReadableArray array) {
        // 不支持
    }

    MarkerOptions createLayerMarkerOptions(String markerType, PointData pointData) {
        MarkerOptions markerOptions = sLayerMarkerOptionsProvider.getLayerMarkerOptions(markerType, pointData);
        markerOptions.position(pointData.position);
        markerOptions.title(pointData.data.toString());
//        Bundle bundle = new Bundle();
//        bundle.putString("data", pointData.data.toString());
//        markerOptions.extraInfo(bundle);
        //markerOptions.position(new LatLng(pointData.position.latitude + (Math.random() - 0.5) * 0.12, pointData.position.longitude + (Math.random() - 0.5) * 0.12));
        return markerOptions;
    }
}
