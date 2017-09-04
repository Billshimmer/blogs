package com.lightappbuilder.lab4.lablibrary.rnviews.scrollview;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Rect;
import android.graphics.drawable.ColorDrawable;
import android.graphics.drawable.Drawable;
import android.support.annotation.Nullable;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import com.facebook.infer.annotation.Assertions;
import com.facebook.react.uimanager.MeasureSpecAssertions;
import com.facebook.react.uimanager.ReactClippingViewGroup;
import com.facebook.react.uimanager.ReactClippingViewGroupHelper;
import com.facebook.react.uimanager.events.NativeGestureUtil;


/**
 * Created by tygzx on 17/3/2.
 */

public class LABScrollView extends CustomScrollView implements ReactClippingViewGroup,ViewGroup.OnHierarchyChangeListener,View.OnLayoutChangeListener{

    private final OnScrollDispatchHelper mOnScrollDispatchHelper=new OnScrollDispatchHelper();

    private @Nullable Rect mClippingRect;

    private boolean mDoneFling;

    private boolean mDragging;

    private boolean mFlinging;

    private boolean mRemoveClippedSubviews;

    private boolean mScrollEnabled=true;

    private boolean mSendMomentumEvents;

    private @Nullable FpsListener mFpsListener=null;

    private @Nullable String mScrollPerfTag;

    private @Nullable Drawable mEndBackground;

    private int mEndFillColor= Color.TRANSPARENT;

    private View mContentView;


    public LABScrollView(Context context) {
        this(context,null);
    }

    public LABScrollView(Context context, @Nullable FpsListener fpsListener) {
        super(context);
        mFpsListener=fpsListener;

        setOnHierarchyChangeListener(this);
    }

    public void setSendMomentumEvents(boolean sendMomentumEvents){
        mSendMomentumEvents=sendMomentumEvents;
    }

    public void setScrollPerfTag(@Nullable String scrollPerfTag) {
        this.mScrollPerfTag = scrollPerfTag;
    }

    public void setScrollEnabled(boolean scrollEnabled) {
        mScrollEnabled = scrollEnabled;
    }

    @Override
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {

        MeasureSpecAssertions.assertExplicitMeasureSpec(widthMeasureSpec,heightMeasureSpec);

        setMeasuredDimension(MeasureSpec.getSize(widthMeasureSpec),MeasureSpec.getSize(heightMeasureSpec));
    }

    @Override
    protected void onLayout(boolean changed, int l, int t, int r, int b) {

        abstractScrollTo(getScrollX(),getScrollY());
    }

