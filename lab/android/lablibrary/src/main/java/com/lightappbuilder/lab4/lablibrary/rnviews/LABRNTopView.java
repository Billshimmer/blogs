package com.lightappbuilder.lab4.lablibrary.rnviews;

import android.annotation.TargetApi;
import android.content.Context;
import android.os.Build;
import android.support.v4.view.ViewCompat;
import android.util.AttributeSet;
import android.widget.FrameLayout;

/**
 * Created by yinhf on 16/8/10.
 * 作为包含子view 的 ViewManager的顶层View
 * 自己处理requestLayout 执行measure layout
 */
public class LABRNTopView extends FrameLayout {
    private static final String TAG = "LABRNTopView";

    private boolean isLayoutPosted;

    private final Runnable mLayoutRunnable = new Runnable() {
        @Override
        public void run() {
            //Log.i(TAG, "mLayoutRunnable run: start " + isLayoutRequested());
            isLayoutPosted = false;
            measure(MeasureSpec.makeMeasureSpec(getWidth(), MeasureSpec.EXACTLY),
                    MeasureSpec.makeMeasureSpec(getHeight(), MeasureSpec.EXACTLY));
            layout(getLeft(), getTop(), getRight(), getBottom());
            //Log.i(TAG, "mLayoutRunnable run: end " + isLayoutRequested());
        }
    };

    public LABRNTopView(Context context) {
        super(context);
    }

    public LABRNTopView(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    public LABRNTopView(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
    }

    @TargetApi(Build.VERSION_CODES.LOLLIPOP)
    public LABRNTopView(Context context, AttributeSet attrs, int defStyleAttr, int defStyleRes) {
        super(context, attrs, defStyleAttr, defStyleRes);
    }

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
        isLayoutPosted = false;
    }

    @Override
    protected void onDetachedFromWindow() {
        super.onDetachedFromWindow();
        isLayoutPosted = false;
    }

    @Override
    public void requestLayout() {
        super.requestLayout();
        if (!isLayoutPosted && ViewCompat.isAttachedToWindow(this)) {
            isLayoutPosted = true;
            post(mLayoutRunnable);
        }
    }

    @Override
    public void forceLayout() {
        super.forceLayout();
        if (!isLayoutPosted && ViewCompat.isAttachedToWindow(this)) {
            isLayoutPosted = true;
            post(mLayoutRunnable);
        }
    }
}
