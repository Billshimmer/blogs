package com.lightappbuilder.lab4.labmap;

import com.baidu.mapapi.map.BaiduMap;
import com.baidu.mapapi.map.MapStatusUpdateFactory;
import com.baidu.mapapi.map.MyLocationConfiguration;
import com.baidu.mapapi.map.UiSettings;
import com.baidu.mapapi.model.LatLng;
import com.baidu.mapapi.model.LatLngBounds;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.Map;

import javax.annotation.Nullable;

/**
 * Created by yinhf on 16/6/30.
 */
public class LABMapViewManager<T extends LABMapView> extends SimpleViewManager<T> {
    private static final String TAG = "LABMapViewManager";

    private static final String REACT_CLASS = "LABMapView";

    public static final int COMMAND_SET_MAP_STATUS = 1;
    public static final int COMMAND_LOCATE = 2;

    private static ViewMarkerOptionsProvider sViewMarkerOptionsProvider;

    public static void setViewMarkerOptionsProvider(ViewMarkerOptionsProvider viewMarkerOptionsProvider) {
        sViewMarkerOptionsProvider = viewMarkerOptionsProvider;
    }

    public static ViewMarkerOptionsProvider getsViewMarkerOptionsProvider() {
        return sViewMarkerOptionsProvider;
    }

    protected ReactApplicationContext reactApplicationContext;

    public LABMapViewManager(ReactApplicationContext reactApplicationContext) {
        this.reactApplicationContext = reactApplicationContext;
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected T createViewInstance(ThemedReactContext reactContext) {
        LABMapView mapView = new LABMapView(reactContext, reactApplicationContext);
        BaiduMap map = mapView.getMapView().getMap();

        UiSettings uiSettings = map.getUiSettings();
        uiSettings.setRotateGesturesEnabled(false);
        uiSettings.setOverlookingGesturesEnabled(false);
        uiSettings.setCompassEnabled(false);

        map.setMyLocationConfigeration(new MyLocationConfiguration(MyLocationConfiguration.LocationMode.NORMAL, true, null));

        return (T) mapView;
    }

    @Override
    public void onDropViewInstance(T view) {
        super.onDropViewInstance(view);
        view.onDropViewInstance();
    }

    /**
     * 设置坐标系类型,设定之后所有输入坐标必须确保为该类型,所有输出坐标自动转为该类型
     * 支持 bd09 gcj02 wgs84, 默认gcj02
     * TODO 修改为 coordType
     */
    @ReactProp(name = "coorType")
    public void setCoorType(final T view, String coordType) {
        switch (coordType) {
            case "bd09":
                view.setCoordType(CoordinateTransformUtil.COOR_TYPE_BD09);
                break;
            case "gcj02":
                view.setCoordType(CoordinateTransformUtil.COOR_TYPE_GCJ02);
                break;
            default:
                view.setCoordType(CoordinateTransformUtil.COOR_TYPE_WGS84);
                break;
        }
    }

    @ReactProp(name = "showsUserLocation", defaultBoolean = false)
    public void setShowsUserLocation(final T view, boolean show) {
        view.setShowsUserLocation(show);
    }

    //followUserLocation  TODO
    //showsPointsOfInterest TODO

    @ReactProp(name = "showsCompass", defaultBoolean = false)
    public void setShowsCompass(final T view, boolean show) {
        view.getMap().getUiSettings().setCompassEnabled(show);
    }

    @ReactProp(name = "zoomEnabled", defaultBoolean = false)
    public void setZoomEnabled(final T view, boolean enabled) {
        view.getMap().getUiSettings().setZoomGesturesEnabled(enabled);
    }

    @ReactProp(name = "rotateEnabled", defaultBoolean = false)
    public void setRotateEnabled(final T view, boolean enabled) {
        view.getMap().getUiSettings().setRotateGesturesEnabled(enabled);
    }

    //pitchEnabled scrollEnabled TODO

    @ReactProp(name = "mapType")
    public void setMapType(final T view, String mapType) {
        switch (mapType) {
            case "satellite":
                view.getMap().setMapType(BaiduMap.MAP_TYPE_SATELLITE);
                break;
            case "standard":
            default:
                view.getMap().setMapType(BaiduMap.MAP_TYPE_NORMAL);
                break;
        }
    }

    @ReactProp(name = "region")
    public void setRegion(final T view, ReadableMap map) {
        double centerLnglatArr[] = CoordinateTransformUtil.transform(map.getDouble("longitude"), map.getDouble("latitude"), view.getCoordType(), CoordinateTransformUtil.COOR_TYPE_BD09);
        double hLatitudeDelta = map.getDouble("latitudeDelta") / 2;
        double hLongitudeDelta = map.getDouble("longitudeDelta") / 2;
        LatLng northeast = new LatLng(centerLnglatArr[1] + hLatitudeDelta, centerLnglatArr[0] + hLongitudeDelta);
        LatLng southwest = new LatLng(centerLnglatArr[1] - hLatitudeDelta, centerLnglatArr[0] - hLongitudeDelta);
        LatLngBounds latLngBounds = new LatLngBounds.Builder().include(northeast).include(southwest).build();
        view.getMap().setMapStatus(MapStatusUpdateFactory.newLatLngBounds(latLngBounds));
    }


    @ReactProp(name = "annotations")
    public void setAnnotations(final T view, ReadableArray array) {
        view.setAnnotations(array);
    }

    @ReactProp(name = "sendRegionChangeCompleteEvent", defaultBoolean = false)
    public void setSendRegionChangeCompleteEvent(final T view, boolean send) {
        view.setSendRegionChangeCompleteEvent(send);
    }

    @ReactProp(name = "locateInitialRegion", defaultBoolean = false)
    public void setLocateInitialRegion(final T view, boolean locateInitialRegion) {
        view.setLocateInitialRegion(locateInitialRegion);
    }

    @ReactProp(name = "showsLocateButton", defaultBoolean = false)
    public void setShowsLocateButton(final T view, boolean showsLocateButton) {
        view.setShowsLocateButton(showsLocateButton);
    }

    @ReactProp(name = "showZoomControls", defaultBoolean = true)
    public void setShowZoomControls(final T view, boolean showZoomControls) {
        view.getMapView().showZoomControls(showZoomControls);
    }

    @Override
    public @Nullable Map<String, Integer> getCommandsMap() {
        return MapBuilder.of("setMapStatus", COMMAND_SET_MAP_STATUS,
                "locate", COMMAND_LOCATE);
    }

    @Override
    public void receiveCommand(T view, int commandId, @Nullable ReadableArray args) {
        super.receiveCommand(view, commandId, args);
        switch (commandId) {
            case COMMAND_SET_MAP_STATUS:
                // TODO
                break;
            case COMMAND_LOCATE:
                view.toCurrentPosition();
                break;
        }
    }

    @Override
    public @Nullable Map getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.builder()
                .put("onRegionChangeComplete", MapBuilder.of("registrationName", "onRegionChangeComplete"))
                .put("onAnnotationPress", MapBuilder.of("registrationName", "onAnnotationPress"))
                .build();
    }

}
