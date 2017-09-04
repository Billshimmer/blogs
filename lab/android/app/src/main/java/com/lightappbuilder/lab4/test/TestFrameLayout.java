package com.lightappbuilder.lab4.test;

import android.content.Context;
import android.util.AttributeSet;
import android.view.MotionEvent;
import android.widget.FrameLayout;

/**
 * Created by yinhf on 2016/10/24.
 */

public class TestFrameLayout extends FrameLayout {
    private static final String TAG = "TestFrameLayout";

    public onInterceptTouchEventListener onInterceptTouchEventListener;

    public TestFrameLayout(Context context) {
        super(context);
    }

    public TestFrameLayout(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    public TestFrameLayout(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
    }

    @Override
    public boolean onInterceptTouchEvent(MotionEvent ev) {
        if (onInterceptTouchEventListener != null) {
            onInterceptTouchEventListener.onInterceptTouchEvent(ev);
        }
        return super.onInterceptTouchEvent(ev);
    }

    interface onInterceptTouchEventListener {
        boolean onInterceptTouchEvent(MotionEvent ev);
    }
}
