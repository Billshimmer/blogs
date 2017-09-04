package com.lightappbuilder.lab4.labpay;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.pingplusplus.android.Pingpp;

/**
 * Created by yinhf on 16/8/10.
 */
public class LABPayModule extends ReactContextBaseJavaModule {
    private static final String TAG = "LABPayModule";

    public LABPayModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "LABPayModule";
    }

    @ReactMethod
    public void pay(final ReadableMap options, final Promise promise) {
        if (options == null || !options.hasKey("charge")) {
            promise.reject("100", "charge is empty");
            return;
        }
        final Activity activity = getCurrentActivity();
        if (activity == null) {
            promise.reject("101", "activity destroyed");
            return;
        }
        ActivityEventListener activityEventListener = new BaseActivityEventListener() {
            @Override
            public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
                if (requestCode == Pingpp.REQUEST_CODE_PAYMENT) {
                    getReactApplicationContext().removeActivityEventListener(this);
                    if (resultCode == Activity.RESULT_OK) {
                        Bundle extras = data.getExtras();
                        String result = extras.getString("pay_result");
//                        String errorMsg = extras.getString("error_msg"); // 错误信息
//                        String extraMsg = extras.getString("extra_msg"); // 错误信息
                        if ("success".equals(result)) {
                            promise.resolve(Arguments.fromBundle(extras));
                        } else {
                            promise.reject(result, extras.getString("error_msg"));
                        }
                    } else {
                        promise.reject("cancel", "cancel");
                    }
                }
            }
        };
        getReactApplicationContext().addActivityEventListener(activityEventListener);
        activity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Pingpp.createPayment(activity, options.getString("charge"));
            }
        });
    }
}
