package com.lightappbuilder.lab4.labmap;

import android.content.Context;
import android.text.TextUtils;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.FrameLayout;

import com.baidu.location.BDLocation;
import com.baidu.location.BDLocationListener;
import com.baidu.mapapi.map.BaiduMap;
import com.baidu.mapapi.map.BitmapDescriptor;
import com.baidu.mapapi.map.BitmapDescriptorFactory;
import com.baidu.mapapi.map.MapStatus;
import com.baidu.mapapi.map.MapStatusUpdateFactory;
import com.baidu.mapapi.map.Marker;
import com.baidu.mapapi.map.MarkerOptions;
import com.baidu.mapapi.map.MyLocationData;
import com.baidu.mapapi.map.TextureMapView;
import com.baidu.mapapi.model.LatLng;
import com.baidu.mapapi.model.LatLngBounds;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.RCTEventEmitter;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;

/**
 * Created by yinhf on 16/7/18.
 */
public class LABMapView extends FrameLayout implements LifecycleEventListener, BDLocationListener, BaiduMap.OnMarkerClickListener, BaiduMap.OnMapStatusChangeListener, BaiduMap.OnMapLoadedCallback {
    private static final String TAG = "MapView";

    public static final String ANNOTATION_ID_KEY = "__$id";
    public static BitmapDescriptor DEFAULT_ANNOTATION_ICON = BitmapDescriptorFactory
            .fromResource(R.drawable.icon_default_annotation);

    protected ReactApplicationContext reactApplicationContext;
    protected TextureMapView mapView;
    protected BaiduMap map;
    private boolean isLocationClientStarted;
    private int coordType = CoordinateTransformUtil.COOR_TYPE_BD09;
    private HashMap<String, Marker> annotationMap = new HashMap<>();
    private boolean sendRegionChangeCompleteEvent;
    protected boolean isMapLoaded;
    protected boolean isDestroyed;
    private boolean isInitLocated;
    private boolean locMark;
    // 定位时默认的zoom
    private float locateZoom = 13.5f;

    protected View locateBtn;

    public LABMapView(Context context, ReactApplicationContext reactApplicationContext) {
        super(context);
        this.reactApplicationContext = reactApplicationContext;
        initMap();
    }

