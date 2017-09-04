package com.lightappbuilder.lab4.lablibrary.rnviews.richtext;

import android.view.View.MeasureSpec;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.uimanager.LayoutShadowNode;
import com.facebook.yoga.YogaMeasureFunction;
import com.facebook.yoga.YogaMeasureMode;
import com.facebook.yoga.YogaMeasureOutput;
import com.facebook.yoga.YogaNodeAPI;
import com.lightappbuilder.lab4.lablibrary.utils.L;
import com.lightappbuilder.lab4.lablibrary.utils.UiThreadHelper;

import java.util.concurrent.Callable;

/**
 * Created by yinhf on 16/7/11.
 */
public class LABRichTextShadowNode extends LayoutShadowNode implements YogaMeasureFunction {
    private static final String TAG = "LABRichTextShadowNode";

    private ReactContext reactContext;
    private LABRichTextView richTextView;

    public LABRichTextShadowNode(ReactContext reactContext) {
        this.reactContext = reactContext;
        setMeasureFunction(this);
    }

    public void setRichTextView(LABRichTextView richTextView) {
        this.richTextView = richTextView;
    }

    public void requestLayout() {
        markUpdated();
        if (!hasNewLayout()) {
            try {
                dirty();
            } catch(Exception e) {
                e.printStackTrace();
                L.postException(e);
            }
        }
    }

    @Override
    public long measure(YogaNodeAPI node, float width, YogaMeasureMode widthMode, float height, YogaMeasureMode heightMode) {
        // NOTE measure是在 NativeModulesQueueThread上执行的!
        long output;
        if (widthMode == YogaMeasureMode.EXACTLY && heightMode == YogaMeasureMode.EXACTLY) {
            output = YogaMeasureOutput.make(width, height);
        } else if(richTextView == null) {
            output = YogaMeasureOutput.make(0, 0);
        } else {
            final int widthMeasureSpec;
            if (widthMode == YogaMeasureMode.UNDEFINED || width < 0) {
                widthMeasureSpec = MeasureSpec.makeMeasureSpec(0, MeasureSpec.UNSPECIFIED);
            } else {
                widthMeasureSpec = MeasureSpec.makeMeasureSpec(Math.round(width), MeasureSpec.EXACTLY);
            }

            int measureSpecHeightMode;
            int measureSpecHeight = Math.round(height);
            if (heightMode == YogaMeasureMode.EXACTLY) {
                measureSpecHeightMode = MeasureSpec.EXACTLY;
            } else if (heightMode == YogaMeasureMode.AT_MOST && measureSpecHeight > 0) {
                measureSpecHeightMode = MeasureSpec.AT_MOST;
            } else {
                measureSpecHeightMode = MeasureSpec.UNSPECIFIED;
                measureSpecHeight = 0;
            }
            final int heightMeasureSpec = MeasureSpec.makeMeasureSpec(measureSpecHeight, measureSpecHeightMode);

            try {
                //long start = SystemClock.elapsedRealtime();
                output = UiThreadHelper.runOnUiThreadFuture(new Callable<Long>() {
                    @Override
                    public Long call() throws Exception {
                        //long start = SystemClock.elapsedRealtime();
                        richTextView.isRequestLayoutPosted = false;
                        richTextView.measure(widthMeasureSpec, heightMeasureSpec);
                        //Log.i(TAG, "measure: xxxxxx111 " + (SystemClock.elapsedRealtime() - start));
                        return YogaMeasureOutput.make(richTextView.getMeasuredWidth(), richTextView.getMeasuredHeight());
                    }
                }).get();
                //Log.i(TAG, "measure: xxxxxx " + (SystemClock.elapsedRealtime() - start));
            } catch (Exception e) {
                e.printStackTrace();
                L.postException(e);
                output = YogaMeasureOutput.make(0, 0);
            }
        }

        L.i(TAG, "measure end measureOutput: (width=", YogaMeasureOutput.getWidth(output), " height=", YogaMeasureOutput.getHeight(output), ") width=", width, " widthMode=", widthMode, " height=", height, " heightMode=", heightMode, " richTextView=", richTextView);
        return output;
    }
}
