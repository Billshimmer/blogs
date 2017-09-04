package com.lightappbuilder.lab4.lablibrary.rnviews.scrollview;

import android.content.Context;
import android.graphics.drawable.Drawable;
import android.util.AttributeSet;
import android.util.Log;
import android.view.Gravity;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import android.widget.TextView;

import java.util.ArrayList;

/**
 * Created by tygzx on 17/2/28.
 */

public class CustomScrollView extends AbstractScrollView{

    private static final String TAG=CustomScrollView.class.getSimpleName();

    protected View mHeaderView;

    protected boolean mMeasureAllChildren = false;

    protected final ArrayList<View> mMatchParentChildren = new ArrayList<View>(1);

    private PtrIndicator mPtrIndicator;

    public CustomScrollView(Context context) {
        super(context);
    }

    public CustomScrollView(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    public CustomScrollView(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
    }

    @Override
    protected void initScrollView() {
        super.initScrollView();
        mPtrIndicator=new PtrIndicator();
    }

    @Override
    public void addView(View child) {
        if (getChildCount() > 1) {
            throw new IllegalStateException("ScrollView can host only one direct child");
        }

        super.addView(child);
    }

    @Override
    public void addView(View child, int index) {
        if (getChildCount() > 1) {
            throw new IllegalStateException("ScrollView can host only one direct child");
        }

        super.addView(child, index);
    }

    @Override
    public void addView(View child, ViewGroup.LayoutParams params) {
        if (getChildCount() > 1) {
            throw new IllegalStateException("ScrollView can host only one direct child");
        }

        super.addView(child, params);
    }

    @Override
    public void addView(View child, int index, ViewGroup.LayoutParams params) {
        if (getChildCount() > 1) {
            throw new IllegalStateException("ScrollView can host only one direct child");
        }

        super.addView(child, index, params);
    }

    public void addContentView(View content){
        addView(content);
    }

    public void addHeaderView(View child){
        mHeaderView=child;
        addView(mHeaderView);
    }

    public void removeHeaderView(View child){
        removeView(child);
    }

    @Override
    protected int getChildDrawingOrder(int childCount, int i) {

        if (getChildAt(0)==mHeaderView){
            i=0;
        }else {
            i=1;
        }
        return super.getChildDrawingOrder(childCount, i);
    }

    public void setPullToRefresh(boolean b){
        mPtrIndicator.setPullToRefresh(b);
    }

    public void setPullToFooterRefresh(boolean b){
        mPtrIndicator.setPullToFooterRefresh(b);
    }

    public void addPtrUIHandler(PtrUIHandler ptrUIHandler) {
        mPtrIndicator.setPtrUIHandler(ptrUIHandler);
    }

    @SuppressWarnings({"unused"})
    public void removePtrUIHandler(PtrUIHandler ptrUIHandler) {
        mPtrIndicator.removePtrUIHandler();
    }

    final public void refreshComplete() {

        mPtrIndicator.setRefreshComplete();
        if (mPtrIndicator.isRefreshStatusComplete()){
            if (mScroller.springBack(0,getScrollY(),0,getScrollRangeX(),0,getScrollRangeY())) {
                postInvalidateOnAnimation();
            }
        }
    }

    final public void refreshFooterComplete(){

        mPtrIndicator.setRefreshFooterComplete();
        if (mPtrIndicator.isRefreshStatusFooterInit()){
            if (mScroller.springBack(0,getScrollY(),0,getScrollRangeX(),0,getScrollRangeY())) {
                postInvalidateOnAnimation();
            }
        }
    }


    /**
     * 判断当前是否正在越边界
     * @return
     */
    private boolean isOverScrollY(){

        return getScrollY()<0||getScrollY()>getScrollRangeY();

    }

    @Override
    protected void abstractOnFinishInflate() {

        final int childCount = getChildCount();
        if (childCount > 2) {
            throw new IllegalStateException("ScrollView only can host 2 elements");
        } else if (childCount == 2) {
            // not specify header or content
            if (mHeaderView == null) {

                View child1 = getChildAt(0);
                View child2 = getChildAt(1);
                if (child1 instanceof PtrUIHandler) {
                    mHeaderView = child1;
                } else if (child2 instanceof PtrUIHandler) {
                    mHeaderView = child2;
                } else {
                    // both are not specified
                    if (mHeaderView == null) {
                        mHeaderView = child1;
                    }
                }
            }
        } else if (childCount == 0) {
            TextView errorView = new TextView(getContext());
            errorView.setClickable(true);
            errorView.setTextColor(0xffff6600);
            errorView.setGravity(Gravity.CENTER);
            errorView.setTextSize(20);
            errorView.setText("The content view in PtrFrameLayout is empty. Do you forget to specify its id in xml layout file?");
            addContentView(errorView);
        }
    }

    @Override
    protected void abstractOnMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        int count = getChildCount();

        final boolean measureMatchParentChildren =
                MeasureSpec.getMode(widthMeasureSpec) != MeasureSpec.EXACTLY ||
                        MeasureSpec.getMode(heightMeasureSpec) != MeasureSpec.EXACTLY;
        mMatchParentChildren.clear();

        int maxHeight = 0;
        int maxWidth = 0;
        int childState = 0;

        for (int i = 0; i < count; i++) {
            final View child = getChildAt(i);
            if (mMeasureAllChildren || child.getVisibility() != GONE) {
                measureChildWithMargins(child, widthMeasureSpec, 0, heightMeasureSpec, 0);
                final FrameLayout.LayoutParams lp = (FrameLayout.LayoutParams) child.getLayoutParams();
                maxWidth = Math.max(maxWidth,
                        child.getMeasuredWidth() + lp.leftMargin + lp.rightMargin);
                maxHeight = Math.max(maxHeight,
                        child.getMeasuredHeight() + lp.topMargin + lp.bottomMargin);
                childState = combineMeasuredStates(childState, child.getMeasuredState());
                if (measureMatchParentChildren) {
                    if (lp.width == FrameLayout.LayoutParams.MATCH_PARENT ||
                            lp.height == FrameLayout.LayoutParams.MATCH_PARENT) {
                        mMatchParentChildren.add(child);
                    }
                }
            }
        }

        // Account for padding too
        maxWidth += getPaddingLeftWithForeground() + getPaddingRightWithForeground();
        maxHeight += getPaddingTopWithForeground() + getPaddingBottomWithForeground();

        // Check against our minimum height and width
        maxHeight = Math.max(maxHeight, getSuggestedMinimumHeight());
        maxWidth = Math.max(maxWidth, getSuggestedMinimumWidth());

        // Check against our foreground's minimum height and width
        final Drawable drawable = null;//TODO
        if (drawable != null) {
            maxHeight = Math.max(maxHeight, drawable.getMinimumHeight());
            maxWidth = Math.max(maxWidth, drawable.getMinimumWidth());
        }

        setMeasuredDimension(resolveSizeAndState(maxWidth, widthMeasureSpec, childState),
                resolveSizeAndState(maxHeight, heightMeasureSpec,
                        childState << MEASURED_HEIGHT_STATE_SHIFT));
    }

