package com.lightappbuilder.lab4.labpush;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.RCTNativeAppEventEmitter;
import com.lightappbuilder.lab4.lablibrary.rnmodules.notification.LABNotificationModule;
import com.lightappbuilder.lab4.lablibrary.utils.IntentUtils;
import com.lightappbuilder.lab4.lablibrary.utils.L;

import java.util.LinkedHashSet;
import java.util.Set;

import cn.jpush.android.api.BasicPushNotificationBuilder;
import cn.jpush.android.api.JPushInterface;
import cn.jpush.android.api.TagAliasCallback;

public class LABPushModule extends ReactContextBaseJavaModule {
    private static final String TAG = "LABPushModule";

    private static boolean isInitialized;
    private static ReactApplicationContext sRAC;
    private static PushReceiverListener sPushReceiverListener;

    public LABPushModule(ReactApplicationContext reactContext) {
        super(reactContext);
        sRAC = reactContext;
        if (!isInitialized) {
            Context context = reactContext.getApplicationContext();
            init(context);
            JPushInterface.setLatestNotificationNumber(context, 3);
            BasicPushNotificationBuilder basicPushNotificationBuilder = new BasicPushNotificationBuilder(context);
            JPushInterface.setDefaultPushNotificationBuilder(basicPushNotificationBuilder);
        }
    }

    public static void init(Context context) {
        if (isInitialized) {
            return;
        }
        JPushInterface.init(context);
        isInitialized = true;
    }

    public static void setPushReceiverListener(PushReceiverListener listener) {
        sPushReceiverListener = listener;
    }

    @Override
    public String getName() {
        return "LABPushModule";
    }

    @ReactMethod
    public void initPush() {
        L.d(TAG, "initPush()");
    }

    @ReactMethod
    public void getInfo(Callback successCallback) {
        L.d(TAG, "getInfo");
        WritableMap map = Arguments.createMap();
        String clientId = JPushInterface.getRegistrationID(getReactApplicationContext());
        map.putString("clientID", clientId);
        map.putString("registrationID", clientId);
        successCallback.invoke(map);
    }

    @ReactMethod
    public void stopPush() {
        L.d(TAG, "stopPush");
        JPushInterface.stopPush(getReactApplicationContext());
    }

    @ReactMethod
    public void resumePush() {
        L.d(TAG, "resumePush");
        JPushInterface.resumePush(getReactApplicationContext());
    }

    @ReactMethod
    public void setTags(final ReadableArray tags, final Callback callback) {
        L.d(TAG, "setTags() called with strArray = ", tags);
        Set<String> tagSet = new LinkedHashSet<>();
        if (tags != null) {
            for (int i = 0; i < tags.size(); i++) {
                if (!PushUtils.isValidTagAndAlias(tags.getString(i))) {
                    callback.invoke("Invalid tag: " + tags.getString(i));
                    return;
                }
                tagSet.add(tags.getString(i));
            }
        }
        JPushInterface.setAliasAndTags(getReactApplicationContext(), null,
                tagSet, new TagAliasCallback() {
                    @Override
                    public void gotResult(int status, String desc, Set<String> set) {
                        L.d(TAG, "setTags gotResult() called with status = ", status, ", desc = ", desc, ", set = ", set);
                        switch (status) {
                            case 0:
                                callback.invoke(null, status);
                                break;
                            case 6002:
                                callback.invoke("timeout", status);
                                break;
                            default:
                                callback.invoke("unknown-error", status);
                                break;
                        }
                    }
                });
    }

    @ReactMethod
    public void setAlias(String str, final Callback callback) {
        L.d(TAG, "setAlias() called with str = ", str);
        final String alias = str.trim();
        if (TextUtils.isEmpty(str)) {
            return;
        }
        JPushInterface.setAliasAndTags(getReactApplicationContext(), alias, null, new TagAliasCallback() {
            @Override
            public void gotResult(int status, String desc, Set<String> set) {
                L.d(TAG, "setAlias gotResult() called with status = ", status, ", desc = ", desc, ", set = ", set);
                switch (status) {
                    case 0:
                        callback.invoke(null, status);
                        break;
                    case 6002:
                        callback.invoke("timeout", status);
                        break;
                    default:
                        callback.invoke("unknown-error", status);
                        break;
                }
            }
        });
    }

