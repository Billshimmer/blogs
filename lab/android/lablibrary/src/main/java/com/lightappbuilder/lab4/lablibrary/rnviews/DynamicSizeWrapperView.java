package com.lightappbuilder.lab4.lablibrary.rnviews;

import android.annotation.TargetApi;
import android.content.Context;
import android.os.Build;
import android.support.v4.view.ViewCompat;
import android.util.AttributeSet;
import android.view.View;
import android.view.ViewGroup;

/**
 * Created by yinhf on 16/9/26.
 * 作为需要warp_content 的View的wrapper
 * NOTE
 * 1. 有且仅有一个child
 * 2. 不能设置padding, child不能设置margin
 * 3. child 只能是 match_parent 或者 wrap_content
 */
public class DynamicSizeWrapperView extends ViewGroup {
    private static final String TAG = "LABView";

    private boolean isLayoutPosted;
    private DynamicSizeShadowNodeBridge sizeBridge;
    private boolean isChildWrapContent;

    private final Runnable mLayoutRunnable = new Runnable() {
        @Override
        public void run() {
            //Log.i(TAG, "mLayoutRunnable run: start ");
            isLayoutPosted = false;
             measure(MeasureSpec.makeMeasureSpec(getWidth(), MeasureSpec.EXACTLY),
                    MeasureSpec.makeMeasureSpec(getHeight(), MeasureSpec.EXACTLY));
            layout(getLeft(), getTop(), getRight(), getBottom());
            //Log.i(TAG, "mLayoutRunnable run: end ");
        }
    };

    public DynamicSizeWrapperView(Context context) {
        super(context);
    }

    public DynamicSizeWrapperView(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    public DynamicSizeWrapperView(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
    }

    @TargetApi(Build.VERSION_CODES.LOLLIPOP)
    public DynamicSizeWrapperView(Context context, AttributeSet attrs, int defStyleAttr, int defStyleRes) {
        super(context, attrs, defStyleAttr, defStyleRes);
    }

    public void setSizeBridge(DynamicSizeShadowNodeBridge sizeBridge) {
        this.sizeBridge = sizeBridge;
    }

    public LayoutParams getFitContentLayoutParams(boolean fitHorizontal, boolean fitVertical) {
        return new LayoutParams(fitHorizontal ? LayoutParams.WRAP_CONTENT : LayoutParams.MATCH_PARENT, fitVertical ? LayoutParams.WRAP_CONTENT : LayoutParams.MATCH_PARENT);
    }

    public void setFitContent(boolean fitHorizontal, boolean fitVertical) {
        View child = getChildAt(0);
        if (child == null) {
            throw new IllegalStateException("child == null");
        }
        LayoutParams layoutParams = child.getLayoutParams();
        int width = fitHorizontal ? LayoutParams.WRAP_CONTENT : LayoutParams.MATCH_PARENT;
        int height = fitVertical ? LayoutParams.WRAP_CONTENT : LayoutParams.MATCH_PARENT;
        if (layoutParams.width != width || layoutParams.height != height) {
            layoutParams.width = width;
            layoutParams.height = height;
            child.setLayoutParams(layoutParams);
        }
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

    @Override
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        int widthMode = MeasureSpec.getMode(widthMeasureSpec);
        int heightMode = MeasureSpec.getMode(heightMeasureSpec);
        int widthSize = MeasureSpec.getSize(widthMeasureSpec);
        int heightSize = MeasureSpec.getSize(heightMeasureSpec);
        if(widthMode != MeasureSpec.EXACTLY || heightMode != MeasureSpec.EXACTLY) {
            throw new IllegalArgumentException("must be measured with MeasureSpec.EXACTLY.");
        }
        setMeasuredDimension(widthSize, heightSize);

        View child = getChildAt(0);
        if (child != null && child.getVisibility() != View.GONE) {
            LayoutParams childLayoutParams = (LayoutParams) child.getLayoutParams();

            int childWidthMeasureSpec = getChildMeasureSpec(widthSize, childLayoutParams.width);
            int childHeightMeasureSpec = getChildMeasureSpec(heightSize, childLayoutParams.height);
            child.measure(childWidthMeasureSpec, childHeightMeasureSpec);

            if (sizeBridge != null) {
                boolean newIsChildWrapContent = childLayoutParams.width == LayoutParams.WRAP_CONTENT || childLayoutParams.height == LayoutParams.WRAP_CONTENT;
                if (newIsChildWrapContent) {
                    sizeBridge.updateSize(child.getMeasuredWidth(), childLayoutParams.width == LayoutParams.MATCH_PARENT ? DynamicSizeShadowNode.MATCH_PARENT : DynamicSizeShadowNode.WRAP_CONTENT,
                            child.getMeasuredHeight(), childLayoutParams.height == LayoutParams.MATCH_PARENT ? DynamicSizeShadowNode.MATCH_PARENT : DynamicSizeShadowNode.WRAP_CONTENT);
                } else if (isChildWrapContent) {
                    sizeBridge.disableSizeControlled();
                }
                isChildWrapContent = newIsChildWrapContent;
            }
        }
    }

    private static int getChildMeasureSpec(int size, int childDimension) {
        if (childDimension == LayoutParams.MATCH_PARENT) {
            return MeasureSpec.makeMeasureSpec(size, MeasureSpec.EXACTLY);
        } else if (childDimension == LayoutParams.WRAP_CONTENT) {
            return MeasureSpec.makeMeasureSpec(size, MeasureSpec.UNSPECIFIED);
        } else {
            return MeasureSpec.makeMeasureSpec(childDimension, MeasureSpec.EXACTLY);
        }
    }

    @Override
    protected void onLayout(boolean changed, int l, int t, int r, int b) {
        View child = getChildAt(0);
        if (child != null && child.getVisibility() != View.GONE) {
            child.layout(0, 0, child.getMeasuredWidth(), child.getMeasuredHeight());
        }
    }

    public LayoutParams getChildLayoutParams() {
        return (LayoutParams) getChildAt(0).getLayoutParams();
    }

    public View getWrappedChild() {
        return getChildAt(0);
    }

    @Override
    public void setBackgroundColor(int color) {
        getWrappedChild().setBackgroundColor(color);
    }
}