    protected void initMap() {
        View view = LayoutInflater.from(getContext()).inflate(getMapLayoutResId(), this);
        mapView = (TextureMapView) view.findViewById(R.id.map);
        map = mapView.getMap();
        map.setOnMapLoadedCallback(this);
        map.setOnMarkerClickListener(this);
        map.setOnMapStatusChangeListener(this);

        locateBtn = view.findViewById(R.id.lab_map_btn_location);
        locateBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                toCurrentPosition();
            }
        });
    }

    protected int getMapLayoutResId() {
        return R.layout.layout_lab_map;
    }

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
        reactApplicationContext.addLifecycleEventListener(this);
        onMapResume();
        updateLocationClientState();
    }

    @Override
    protected void onDetachedFromWindow() {
        super.onDetachedFromWindow();
        reactApplicationContext.removeLifecycleEventListener(this);
        onMapPause();
        stopLocationClient();
    }

    public void onDropViewInstance() {
        onMapDestroy();
    }

    @Override
    public void onHostResume() {
        onMapResume();
    }

    @Override
    public void onHostPause() {
        onMapPause();
    }

    @Override
    public void onHostDestroy() {
        onDropViewInstance();
    }

    protected void onMapResume() {
        if (mapView != null) {
            mapView.onResume();
        }
    }

    protected void onMapPause() {
        if (mapView != null) {
            mapView.onPause();
        }
    }

    protected void onMapDestroy() {
        if (mapView != null) {
            mapView.onDestroy();
            mapView = null;
        }
        isMapLoaded = false;
        isDestroyed = true;
    }

    @Override
    public void onMapLoaded() {
        isMapLoaded = true;
    }

    public TextureMapView getMapView() {
        return mapView;
    }

    public BaiduMap getMap() {
        return map;
    }

    public boolean isLocationClientEnabled() {
        return map.isMyLocationEnabled();
    }

    public boolean isLocationClientStarted() {
        return isLocationClientStarted;
    }

    public boolean isMapLoaded() {
        return isMapLoaded;
    }

    private void startLocationClient() {
        if (isLocationClientStarted) {
            return;
        }
        isLocationClientStarted = true;
        LocationClientManager.getInstance().start(((ThemedReactContext)getContext()).getCurrentActivity());
        LocationClientManager.getInstance().getLocationClient().registerLocationListener(this);
    }

    private void stopLocationClient() {
        if (!isLocationClientStarted) {
            return;
        }
        isLocationClientStarted = false;
        LocationClientManager.getInstance().stop();
        LocationClientManager.getInstance().getLocationClient().unRegisterLocationListener(this);

    }

    private void updateLocationClientState() {
        if (isLocationClientEnabled()) {
            startLocationClient();
        } else {
            stopLocationClient();
        }
    }

    public void setShowsUserLocation(boolean show) {
        if (map.isMyLocationEnabled() == show) {
            return;
        }
        map.setMyLocationEnabled(show);
        updateLocationClientState();
    }

    @Override
    public void onReceiveLocation(BDLocation location) {
        if (location != null && map.isMyLocationEnabled()) {
            MyLocationData locData = new MyLocationData.Builder()
                    .accuracy(location.getRadius())
                    .latitude(location.getLatitude())
                    .longitude(location.getLongitude())
                    .direction(location.getDirection())
                    .build();
            map.setMyLocationData(locData);
            if (locMark) {
                locMark = false;
                animateToLocation(location);
            }
        }
    }

    public LatLng transformInput(double lng, double lat) {
        double[] lnglatArr = CoordinateTransformUtil.transform(lng, lat, coordType, CoordinateTransformUtil.COOR_TYPE_BD09);
        return new LatLng(lnglatArr[1], lnglatArr[0]);
    }

    public LatLng transformOutput(double lng, double lat) {
        double[] lnglatArr = CoordinateTransformUtil.transform(lng, lat, CoordinateTransformUtil.COOR_TYPE_BD09, coordType);
        return new LatLng(lnglatArr[1], lnglatArr[0]);
    }

    public void setCoordType(int coordType) {
        this.coordType = coordType;
    }

    public int getCoordType() {
        return coordType;
    }

    public void setAnnotations(ReadableArray array) {
        HashMap<String, Marker> newAnnotationMap = new HashMap<>();
        HashSet<String> newAnnotationIds = new HashSet<>();
        ArrayList<ReadableMap> annotationsDataToAdd = new ArrayList<>();
        if (array != null) {
            for (int i = 0; i < array.size(); ++i) {
                ReadableMap annData = array.getMap(i);
                String annId = annData.getString(ANNOTATION_ID_KEY);
                newAnnotationIds.add(annId);

                if (annotationMap.get(annId) == null) {
                    annotationsDataToAdd.add(annData);
                }
            }
        }
        for (Map.Entry<String, Marker> entry : annotationMap.entrySet()) {
            if (!newAnnotationIds.contains(entry.getKey())) {
                entry.getValue().remove();
            } else {
                newAnnotationMap.put(entry.getKey(), entry.getValue());
            }
        }
        for (int i = 0; i < annotationsDataToAdd.size(); ++i) {
            ReadableMap addData = annotationsDataToAdd.get(i);
            String annId = addData.getString(ANNOTATION_ID_KEY);
            LatLng latLng = transformInput(addData.getDouble("longitude"), addData.getDouble("latitude"));

            MarkerOptions markerOptions = createMarkerOptions(addData);
            markerOptions.position(latLng).title(String.valueOf(annId));

            Marker marker = (Marker) map.addOverlay(markerOptions);
            newAnnotationMap.put(annId, marker);
        }

        annotationMap = newAnnotationMap;
    }

    protected MarkerOptions createMarkerOptions(ReadableMap addData) {
        MarkerOptions markerOptions;
        if (addData.hasKey("view") && LABMapViewManager.getsViewMarkerOptionsProvider() != null) {
            ReadableMap viewData = addData.getMap("view");
            String type = viewData.getString("type");
            String title = null;
            if (viewData.hasKey("title")) {
                title = viewData.getString("title");
            }
            markerOptions = LABMapViewManager.getsViewMarkerOptionsProvider().getViewMarkerOptions(type, title, viewData);
        } else {
            //TODO 支持 icon 设置
            markerOptions = new MarkerOptions().icon(DEFAULT_ANNOTATION_ICON);
            float anchorX = 0.5f, anchorY = 1.0f;
            if (addData.hasKey("anchorX")) anchorX = (float) addData.getDouble("anchorX");
            if (addData.hasKey("anchorY")) anchorY = (float) addData.getDouble("anchorY");
            markerOptions.anchor(anchorX, anchorY);
        }
        return markerOptions;
    }

    @Override
    public boolean onMarkerClick(Marker marker) {
        String annId = marker.getTitle();
        if (TextUtils.isEmpty(annId)) {
            return false;
        }

        AnnotationEventHelper.emitPress(reactApplicationContext, this, annId);

        return true;
    }

    @Override
    public void onMapStatusChangeStart(MapStatus mapStatus) {

    }

    @Override
    public void onMapStatusChange(MapStatus mapStatus) {

    }

    @Override
    public void onMapStatusChangeFinish(MapStatus mapStatus) {
        if (sendRegionChangeCompleteEvent) {
            reactApplicationContext.getNativeModule(UIManagerModule.class).getEventDispatcher()
                    .dispatchEvent(new Event(getId()) {
                        @Override
                        public String getEventName() {
                            return "onRegionChangeComplete";
                        }

                        @Override
                        public void dispatch(RCTEventEmitter rctEventEmitter) {
                            rctEventEmitter.receiveEvent(getViewTag(), getEventName(), getRegionMap());
                        }
                    });
        }
    }

    private WritableMap getRegionMap() {
        MapStatus mapStatus = map.getMapStatus();
        LatLngBounds bound = mapStatus.bound;
        LatLng center = bound.getCenter();
        center = transformOutput(center.longitude, center.latitude);
        LatLng northeast = bound.northeast;
        LatLng southwest = bound.southwest;
        WritableMap map = Arguments.createMap();
        map.putDouble("longitude", center.longitude);
        map.putDouble("latitude", center.latitude);
        map.putDouble("longitudeDelta", Math.abs(northeast.longitude - southwest.longitude));
        map.putDouble("latitudeDelta", Math.abs(northeast.latitude - southwest.latitude));
        return map;
    }

    public void setSendRegionChangeCompleteEvent(boolean send) {
        this.sendRegionChangeCompleteEvent = send;
    }

    public void setLocateInitialRegion(boolean locateInitialRegion) {
        if (locateInitialRegion && !isInitLocated) {
            isInitLocated = true;
            toCurrentPosition();
        }
    }

    /**
     * 定位
     */
    public void toCurrentPosition() {
        BDLocation location = LocationClientManager.getInstance().getValidLastKnownLocation(20000);
        if (location != null) {
            animateToLocation(location);
            return;
        }
        locMark = true;
        LocationClientManager.getInstance().getLocationClient().requestLocation();
    }

    private void animateToLocation(BDLocation location) {
        LatLng ll = new LatLng(location.getLatitude(), location.getLongitude());
        if (isMapLoaded) {
            map.animateMapStatus(MapStatusUpdateFactory.newLatLngZoom(ll, locateZoom));
        } else {
            map.setMapStatus(MapStatusUpdateFactory.newLatLngZoom(ll, locateZoom));
        }
    }

    public void setShowsLocateButton(boolean showsLocateButton) {
        locateBtn.setVisibility(showsLocateButton ? View.VISIBLE : View.INVISIBLE);
    }

    public void setLocateZoom(float locateZoom) {
        this.locateZoom = locateZoom;
    }
}