    @Override
    protected void onSizeChanged(int w, int h, int oldw, int oldh) {
        super.onSizeChanged(w, h, oldw, oldh);
        if (mRemoveClippedSubviews){
            updateClippingRect();
        }
    }

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
        if (mRemoveClippedSubviews){
            updateClippingRect();
        }
    }

    @Override
    protected void onScrollChanged(int l, int t, int oldl, int oldt) {
        super.onScrollChanged(l, t, oldl, oldt);

        if (mOnScrollDispatchHelper.onScrollChanged(l,t)){
            if (mRemoveClippedSubviews){
                updateClippingRect();
            }

            if (mFlinging){
                mDoneFling=false;
            }

            LABScrollViewHelper.emitScrollEvent(this);

        }
    }

    @Override
    public boolean onInterceptTouchEvent(MotionEvent ev) {

        if (!mScrollEnabled){
            return false;
        }

        if (super.onInterceptTouchEvent(ev)){
            NativeGestureUtil.notifyNativeGestureStarted(this,ev);
            LABScrollViewHelper.emitScrollBeginDragEvent(this);
            mDragging=true;
            enableFpsListener();
            return true;
        }

        return false;
    }

    @Override
    public boolean onTouchEvent(MotionEvent ev) {

        if (!mScrollEnabled){
            return false;
        }

        int action=ev.getAction()&MotionEvent.ACTION_MASK;

        if (action==MotionEvent.ACTION_UP&&mDragging){
            LABScrollViewHelper.emitScrollEndDragEvent(this);
            mDragging=false;
            disableFpsListener();
        }
        return super.onTouchEvent(ev);
    }



    @Override
    public void onChildViewAdded(View parent, View child) {
        mContentView=child;
        mContentView.addOnLayoutChangeListener(this);
    }

    @Override
    public void onChildViewRemoved(View parent, View child) {
        mContentView.removeOnLayoutChangeListener(this);
        mContentView=null;
    }

    @Override
    public void updateClippingRect() {

        if (!mRemoveClippedSubviews) {
            return;
        }
        Assertions.assertNotNull(mClippingRect);
        ReactClippingViewGroupHelper.calculateClippingRect(this, mClippingRect);
        View contentView = getChildAt(0);
        if (contentView instanceof ReactClippingViewGroup) {
            ((ReactClippingViewGroup) contentView).updateClippingRect();
        }
    }

    @Override
    public void getClippingRect(Rect outClippingRect) {
        outClippingRect.set(Assertions.assertNotNull(mClippingRect));
    }

    @Override
    public void setRemoveClippedSubviews(boolean removeClippedSubviews) {
        if (removeClippedSubviews && mClippingRect == null) {
            mClippingRect = new Rect();
        }
        mRemoveClippedSubviews = removeClippedSubviews;
        updateClippingRect();
    }

    @Override
    public boolean getRemoveClippedSubviews() {
        return mRemoveClippedSubviews;
    }

    @Override
    public void fling(int velocityX, int velocityY) {

        if (mScroller!=null){

            int scrollWindwHeight=getHeight()-getPaddingBottom()-getPaddingTop();
            int scrollWindowWidth=getWidth()-getPaddingLeft()-getPaddingRight();
            mScroller.fling(getScrollX(),getScrollY(),velocityX,velocityY,0,Integer.MAX_VALUE,0,Integer.MAX_VALUE,scrollWindowWidth/2,scrollWindwHeight/2);

        }else {
            super.fling(velocityX,velocityY);
        }

        if (mSendMomentumEvents||isScrollPerfLoggingEnable()){
            mFlinging=true;
            enableFpsListener();
            LABScrollViewHelper.emitScrollMomentumBeginEvent(this);
            Runnable r=new Runnable() {
                @Override
                public void run() {
                    if (mDoneFling){
                        mFlinging=false;
                        disableFpsListener();
                        LABScrollViewHelper.emitScrollMomentumEndEvent(LABScrollView.this);
                    }else {
                        mDoneFling=true;
                        LABScrollView.this.postOnAnimationDelayed(this,LABScrollViewHelper.MOMENTUM_DELAY);
                    }
                }
            };
            postOnAnimationDelayed(r,LABScrollViewHelper.MOMENTUM_DELAY);
        }
    }

    private void enableFpsListener(){
        if (isScrollPerfLoggingEnable()){
            Assertions.assertNotNull(mFpsListener);
            Assertions.assertNotNull(mScrollPerfTag);
            mFpsListener.enable(mScrollPerfTag);
        }
    }

    private void disableFpsListener(){

        if (isScrollPerfLoggingEnable()){
            Assertions.assertNotNull(mFpsListener);
            Assertions.assertNotNull(mScrollPerfTag);
            mFpsListener.disable(mScrollPerfTag);
        }
    }

    private boolean isScrollPerfLoggingEnable(){
        return mFpsListener!=null&&mScrollPerfTag!=null&&!mScrollPerfTag.isEmpty();
    }

    private int getMaxScrollY(){
        int contentHeight=mContentView.getHeight();
        int viewportHeight=getHeight()-getPaddingBottom()-getPaddingTop();
        return Math.max(0,contentHeight-viewportHeight);
    }

    @Override
    public void draw(Canvas canvas) {

        if (mEndFillColor!=Color.TRANSPARENT){
            final View content=getChildAt(0);
            if (orientation==VERTICAL){
                if (mEndBackground!=null&&content!=null&&content.getBottom()<getHeight()){
                    mEndBackground.setBounds(0,content.getBottom(),getWidth(),getHeight());
                    mEndBackground.draw(canvas);
                }
            }else {
                if (mEndBackground!=null&&content!=null&&content.getWidth()<getWidth()){
                    mEndBackground.setBounds(content.getRight(),0,getWidth(),getHeight());
                    mEndBackground.draw(canvas);
                }
            }

        }
        super.draw(canvas);
    }

    public void setEndFillColor(int color){
        if (color!=mEndFillColor){
            mEndFillColor=color;
            mEndBackground=new ColorDrawable(mEndFillColor);
        }
    }

    @Override
    protected void abstractOnOverScrolled(int scrollX, int scrollY, boolean clampedX, boolean clampedY) {

        if (!mScroller.isFinished()&&mScroller.getCurrY()!=mScroller.getFinalY()){
            int scrollRange=getMaxScrollY();
            if (scrollY>=scrollRange){
                mScroller.abortAnimation();
                scrollY=scrollRange;
            }
        }

        super.abstractOnOverScrolled(scrollX, scrollY, clampedX, clampedY);
    }

    @Override
    public void onLayoutChange(View v, int left, int top, int right, int bottom, int oldLeft, int oldTop, int oldRight, int oldBottom) {

        if (mContentView==null){
            return;
        }

        int currentScrollY=getScrollY();
        int maxscrollY=getMaxScrollY();
        if (currentScrollY>maxscrollY){
            abstractScrollTo(getScrollX(),maxscrollY);
        }
    }
}
