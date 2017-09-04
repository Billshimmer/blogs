package com.lightappbuilder.lab4.lablibrary.rnviews.richtext;

import android.content.Context;
import android.support.v4.view.ViewCompat;
import android.util.AttributeSet;
import android.widget.TextView;

import com.lightappbuilder.lab4.lablibrary.utils.L;
import com.zzhoujay.richtext.RichText;

/**
 * Created by yinhf on 16/7/11.
 */
public class LABRichTextView extends TextView {
    private static final String TAG = "LABRichTextView";

    public interface OnRequestLayoutListener {
        void onRequestLayout(LABRichTextView view);
    }

    private OnRequestLayoutListener onRequestLayoutListener;
    boolean isRequestLayoutPosted;
    private String tempRichText;

    private Runnable requestLayoutRunnable = new Runnable() {
        @Override
        public void run() {
            if (onRequestLayoutListener != null) {
                onRequestLayoutListener.onRequestLayout(LABRichTextView.this);
            }
        }
    };

    public LABRichTextView(Context context) {
        super(context);
    }

    public LABRichTextView(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    public LABRichTextView(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
    }

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
        isRequestLayoutPosted = false;
        if (tempRichText != null) {
            RichText.from(tempRichText).into(this);
            tempRichText = null;
        }
    }

    @Override
    protected void onDetachedFromWindow() {
        super.onDetachedFromWindow();
        isRequestLayoutPosted = false;
    }

    public void setRichText(String text) {
        //Log.i(TAG, "setRichText: xxxxx isAttachedToWindow:" + isAttachedToWindow() + " getHeight():" + getHeight() + " parent:" + getParent() + " xxx:" + (Looper.myLooper() == Looper.getMainLooper()));
        if (ViewCompat.isAttachedToWindow(this)) {
            RichText.from(text).into(this);

        } else {
            tempRichText = text;
        }
    }

    @Override
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        L.d(TAG, "onMeasure() called with widthMeasureSpec = ", MeasureSpec.toString(widthMeasureSpec), ", heightMeasureSpec = ", MeasureSpec.toString(heightMeasureSpec), "");
        super.onMeasure(widthMeasureSpec, heightMeasureSpec);
    }

    @Override
    public void requestLayout() {
        //L.d(TAG, "requestLayout() called with ");
        super.requestLayout();
        if (onRequestLayoutListener != null && !isRequestLayoutPosted) {
            isRequestLayoutPosted = true;
            postDelayed(requestLayoutRunnable, 33);
        }
    }

    @Override
    public void forceLayout() {
        super.forceLayout();
        if (onRequestLayoutListener != null && !isRequestLayoutPosted) {
            isRequestLayoutPosted = true;
            postDelayed(requestLayoutRunnable, 33);
        }
    }

    public OnRequestLayoutListener getOnRequestLayoutListener() {
        return onRequestLayoutListener;
    }

    public void setOnRequestLayoutListener(OnRequestLayoutListener onRequestLayoutListener) {
        this.onRequestLayoutListener = onRequestLayoutListener;
    }
}
