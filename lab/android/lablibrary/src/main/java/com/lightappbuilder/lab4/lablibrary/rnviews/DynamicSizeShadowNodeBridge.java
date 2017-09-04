package com.lightappbuilder.lab4.lablibrary.rnviews;

import android.view.View;

import com.facebook.react.bridge.ReactContext;
import com.lightappbuilder.lab4.lablibrary.utils.RNUtils;

/**
 * Created by yinhf on 16/9/28.
 */
public class DynamicSizeShadowNodeBridge {
    private static final String TAG = "DynamicSizeShadowNodeBridge";

    private View view;
    private ReactContext reactContext;
    volatile long widthHeight;
    private Runnable updateSizeRunnable = new Runnable() {
        @Override
        public void run() {
            DynamicSizeShadowNode shadowNode = (DynamicSizeShadowNode) RNUtils.resolveShadowNode(reactContext, view.getId());
            if (shadowNode != null) {
                shadowNode.updateSize(DynamicSizeShadowNodeBridge.this);
            }
        }
    };

    public DynamicSizeShadowNodeBridge(ReactContext reactContext, View view) {
        this.reactContext = reactContext;
        this.view = view;
    }

    public void updateSize(int width, int widthMode, int height, int heightMode) {
        // 借用MeasureSpec 实现对size和mode 的组装
        int widthSpec = View.MeasureSpec.makeMeasureSpec(width, widthMode);
        int heightSpec = View.MeasureSpec.makeMeasureSpec(height, heightMode);
        long widthHeight = ((long) widthSpec) << 32 | (heightSpec & 0x00000000FFFFFFFFL);

        if (widthHeight != this.widthHeight) {
            this.widthHeight = widthHeight;
            reactContext.runOnNativeModulesQueueThread(updateSizeRunnable);
        }
    }

    public void disableSizeControlled() {
        this.widthHeight = 0;
        reactContext.runOnNativeModulesQueueThread(new Runnable() {
            @Override
            public void run() {
                DynamicSizeShadowNode shadowNode = (DynamicSizeShadowNode) RNUtils.resolveShadowNode(reactContext, view.getId());
                if (shadowNode != null) {
                    shadowNode.disableSizeControlled();
                }
            }
        });
    }
}