    @Override
    protected void onLayout(boolean changed, int l, int t, int r, int b) {

        View mContentView=abstractGetContentView();

        int paddingLeft = getPaddingLeft();
        int paddingTop = getPaddingTop();

        if (mHeaderView != null) {
            MarginLayoutParams lp = (MarginLayoutParams) mHeaderView.getLayoutParams();
            int left = paddingLeft + lp.leftMargin;
            final int top = paddingTop + lp.topMargin  - mHeaderView.getMeasuredHeight();
            int right = left + mHeaderView.getMeasuredWidth();
            final int bottom = top + mHeaderView.getMeasuredHeight();

            //居中处理
            int parentWidth=getMeasuredWidth()-getPaddingLeft()-getPaddingRight();
            int childWidth=mHeaderView.getMeasuredWidth()+lp.leftMargin+lp.rightMargin;
            int offsetX=(parentWidth-childWidth)/2+lp.leftMargin+paddingLeft;
            right=offsetX+mHeaderView.getMeasuredWidth();
            mHeaderView.layout(offsetX, top, right, bottom);

            mPtrIndicator.setHeaderHeight(mHeaderView.getMeasuredHeight());
        }
        if (mContentView != null) {
            MarginLayoutParams lp = (MarginLayoutParams) mContentView.getLayoutParams();
            final int left = paddingLeft + lp.leftMargin;
            final int top = paddingTop + lp.topMargin ;
            final int right = left + mContentView.getMeasuredWidth();
            final int bottom = top + mContentView.getMeasuredHeight();
            mContentView.layout(left, top, right, bottom);

            mPtrIndicator.setScrollRange(getScrollRangeY());
        }

        mPtrIndicator.setCurrentScrollPoint(getScrollX(),getScrollY());
        mPtrIndicator.setPreScrollPoint(getScrollX(),getScrollY());
    }

