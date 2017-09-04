package com.lightappbuilder.lab4.labmap;

import android.widget.Toast;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;

/**
 * Created by yinhf on 16/8/3.
 */
public class LABNavigationModule extends ReactContextBaseJavaModule {
    private static final String TAG = "LABNavigationModule";

    public LABNavigationModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "LABNavigationModule";
    }

    @ReactMethod
    public void openNavigation(ReadableMap options, Callback callback) {
        if (getCurrentActivity() == null) {
            callback.invoke("activity finished");
            return;
        }
        double lon = options.getDouble("destLongitude");
        double lat = options.getDouble("destLatitude");
        String coordType;
        if (options.hasKey("coordType")) {
            coordType = options.getString("coordType");
        } else {
            coordType = "bd09";
        }
        if(!MapUriApiUtils.openNavigation(getCurrentActivity(), lon, lat, coordType)) {
            Toast.makeText(getReactApplicationContext(), "未安装导航程序", Toast.LENGTH_SHORT).show();
            callback.invoke("未安装导航程序");
            return;
        }
        callback.invoke(null, null);
    }
}
