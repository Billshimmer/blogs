package com.lightappbuilder.lab4.test;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.text.TextPaint;
import android.util.AttributeSet;
import android.view.MotionEvent;
import android.view.ViewGroup;

import com.lightappbuilder.lab4.lablibrary.utils.L;

/**
 * Created by yinhf on 16/7/6.
 */
public class TestView extends ViewGroup {
    private String TAG = "TestView";
    private String labViewId;

    private Paint textPaint;

    public TestView(Context context) {
        super(context);
        init();
    }

    public TestView(Context context, AttributeSet attrs) {
        super(context, attrs);
        init();
    }

    public TestView(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init();
    }

    private void init() {
        initTAG();
        textPaint = new TextPaint();
        textPaint.setAntiAlias(true);
        textPaint.setColor(Color.RED);
        textPaint.setTextSize(30);
    }

    private void initTAG() {
        TAG = "TestView_" + getId() + "_" + labViewId;
    }

    public void setLabViewId(String labViewId) {
        this.labViewId = labViewId;
        initTAG();
    }

    @Override
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        //L.d(TAG, "onMeasure() called with widthMeasureSpec = (", MeasureSpec.toString(widthMeasureSpec), "), heightMeasureSpec = (", MeasureSpec.toString(heightMeasureSpec), ")");
        super.onMeasure(widthMeasureSpec, heightMeasureSpec);
    }

    @Override
    protected void onLayout(boolean changed, int l, int t, int r, int b) {
        //L.d(TAG, "onLayout() called with changed = ", changed, ", l = ", l, ", t = ", t, ", r = ", r, ", b = ", b, "");
    }

    @Override
    public void draw(Canvas canvas) {
        //L.d(TAG, "draw() called with canvas = ", canvas, "");
        super.draw(canvas);
    }

    @Override
    protected void onDraw(Canvas canvas) {
        //L.d(TAG, "onDraw() called with canvas = ", canvas, "");
        super.onDraw(canvas);
        canvas.drawText(TAG, 10, 30, textPaint);
    }

    @Override
    public boolean dispatchTouchEvent(MotionEvent event) {
        L.d(TAG, "dispatchTouchEvent() called with event = ", event, "");
        return super.dispatchTouchEvent(event);
    }

    @Override
    public boolean onInterceptTouchEvent(MotionEvent ev) {
        //L.d(TAG, "onInterceptTouchEvent() called with ev = ", ev, "");
        return super.onInterceptTouchEvent(ev);
    }

    @Override
    public boolean onTouchEvent(MotionEvent event) {
        //L.d(TAG, "onTouchEvent() called with event = ", event, "");
        return super.onTouchEvent(event);
    }

    @Override
    public void requestLayout() {
        //L.i(TAG, "requestLayout ");
        super.requestLayout();
    }

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
        L.i(TAG, "onAttachedToWindow");
    }

    @Override
    protected void onDetachedFromWindow() {
        super.onDetachedFromWindow();
        L.i(TAG, "onDetachedFromWindow");
    }
}
