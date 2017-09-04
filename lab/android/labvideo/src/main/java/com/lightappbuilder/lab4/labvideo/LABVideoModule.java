package com.lightappbuilder.lab4.labvideo;

import android.app.Activity;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.lightappbuilder.lab4.lablibrary.utils.RNCallbackUtils;

/**
 * Created by yinhf on 16/10/21.
 */

public class LABVideoModule extends ReactContextBaseJavaModule {
    private static final String TAG = "LABVideoModule";

    public LABVideoModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "LABVideoModule";
    }

    @ReactMethod
    public void play(final ReadableMap options, Callback callback) {
        final Activity activity = getCurrentActivity();
        if (activity == null) {
            RNCallbackUtils.callbackUnknownError(callback);
            return;
        }
        activity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                LABVideoActivity.open(activity, options.getString("uri"), options.getString("title"));
            }
        });
    }
}
