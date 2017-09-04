package com.lightappbuilder.lab4.labmap.dynamicmap;

import com.baidu.mapapi.map.BaiduMap;
import com.baidu.mapapi.map.UiSettings;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.lightappbuilder.lab4.labmap.LABMapViewManager;

/**
 * Created by yinhf on 2016/12/26.
 */

public class LABDynamicMapViewManager extends LABMapViewManager<LABDynamicMapView> {
    private static final String TAG = "LABDynamicMapViewManage";

    public LABDynamicMapViewManager(ReactApplicationContext reactApplicationContext) {
        super(reactApplicationContext);
    }

    @Override
    public String getName() {
        return "LABDynamicMapView";
    }

    @Override
    protected LABDynamicMapView createViewInstance(ThemedReactContext reactContext) {
        LABDynamicMapView labDynamicMapView = new LABDynamicMapView(reactContext, reactApplicationContext);
        BaiduMap map = labDynamicMapView.getMapView().getMap();

        UiSettings uiSettings = map.getUiSettings();
        uiSettings.setRotateGesturesEnabled(false);
        uiSettings.setOverlookingGesturesEnabled(false);
        return labDynamicMapView;
    }

    @ReactProp(name = "layers")
    public void setLayers(final LABDynamicMapView view, ReadableArray layers) {
        view.setLayers(layers);
    }

    @ReactProp(name = "query")
    public void setQuery(final LABDynamicMapView view, String query) {
        view.setQuery(query);
    }
}