    @Override
    protected void abstractMeasureChild(View child, int parentWidthMeasureSpec, int parentHeightMeasureSpec) {
        int spec=child instanceof ViewGroup?MeasureSpec.UNSPECIFIED:MeasureSpec.EXACTLY;

        ViewGroup.LayoutParams lp = child.getLayoutParams();

        int childWidthMeasureSpec;
        int childHeightMeasureSpec;

        childWidthMeasureSpec = getChildMeasureSpec(parentWidthMeasureSpec, getPaddingLeft()
                + getPaddingRight(), lp.width);
        final int verticalPadding = getPaddingTop() + getPaddingBottom();
        childHeightMeasureSpec = child instanceof ViewGroup?MeasureSpec.makeMeasureSpec(
                Math.max(0, MeasureSpec.getSize(parentHeightMeasureSpec) - verticalPadding),
                spec):getChildMeasureSpec(parentHeightMeasureSpec,getPaddingTop()+getPaddingBottom(),lp.height);
        child.measure(childWidthMeasureSpec, childHeightMeasureSpec);
    }


    @Override
    protected void abstractMeasureChildWithMargins(View child, int parentWidthMeasureSpec, int widthUsed, int parentHeightMeasureSpec, int heightUsed) {


        final MarginLayoutParams lp = (MarginLayoutParams) child.getLayoutParams();

//        final int childWidthMeasureSpec = getChildMeasureSpec(parentWidthMeasureSpec,
//                getPaddingLeft() + getPaddingRight() + lp.leftMargin + lp.rightMargin
//                        + widthUsed, lp.width);
                final int usedTotalWidth = getPaddingLeft() + getPaddingRight() + lp.leftMargin + lp.rightMargin +
                widthUsed;
        final int childWidthMeasureSpec = child instanceof ViewGroup ? MeasureSpec.makeMeasureSpec(
                Math.max(0, MeasureSpec.getSize(parentWidthMeasureSpec) - usedTotalWidth),
                MeasureSpec.UNSPECIFIED) : getChildMeasureSpec(parentWidthMeasureSpec,
                getPaddingLeft() + getPaddingRight() + lp.leftMargin + lp.rightMargin
                        + widthUsed, lp.width);

//        final int childHeightMeasureSpec = MeasureSpec.makeMeasureSpec(
//                MeasureSpec.getSize(parentHeightMeasureSpec), MeasureSpec.UNSPECIFIED);
        final int usedTotalHeight = getPaddingTop() + getPaddingBottom() + lp.topMargin + lp.bottomMargin + heightUsed;
        final int childHeightMeasureSpec = child instanceof ViewGroup ?MeasureSpec.makeMeasureSpec(
                Math.max(0, MeasureSpec.getSize(parentHeightMeasureSpec) - usedTotalHeight),
                MeasureSpec.UNSPECIFIED):getChildMeasureSpec(parentHeightMeasureSpec,getPaddingTop()+getPaddingBottom()+lp.bottomMargin+lp.topMargin,lp.height);

        child.measure(childWidthMeasureSpec, childHeightMeasureSpec);
//        final MarginLayoutParams lp = (MarginLayoutParams) child.getLayoutParams();
//
//        final int usedTotalWidth = getPaddingLeft() + getPaddingRight() + lp.leftMargin + lp.rightMargin +
//                widthUsed;
//        final int childWidthMeasureSpec = child instanceof ViewGroup ? MeasureSpec.makeMeasureSpec(
//                Math.max(0, MeasureSpec.getSize(parentWidthMeasureSpec) - usedTotalWidth),
//                MeasureSpec.UNSPECIFIED) : getChildMeasureSpec(parentWidthMeasureSpec,
//                getPaddingLeft() + getPaddingRight() + lp.leftMargin + lp.rightMargin
//                        + widthUsed, lp.width);
//
//        final int usedTotalHeight = getPaddingTop() + getPaddingBottom() + lp.topMargin + lp.bottomMargin +
//                heightUsed;
//        final int childHeightMeasureSpec = child instanceof ViewGroup ?MeasureSpec.makeMeasureSpec(
//                Math.max(0, MeasureSpec.getSize(parentHeightMeasureSpec) - usedTotalHeight),
//                MeasureSpec.UNSPECIFIED):getChildMeasureSpec(parentHeightMeasureSpec,getPaddingTop()+getPaddingBottom()+lp.bottomMargin+lp.topMargin,lp.height);
//        child.measure(childWidthMeasureSpec, childHeightMeasureSpec);
    }

