package com.lightappbuilder.lab4.test;

import android.util.Log;

import com.facebook.react.uimanager.LayoutShadowNode;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.yoga.YogaMeasureFunction;
import com.facebook.yoga.YogaMeasureMode;
import com.facebook.yoga.YogaMeasureOutput;
import com.facebook.yoga.YogaNodeAPI;
import com.lightappbuilder.lab4.lablibrary.utils.L;

/**
 * Created by yinhf on 16/7/11.
 */
public class TestViewShadowNode extends LayoutShadowNode implements YogaMeasureFunction {
    private static final String TAG = "TestViewShadowNode";

    public TestViewShadowNode() {
        setMeasureFunction(this);
    }

    @Override
    public long measure(YogaNodeAPI node, float width, YogaMeasureMode widthMode, float height, YogaMeasureMode heightMode) {
        Log.i(TAG, "measure() called with: node = [" + node + "], width = [" + width + "], widthMode = [" + widthMode + "], height = [" + height + "], heightMode = [" + heightMode + "], tag:" + getReactTag());
        if (widthMode == YogaMeasureMode.UNDEFINED) {
            width = 100;
        }
        if (heightMode == YogaMeasureMode.UNDEFINED) {
            height = 100;
        }
        return YogaMeasureOutput.make(width, height);
    }

    @ReactProp(name = "shadowNodeProp1")
    public void setShadowNodeProp1(String value) {
        L.d(TAG, "setShadowNodeProp1() called with value = ", value, "");
        dirty();
    }

    public void xxx() {
        dirty();
    }
}
