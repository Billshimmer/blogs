package com.lightappbuilder.lab4.labmap;

import com.baidu.location.BDLocation;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;

/**
 * Created by yinhf on 16/7/19.
 */
public class LABLocationModule extends ReactContextBaseJavaModule {
    private static final String TAG = "LABLocationModule";

    public LABLocationModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "LABLocationModule";
    }

    @ReactMethod
    public void getCurrentPosition(final ReadableMap options, final Callback callback) {
        final long maximumAge;
        //timeout
        //enableHighAccuracy
        //distanceFilter
        final String coordType;
        if (options.hasKey("maximumAge")) {
            //定位缓存有效时间(毫秒)
            maximumAge = (long) options.getDouble("maximumAge");
        } else {
            maximumAge = 45000;
        }
        if (options.hasKey("coordType")) {
            coordType = options.getString("coordType");
        } else {
            coordType = null;
        }
        LocationClientManager.getInstance().requestLocation(new LocationClientManager.LocationCallback() {
            @Override
            public void onReceiveLocation(BDLocation bdLocation, boolean isTimeout) {
                if (isTimeout) {
                    bdLocation = LocationClientManager.getInstance().getValidLastKnownLocation(maximumAge);
                }
                if (LocationClientManager.isValidLocation(bdLocation)) {
                    WritableMap locationData = Arguments.createMap();
                    double longitude;
                    double latitude;
                    if ("gcj02".equals(coordType)) {
                        double[] lnglatArr = CoordinateTransformUtil.bd09togcj02(bdLocation.getLongitude(), bdLocation.getLatitude());
                        longitude = lnglatArr[0];
                        latitude = lnglatArr[1];
                    } else {
                        longitude = bdLocation.getLongitude();
                        latitude = bdLocation.getLatitude();
                    }

                    locationData.putDouble("longitude", longitude);
                    locationData.putDouble("latitude", latitude);
                    locationData.putString("address", bdLocation.getAddrStr());
                    locationData.putString("city", bdLocation.getCity());
                    locationData.putDouble("radius", bdLocation.getRadius());
                    callback.invoke(null, locationData);
                } else {
                    WritableMap errorMap = Arguments.createMap();
                    errorMap.putInt("code", isTimeout ? 2 : 1);
                    errorMap.putString("message", isTimeout ? "timeout" : "error");
                    callback.invoke(errorMap);
                }
            }
        },getCurrentActivity());
    }
}