    @Override
    protected void abstractScrollTo(int scrollX, int scrollY) {

        if (orientation==VERTICAL){
            scrollX=0;
            mPtrIndicator.setPreScrollPoint(scrollX,scrollY);
        }else {
            scrollY=0;
        }

        scrollTo(scrollX,scrollY);

        mPtrIndicator.setCurrentScrollPoint(getScrollX(),getScrollY());
    }

    @Override
    protected View abstractGetContentView() {

        for (int i=0;i<getChildCount();i++){
            if (getChildAt(i)!=mHeaderView){
                return getChildAt(i);
            }
        }
        return getChildAt(0);
    }

    @Override
    protected boolean abstractOverScrollBy(int deltaX, int deltaY, int scrollX, int scrollY, int scrollRangeX, int scrollRangeY, int maxOverScrollX, int maxOverScrollY, boolean isTouchEvent) {


        maxOverScrollX=mPtrIndicator.getOverScrollFlingDistance();
        maxOverScrollY=mPtrIndicator.getOverScrollDistance();

        final int overScrollMode = getOverScrollMode();
        final boolean canScrollHorizontal =
                computeHorizontalScrollRange() > computeHorizontalScrollExtent();
        final boolean canScrollVertical =
                computeVerticalScrollRange() > computeVerticalScrollExtent();
        final boolean overScrollHorizontal = overScrollMode == OVER_SCROLL_ALWAYS ||
                (overScrollMode == OVER_SCROLL_IF_CONTENT_SCROLLS && canScrollHorizontal);
        final boolean overScrollVertical = overScrollMode == OVER_SCROLL_ALWAYS ||
                (overScrollMode == OVER_SCROLL_IF_CONTENT_SCROLLS && canScrollVertical);

        Log.i(TAG,"scrollX:"+scrollX+" deltaX:"+deltaX);

        int newScrollX = scrollX + deltaX;

        Log.i(TAG,"newScrollX:"+newScrollX);
        if (!overScrollHorizontal) {
            maxOverScrollX = 0;
        }

        int newScrollY = scrollY + deltaY;
        //Log.i(TAG,"pre newScrollY:"+newScrollY);
        if (!overScrollVertical) {
            maxOverScrollY = 0;
        }

        // Clamp values if at the limits and record
        final int left = -maxOverScrollX;
        final int right = maxOverScrollX + scrollRangeX;
        final int top = -maxOverScrollY;
        final int bottom = maxOverScrollY + scrollRangeY;

        boolean clampedX = false;
        if (newScrollX > right) {
            newScrollX = right;
            clampedX = true;
        } else if (newScrollX < left) {
            newScrollX = left;
            clampedX = true;
        }

        boolean clampedY = false;
        if (newScrollY > bottom) {
            newScrollY = bottom;
            clampedY = true;
        } else if (newScrollY < top) {
            newScrollY = top;
            clampedY = true;
        }

        Log.i(TAG,"newScrollX:"+newScrollX);

        abstractOnOverScrolled(newScrollX, newScrollY, clampedX, clampedY);

        return clampedX || clampedY;
    }

