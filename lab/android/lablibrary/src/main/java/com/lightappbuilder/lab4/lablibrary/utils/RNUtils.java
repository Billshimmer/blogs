package com.lightappbuilder.lab4.lablibrary.utils;

import android.view.View;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.uimanager.ReactShadowNode;
import com.facebook.react.uimanager.UIManagerModule;

/**
 * Created by yinhf on 16/7/12.
 */
public class RNUtils {
    private static final String TAG = "RNUtils";

    /**
     * 获取ShadowNode
     * NOTE 必须在NativeModulesQueueThread线程上执行
     */
    public static ReactShadowNode resolveShadowNode(ReactContext context, int reactTag) {
        return context.getNativeModule(UIManagerModule.class).getUIImplementation().resolveShadowNode(reactTag);
    }

    /**
     * 通过reactTag  获取View
     * NOTE 必须在主线程执行
     * View不存在会抛出异常
     */
    public static View resolveView(ReactContext context, int reactTag) {
        return context.getNativeModule(UIManagerModule.class).getUIImplementation().resolveView(reactTag);
    }

}
