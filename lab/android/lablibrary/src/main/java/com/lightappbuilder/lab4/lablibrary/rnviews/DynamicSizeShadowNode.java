package com.lightappbuilder.lab4.lablibrary.rnviews;

import android.view.View.MeasureSpec;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.uimanager.LayoutShadowNode;
import com.facebook.yoga.YogaMeasureFunction;
import com.facebook.yoga.YogaMeasureMode;
import com.facebook.yoga.YogaMeasureOutput;
import com.facebook.yoga.YogaNodeAPI;
import com.lightappbuilder.lab4.lablibrary.utils.RNUtils;

/**
 * Created by yinhf on 16/9/26.
 * 宽高可受外部控制的ShadowNode
 */
public class DynamicSizeShadowNode extends LayoutShadowNode implements YogaMeasureFunction {
    private static final String TAG = "SizeControlledShadowNod";

    public static int WRAP_CONTENT = MeasureSpec.AT_MOST;
    public static int MATCH_PARENT = MeasureSpec.EXACTLY;

    private static long UNDEFINED_WIDTH_HEIGHT = Long.MAX_VALUE;

    private DynamicSizeShadowNodeBridge sizeBridge;
    private long lastMeasuredWidthHeight = UNDEFINED_WIDTH_HEIGHT;

    @Override
    public long measure(YogaNodeAPI node, float width, YogaMeasureMode widthMode, float height, YogaMeasureMode heightMode) {
        long widthHeight = sizeBridge.widthHeight;
        lastMeasuredWidthHeight = widthHeight;
        float outputWidth = getSize((int) (widthHeight >>> 32), width, widthMode);
        float outputHeight = getSize((int) (widthHeight & 0x00000000FFFFFFFFL), height, heightMode);
        return YogaMeasureOutput.make(outputWidth, outputHeight);
    }

    private static float getSize(int viewSpec, float size, YogaMeasureMode mode) {
        if (mode == YogaMeasureMode.EXACTLY) {
            return size;
        }
        int viewMode = MeasureSpec.getMode(viewSpec);
        int viewSize = MeasureSpec.getSize(viewSpec);
        if (mode == YogaMeasureMode.AT_MOST) {
            if (viewMode == MATCH_PARENT) {
                return size;
            }
            return Math.min(viewSize, size);
        }
        return viewSize;
    }

    void updateSize(DynamicSizeShadowNodeBridge sizeBridge) {
        if (this.sizeBridge == null) {
            this.sizeBridge = sizeBridge;
            setMeasureFunction(this);
        }
        if (sizeBridge.widthHeight != lastMeasuredWidthHeight) {
            dirty();
        }
    }

    void disableSizeControlled() {
        sizeBridge = null;
        lastMeasuredWidthHeight = UNDEFINED_WIDTH_HEIGHT;
        setMeasureFunction(null);
    }

    public static void disableSizeControlled(final ReactContext reactContext, final int reactTag) {
        reactContext.runOnNativeModulesQueueThread(new Runnable() {
            @Override
            public void run() {
                DynamicSizeShadowNode shadowNode = (DynamicSizeShadowNode) RNUtils.resolveShadowNode(reactContext, reactTag);
                if (shadowNode != null) {
                    shadowNode.disableSizeControlled();
                }
            }
        });
    }

    public static class SizeHolder {
        public volatile long widthHeight;
    }
}