    @ReactMethod
    public void removeAlias(final Callback callback) {
        L.d(TAG, "removeAlias()");
        JPushInterface.setAliasAndTags(getReactApplicationContext(), "", null, new TagAliasCallback() {
            @Override
            public void gotResult(int status, String desc, Set<String> set) {
                L.d(TAG, "setAlias gotResult() called with status = ", status, ", desc = ", desc, ", set = ", set);
                switch (status) {
                    case 0:
                        callback.invoke(null, status);
                        break;
                    case 6002:
                        callback.invoke("timeout", status);
                        break;
                    default:
                        callback.invoke("unknown-error", status);
                }
            }
        });
    }

    @ReactMethod
    public void clearAllNotifications() {
        JPushInterface.clearAllNotifications(getReactApplicationContext());
    }

    @ReactMethod
    public void setBadge() {
        //TODO
    }

    @ReactMethod
    public void getPushState(Callback callback) {
        callback.invoke(null, JPushInterface.isPushStopped(getReactApplicationContext()) ? 0 : 1);
    }

    static void onPushReceive(Context context, Intent data) {
        String action = data.getAction();
        Bundle extraBundle = data.getExtras();
        //Log.i(TAG, "onPushReceive: data=" + data.toString() + " action=" + action + " extras=" + bundle + " sRAC=" + sRAC);
        if (JPushInterface.ACTION_NOTIFICATION_RECEIVED.equals(action)) {
            sendPushEvent("LAB_PUSH_NOTIFICATION_RECEIVED",
                    extraBundle.getString(JPushInterface.EXTRA_NOTIFICATION_TITLE),
                    extraBundle.getString(JPushInterface.EXTRA_ALERT),
                    extraBundle.getString(JPushInterface.EXTRA_EXTRA));
        } else if(JPushInterface.ACTION_MESSAGE_RECEIVED.equals(action)) {
            sendPushEvent("LAB_PUSH_MESSAGE_RECEIVED",
                    extraBundle.getString(JPushInterface.EXTRA_TITLE),
                    extraBundle.getString(JPushInterface.EXTRA_MESSAGE),
                    extraBundle.getString(JPushInterface.EXTRA_EXTRA));
        } else if (JPushInterface.ACTION_NOTIFICATION_OPENED.equals(action)) {
            Intent intent = IntentUtils.getLaunchIntent(context);
            intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_NEW_TASK);
            Bundle notificationData = new Bundle();
            notificationData.putString("lab_notification_type", "PUSH"); //标记通知类型为PUSH
            notificationData.putString("title", extraBundle.getString(JPushInterface.EXTRA_NOTIFICATION_TITLE));
            notificationData.putString("alert", extraBundle.getString(JPushInterface.EXTRA_ALERT));
            notificationData.putString("extra", extraBundle.getString(JPushInterface.EXTRA_EXTRA));
            intent.putExtra(LABNotificationModule.NOTIFICATION_INTENT_KEY, notificationData);
            context.startActivity(intent);
        } else if (JPushInterface.ACTION_REGISTRATION_ID.equalsIgnoreCase(action)) {
            Log.i(TAG, "onPushReceive: ACTION_REGISTRATION_ID:" + extraBundle.getString(JPushInterface.EXTRA_REGISTRATION_ID));
        }
        if (sPushReceiverListener != null) {
            sPushReceiverListener.onPushReceive(context, data);
        }
    }

    private static void sendEvent(String eventName, WritableMap data) {
        sRAC.getJSModule(RCTNativeAppEventEmitter.class).emit(eventName, data);
    }

    private static void sendPushEvent(String eventName, String title, String alert, String extra) {
        if (sRAC == null || !sRAC.hasActiveCatalystInstance()) {
            return;
        }
        WritableMap map = Arguments.createMap();
        map.putString("title", title);
        map.putString("alert", alert);
        map.putString("extra", extra); //NOTE extra为字符串
        sendEvent(eventName, map);
    }
}
