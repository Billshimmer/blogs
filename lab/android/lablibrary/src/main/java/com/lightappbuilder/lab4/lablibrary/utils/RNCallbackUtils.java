package com.lightappbuilder.lab4.lablibrary.utils;

import com.facebook.react.bridge.Callback;

/**
 * Created by yinhf on 16/9/28.
 */

public class RNCallbackUtils {

    /**
     * 对于一些很少发生,用户又不关心的错误统一回调unknown
     * 如
     * 1.getCurrentActivity 返回null
     */
    public static void callbackUnknownError(Callback callback) {
        callback.invoke(RNArgumentsUtils.createMap("unknown-error", "unknown-error"));
    }

    /**
     * 回调取消
     */
    public static void callbackCancel(Callback callback) {
        callback.invoke(RNArgumentsUtils.createMap("cancel", "cancel"));
    }
}
