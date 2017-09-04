package com.lightappbuilder.lab4.lablibrary.rnmodules;

import android.os.Build;
import android.text.TextUtils;
import android.webkit.CookieManager;
import android.webkit.CookieSyncManager;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.lightappbuilder.lab4.lablibrary.utils.AppContextUtils;

/**
 * Created by yinhf on 16/6/24.
 */
public class CookieManagerModule extends ReactContextBaseJavaModule {

    //private ForwardingCookieHandler mForwardingCookieHandler;
    private static CookieManager mCookieManager;

    public CookieManagerModule(ReactApplicationContext context) {
        super(context);
    }

    public String getName() {
        return "LABCookieManager";
    }

//    private ForwardingCookieHandler getForwardingCookieHandler() {
//        if (mForwardingCookieHandler == null) {
//            try {
//                Field field_cookieHandler = NetworkingModule.class.getDeclaredField("mCookieHandler");
//                field_cookieHandler.setAccessible(true);
//                mForwardingCookieHandler = (ForwardingCookieHandler) field_cookieHandler.get(getReactApplicationContext().getNativeModule(NetworkingModule.class));
//            } catch (Exception e) {
//                e.printStackTrace();
//            }
//
//        }
//        return mForwardingCookieHandler;
//    }

    public static CookieManager getCookieManager() {
        if (mCookieManager == null) {
            if (Build.VERSION.SDK_INT < 21) {
                // This is to work around a bug where CookieManager may fail to instantiate if
                // CookieSyncManager has never been created. Note that the sync() may not be required but is
                // here of legacy reasons.
                CookieSyncManager syncManager = CookieSyncManager.createInstance(AppContextUtils.get());
                syncManager.sync();
            }
            mCookieManager = CookieManager.getInstance();
        }
        return mCookieManager;
    }

    @ReactMethod
    public void setFromResponse(String url, String value, final Callback callback) {
        if (TextUtils.isEmpty(value)) {
            callback.invoke("value empty!");
            return;
        }
        getCookieManager().setCookie(url, value);
        //每一个set 都会立即触发cookie同步,不要用于有高性能要求的地方
        if (Build.VERSION.SDK_INT < 21) {
            CookieSyncManager.getInstance().sync();
        } else {
            getCookieManager().flush();
        }
        callback.invoke(null, null);
    }

    @ReactMethod
    public void get(String url, final Callback callback) {
        String cookiesStr = getCookieManager().getCookie(url);
        WritableMap map = Arguments.createMap();
        if (cookiesStr != null) {
            String[] cookies = cookiesStr.split(";");
            for (int i = 0; i < cookies.length; ++i) {
                String[] cookieKV = cookies[i].split("=");
                if (cookieKV.length > 1) {
                    map.putString(cookieKV[0].trim(), cookieKV[1]);
                }
            }
        }
        callback.invoke(null, map);
    }

    @ReactMethod
    public void flush() {
        if (Build.VERSION.SDK_INT < 21) {
            CookieSyncManager.getInstance().sync();
        } else {
            getCookieManager().flush();
        }
    }
}
