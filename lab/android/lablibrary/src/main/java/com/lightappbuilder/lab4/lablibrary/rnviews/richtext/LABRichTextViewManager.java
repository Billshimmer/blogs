package com.lightappbuilder.lab4.lablibrary.rnviews.richtext;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.BaseViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.lightappbuilder.lab4.lablibrary.utils.L;
import com.lightappbuilder.lab4.lablibrary.utils.RNUtils;


/**
 * Created by yinhf on 16/7/11.
 */
public class LABRichTextViewManager extends BaseViewManager<LABRichTextView, LABRichTextShadowNode> implements LABRichTextView.OnRequestLayoutListener {
    private static final String TAG = "LABRichTextViewManager";
    public static final String REACT_CLASS = "LABRichText";

    private ReactApplicationContext reactApplicationContext;

    public LABRichTextViewManager(ReactApplicationContext reactApplicationContext) {
        this.reactApplicationContext = reactApplicationContext;
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected LABRichTextView createViewInstance(ThemedReactContext reactContext) {
        return new LABRichTextView(reactContext);
    }

    @Override
    public void updateExtraData(LABRichTextView root, Object extraData) {

    }

    @Override
    public LABRichTextShadowNode createShadowNodeInstance() {
        return new LABRichTextShadowNode(reactApplicationContext);
    }

    @Override
    public Class<? extends LABRichTextShadowNode> getShadowNodeClass() {
        return LABRichTextShadowNode.class;
    }

    @ReactProp(name = "text")
    public void setText(final LABRichTextView view, String text) {
        L.d(TAG, "setText() called with view = ", view, ", text = ", text, "");
        reactApplicationContext.runOnNativeModulesQueueThread(new Runnable() {
            @Override
            public void run() {
                final LABRichTextShadowNode shadowNode = (LABRichTextShadowNode) RNUtils.resolveShadowNode(reactApplicationContext, view.getId());
                if (shadowNode != null) {
                    shadowNode.setRichTextView(view);
                }
            }
        });
        view.setOnRequestLayoutListener(this);
        view.setRichText(text);

    }

    @Override
    public void onDropViewInstance(LABRichTextView view) {
        super.onDropViewInstance(view);
        view.setOnRequestLayoutListener(null);
    }

    @Override
    public void onRequestLayout(final LABRichTextView view) {
        //L.i(TAG, "onRequestLayout xxxxxxxxxx");
        //将RichText的requestLayout通知给shadowNode
        //XXX 对shadowNode的操作需要在nativeModulesQueueThread上执行
        reactApplicationContext.runOnNativeModulesQueueThread(new Runnable() {
            @Override
            public void run() {
                final LABRichTextShadowNode shadowNode = (LABRichTextShadowNode) RNUtils.resolveShadowNode(reactApplicationContext, view.getId());
                if (shadowNode != null) {
                    shadowNode.requestLayout();
                }
            }
        });
    }
}
