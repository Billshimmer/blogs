package com.lightappbuilder.lab4.test;

import android.graphics.Color;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.BaseViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.UIImplementation;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.lightappbuilder.lab4.lablibrary.utils.L;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

/**
 * Created by yinhf on 16/7/6.
 */
public class LABTestViewManager extends BaseViewManager<TestView, TestViewShadowNode> {
    private static final String TAG = "LABTestViewManager";
    public static final String REACT_CLASS = "LABTestView";

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected TestView createViewInstance(ThemedReactContext reactContext) {
        L.d(TAG, "createViewInstance() called with reactContext = ", reactContext, "");
        return new TestView(reactContext);
    }

//    @ReactProp(name = "backgroundColor")
//    public void setBackgroundColor(TestView view, String colorStr) {
//        L.d(TAG, "setBackgroundColor() called with view = ", view, ", colorStr = ", colorStr, "");
//        view.setBackgroundColor(Color.parseColor(colorStr));
//    }

    @ReactProp(name = "rotationY")
    public void setRotationY(TestView view, float rotationY) {
        L.d(TAG, "setRotationY() called with view = ", view, ", translationY = ", rotationY, "");
        view.setRotationY(rotationY);
    }

    @ReactProp(name = "labViewId")
    public void setLabViewId(TestView view, String id) {
        L.d(TAG, "setLabViewId() called with view = ", view, ", id = ", id, "");
        view.setLabViewId(id);
    }

    @ReactProp(name = "obj1")
    public void setObj1(TestView view, ReadableMap obj) {
        L.i(TAG, "setObj1 ", obj, obj.getType("aaa"));
//        L.i(TAG, "setObj1 ", obj.getMap("aaa"));
//        L.i(TAG, "setObj1 ", obj.getMap("bbb"));
        //L.i(TAG, "setObj1 ", obj.getString("aaa"));
    }

    @ReactProp(name = "prop1")
    public void setProp1(TestView view, String value) {
        L.d(TAG, "setObj1() called with view = ", view, ", value = ", value, "");

//        int reactTag = view.getId();
//        try {
//            Method method_resolveShadowNode = UIImplementation.class.getDeclaredMethod("resolveShadowNode", int.class);
//            method_resolveShadowNode.setAccessible(true);
//            TestViewShadowNode shadowNode = (TestViewShadowNode) method_resolveShadowNode.invoke(((ReactContext) view.getContext()).getNativeModule(UIManagerModule.class).getUIImplementation(), reactTag);
//            //  NOTE 对shadowNode的方法调用需在NativeMethodThread上
//            shadowNode.xxx();
//        } catch (NoSuchMethodException e) {
//            e.printStackTrace();
//        } catch (InvocationTargetException e) {
//            e.printStackTrace();
//        } catch (IllegalAccessException e) {
//            e.printStackTrace();
//        }
    }

    @Override
    public TestViewShadowNode createShadowNodeInstance() {
        L.d(TAG, "createShadowNodeInstance() called with ");
        return new TestViewShadowNode();
    }

    @Override
    public Class<TestViewShadowNode> getShadowNodeClass() {
        L.d(TAG, "getShadowNodeClass() called with ");
        return TestViewShadowNode.class;
    }

    @Override
    public void updateExtraData(TestView root, Object extraData) {
        L.d(TAG, "updateExtraData() called with root = ", root, ", extraData = ", extraData, "");
    }
}
