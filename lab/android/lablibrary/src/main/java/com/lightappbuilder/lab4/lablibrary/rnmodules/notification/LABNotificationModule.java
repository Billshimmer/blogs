package com.lightappbuilder.lab4.lablibrary.rnmodules.notification;

import android.app.Activity;
import android.app.NotificationManager;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.lightappbuilder.lab4.lablibrary.LABActivity;

/**
 * Created by yinhf on 16/8/19.
 * TODO 整合发送与取消通知的功能
 */
public class LABNotificationModule extends ReactContextBaseJavaModule implements ActivityEventListener {
    private static final String TAG = "LABNotificationModule";

    /**
     * Notification 点击触发的Intent的数据存放的key
     * 使得可配合NotificationModule getInitialNotification 和 点击事件
     */
    public static final String NOTIFICATION_INTENT_KEY = "LAB_NOTIFICATION";
    /**
     * 在应用已启动时,通过通知打开app的事件
     */
    private static final String NOTIFICATION_OPENED = "LAB_NOTIFICATION_OPENED";

    public LABNotificationModule(ReactApplicationContext reactContext) {
        super(reactContext);

        reactContext.addActivityEventListener(this);
    }

    @Override
    public String getName() {
        return "LABNotificationModule";
    }

    private void sendEvent(String eventName, Object params) {
        ReactContext reactContext = getReactApplicationContext();
        if (reactContext.hasActiveCatalystInstance()) {
            reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit(eventName, params);
        }
    }

    private WritableMap createNotificationMap(Intent intent, Bundle notification) {
        WritableMap map = Arguments.createMap();
        map.putMap("notification", Arguments.fromBundle(notification));
        //... 其它额外参数
        return map;
    }

    @ReactMethod
    public void getInitialNotification(Promise promise) {
        WritableMap map = null;
        Activity activity = LABActivity.getCurrentActivity();
        if (activity != null) {
            Intent intent = activity.getIntent();
            Bundle bundle = intent.getBundleExtra(NOTIFICATION_INTENT_KEY);
            if (bundle != null) {
                map = createNotificationMap(intent, bundle);
            }
        }
        promise.resolve(map);
    }

    @ReactMethod
    public void cancelAll() {
        NotificationManager notificationManager =
                (NotificationManager) getReactApplicationContext().getSystemService(Context.NOTIFICATION_SERVICE);

        notificationManager.cancelAll();
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {

    }

    @Override
    public void onNewIntent(Intent intent) {
        Bundle bundle = intent.getBundleExtra(NOTIFICATION_INTENT_KEY);
        if (bundle != null) {
            sendEvent(NOTIFICATION_OPENED, createNotificationMap(intent, bundle));
        }
    }
}