    @Override
    protected void abstractOnOverScrolled(int scrollX, int scrollY, boolean clampedX, boolean clampedY) {

        // Treat animating scrolls differently; see #computeScroll() for why.
        if (!mScroller.isFinished()) {
            final int oldX = getScrollX();
            final int oldY = getScrollY();
            abstractScrollTo(scrollX,scrollY);
            postInvalidateOnAnimation();
            //invalidateParentIfNeeded();
            if (clampedY||clampedX) {
                Log.i(TAG,"clampedY");
                mScroller.springBack(getScrollX(), getScrollY(), 0, getScrollRangeX(), 0, getScrollRangeY());
            }
        } else {
            abstractScrollTo(scrollX,scrollY);
        }

        awakenScrollBars();
    }

    @Override
    protected void abstractOnTouchMove(MotionEvent ev) {
        mPtrIndicator.onMove(ev.getX(),ev.getY(),isOverScrollY());
    }

    @Override
    protected int abstractOnTouchMoveProcessDeltaY(int deltaY) {
        return deltaY;
    }

    @Override
    protected void abstractOnTouchDown(MotionEvent ev) {
        mPtrIndicator.onPressDown(ev.getX(),ev.getY());

        mPtrIndicator.processOnMove(ev.getX(),ev.getY(),0,0);

    }

    @Override
    protected void abstractOnTouchUp() {
        mPtrIndicator.onRelease();
    }

    @Override
    protected void abstractOnTouchUpAndScroll(int initialVelocityX,int initialVelocityY) {

        if (orientation==VERTICAL){
            if ((Math.abs(initialVelocityY) > mMinimumVelocity)&&!mPtrIndicator.isCrossRefreshLineFromTopToBottom()) {
                Log.i(TAG,"fling");
                flingWithNestedDispatch(0,-initialVelocityY);

            }else {
                Log.i(TAG,"not fling");
                if(mPtrIndicator.isRefreshStatusReadyLoading()&&!mPtrIndicator.isUnderTouch()&&mPtrIndicator.isCrossRefreshLineFromTopToBottom()){
                    Log.i(TAG,"smoothScrollTo");
                    smoothScrollTo(0,-mPtrIndicator.getOffsetToRefresh());
                }else if (mScroller.springBack(getScrollX(), getScrollY(), 0, getScrollRangeX(), 0, getScrollRangeY())){
                    postInvalidateOnAnimation();
                }
            }
        }else {
            if ((Math.abs(initialVelocityX) > mMinimumVelocity) ) {
                flingWithNestedDispatch(-initialVelocityX,0);

            }else {

                if (mScroller.springBack(getScrollX(), getScrollY(), 0, getScrollRangeX(), 0, getScrollRangeY())){
                    postInvalidateOnAnimation();
                }

            }
        }

    }

    @Override
    protected void abstractOnTouchCancel() {
        mPtrIndicator.onRelease();
        if (mScroller.springBack(getScrollX(), getScrollY(), 0, 0, 0, getScrollRangeY())) {
            postInvalidateOnAnimation();
        }

    }
}
