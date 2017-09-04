package com.lightappbuilder.lab4.lablibrary.rnviews.scrollview;

import android.graphics.Point;
import android.graphics.PointF;
import android.util.Log;

/**
 * Created by tygzx on 17/1/23.
 */

public class PtrIndicator {

    public final static byte PTR_STATUS_INIT = 1;
    private byte mStatus = PTR_STATUS_INIT;
    public final static byte PTR_STATUS_PREPARE = 2;
    public final static byte PTR_STATUS_READY_LOADING = 3;
    public final static byte PTR_STATUS_LOADING = 4;
    public final static byte PTR_STATUS_COMPLETE = 5;
    private byte mFooterStatus=PTR_STATUS_INIT;

    private boolean mPullToRefresh = false;
    private boolean mPullToFooterRefresh=false;

    public final static int POS_START = 0;

    private int mHeaderHeight;
    private float mOffsetToRefreshFactor=0.65f;//到达一定高度，就可以判定可以刷新
    private int mOffsetToRefresh = 0;

    private int mViewHeight;//控件的高度

    private int mScrollRangeY;

    private Point mCurrentScrollPoint=new Point();

    private Point mPreScrollPoint=new Point();

    private boolean mIsUnderTouch = false;

    private PtrUIHandler mPtrUIHandler;

    private int mOverFlingDistance=300;

    private boolean mOverScrollByMaxDistance=true;//设置过度滑动的时候，是选择默认值，还是fling和headview的最高高度

    public void setPullToRefresh(boolean b){
        mPullToRefresh=b;
    }

    public void setPullToFooterRefresh(boolean b){
        mPullToFooterRefresh=b;
    }

    public boolean isPullToRefresh(){
        return mPullToRefresh;
    }

    public boolean isPullToFooterRefresh(){
        return mPullToFooterRefresh;
    }

    public boolean isRefreshStatusInit(){
        return mStatus==PTR_STATUS_INIT;
    }

    public boolean isRefreshStatusPrepare(){
        return mStatus==PTR_STATUS_PREPARE;
    }

    public boolean isRefreshStatusReadyLoading(){
        return mStatus==PTR_STATUS_READY_LOADING;
    }

    public boolean isRefreshStatusLoading(){
        return mStatus==PTR_STATUS_LOADING;
    }

    public boolean isRefreshStatusComplete(){
        return mStatus==PTR_STATUS_COMPLETE;
    }

    public void setRefreshComplete(){
        if (mStatus==PTR_STATUS_LOADING){
            mStatus=PTR_STATUS_COMPLETE;
            if (mCurrentScrollPoint.y>=POS_START){
                mStatus=PTR_STATUS_INIT;
                Log.i(TAG,"mStatus:"+mStatus+"currentScrollY:"+currentScrollY+"mOffsetToRefresh:"+mOffsetToRefresh);
                return;
            }
            if (mPtrUIHandler!=null){
                mPtrUIHandler.onUIRefreshComplete();
            }
            Log.i(TAG,"mStatus:"+mStatus+"currentScrollY:"+currentScrollY+"mOffsetToRefresh:"+mOffsetToRefresh);
        }
    }

    public boolean isRefreshStatusFooterInit(){
        return mFooterStatus==PTR_STATUS_INIT;
    }

    public void setRefreshFooterComplete(){
        if (mFooterStatus==PTR_STATUS_LOADING){
            mFooterStatus=PTR_STATUS_INIT;
        }
    }

    public boolean isRefreshStatusFooterLoading(){
        return mFooterStatus==PTR_STATUS_LOADING;
    }

    public void setHeaderHeight(int height) {
        mHeaderHeight = height;
        mOffsetToRefresh= (int) (mOffsetToRefreshFactor*mHeaderHeight);
    }

    public void setOffsetToRefreshFactor(float factor){
        mOffsetToRefreshFactor=factor;
        mOffsetToRefresh= (int) (mOffsetToRefreshFactor*mHeaderHeight);
    }

    public void setViewHeight(int height){
        mViewHeight=height;
    }

    /**
     * 重点要处理的
     * @return
     */
    public int getOverScrollDistance(){


        int overDistance=mOverFlingDistance;

        if (mPullToRefresh||mPullToFooterRefresh){
            if (mOverScrollByMaxDistance){
                overDistance=Math.max(mOverFlingDistance,mHeaderHeight);
            }
        }

//        if (mIsUnderTouch&&mPullToRefresh){
//            overDistance=mHeaderHeight;
//        }
//        if (!mIsUnderTouch&&mPullToRefresh&&mStatus!=PTR_STATUS_INIT){
//            overDistance=mHeaderHeight;
//        }
//        if (!mIsUnderTouch)
//        if (mCurrentScrollPoint.y>mScrollRangeY){
//            overDistance=mOverFlingDistance;
//        }
        return overDistance;
    }

    public int getOverScrollFlingDistance(){

        return mOverFlingDistance;
    }

    public void setScrollRange(int range){
        mScrollRangeY=range;
    }

    /**
     * 重要函数，用来设置刷新状态变化
     * @param currentScrollX
     * @param currentScrollY 当前view的currentScrollY
     */
    public void setCurrentScrollPoint(int currentScrollX,int currentScrollY){

        if (mPullToRefresh&&mHeaderHeight>0){
            if (currentScrollY>=POS_START&&(mStatus==PTR_STATUS_PREPARE||mStatus==PTR_STATUS_COMPLETE)){
                mStatus=PTR_STATUS_INIT;
                if (mPtrUIHandler!=null){
                    mPtrUIHandler.onUIReset();
                }
            }else if ((mStatus==PTR_STATUS_INIT&&currentScrollY<POS_START&&mIsUnderTouch)||(mStatus==PTR_STATUS_READY_LOADING&&currentScrollY<POS_START&&currentScrollY>-mOffsetToRefresh&&mIsUnderTouch)){
                mStatus=PTR_STATUS_PREPARE;
                if (mPtrUIHandler!=null){
                    mPtrUIHandler.onUIRefreshPrepare();
                }
            }else if (mStatus==PTR_STATUS_PREPARE&&mIsUnderTouch&&currentScrollY<-mOffsetToRefresh){
                mStatus=PTR_STATUS_READY_LOADING;
                if (mPtrUIHandler!=null){
                    mPtrUIHandler.onUIReleaseToRefresh();
                }
            }else if (!mIsUnderTouch&&mStatus==PTR_STATUS_READY_LOADING&&currentScrollY<=-mOffsetToRefresh){
                mStatus=PTR_STATUS_LOADING;
                if (mPtrUIHandler!=null){
                    mPtrUIHandler.onUIRefreshBegin();
                }
            }

        }
        if (mPullToFooterRefresh&&mCurrentScrollPoint.y>mScrollRangeY){
            if (mFooterStatus==PTR_STATUS_INIT){
                mFooterStatus=PTR_STATUS_LOADING;
                if (mPtrUIHandler!=null){
                    mPtrUIHandler.onUIRefreshFooterBegin();
                }
            }
        }

        mCurrentScrollPoint.set(currentScrollX,currentScrollY);
    }

    /**
     *
     * @param preScrollX
     * @param preScrollY 当前View将要移动到的ScrollY
     */

    public void setPreScrollPoint(int preScrollX,int preScrollY){
        mPreScrollPoint.set(preScrollX,preScrollY);
    }

    public boolean isOverFooter(){
        return mCurrentScrollPoint.y>mScrollRangeY;
    }

    public boolean isCrossRefreshLineFromTopToBottom() {
        return mCurrentScrollPoint.y<-mOffsetToRefresh;
    }

    public boolean isOverRefreshLineFromBottomToTop(){
        return mCurrentScrollPoint.y>-mOffsetToRefresh;
    }

    public boolean isOverTop() {
        return mCurrentScrollPoint.y >= POS_START;
    }

    public boolean isUnderTop() {
        return mCurrentScrollPoint.y < POS_START;
    }


    public boolean willOverTop(int to) {
        return to < POS_START;
    }

    public boolean isUnderTouch() {
        return mIsUnderTouch;
    }


    public void setPtrUIHandler(PtrUIHandler handler){
        mPtrUIHandler=handler;
    }

    public void removePtrUIHandler(){
        mPtrUIHandler=null;
    }

    public void setOverScrollByMaxDistance(boolean b){
        mOverScrollByMaxDistance=b;
    }




    private PointF mPtLastMove = new PointF();
    private float mOffsetX;
    private float mOffsetY;
    private int mCurrentPos = 0;
    private int mLastPos = 0;

    private int mPressedPos = 0;

    private float mResistance = 1.7f;

    private static final String TAG=PtrIndicator.class.getSimpleName();
    //第一次点击的位置
    private PointF mFirstPressDown=new PointF();

    //上一次处理过的移动的距离，遵循根号的递增
    private PointF mProcessLastDelta=new PointF();

    //当前处理过的移动的距离，遵循根号的递增
    private PointF mProcessCurrentDelta=new PointF();

    private int heightFactor=0;//控件高度-头部高度


    private int currentScrollY=0;


    protected void processOnMove(float currentX, float currentY, float offsetX, float offsetY) {
        setOffset(offsetX, offsetY / mResistance);
    }

    public int getOffsetToRefresh() {
        return mOffsetToRefresh;
    }

    public void onPressDown(float x, float y) {
        mIsUnderTouch = true;
        mPressedPos = mCurrentPos;
        mPtLastMove.set(x, y);

    }

    /**
     *
     * @param x
     * @param y
     * @param overSide 判断是否越过上下边界
     */
    public final void onMove(float x, float y,boolean overSide) {
        float offsetX = x - mPtLastMove.x;
        float offsetY = (y - mPtLastMove.y);
        processOnMove(x, y, offsetX, offsetY);
        mPtLastMove.set(x, y);

        processOnDelta(x,y,overSide);
    }

    public void onRelease() {
        mIsUnderTouch = false;

        firstReachSide=true;
        firstNotReachSide=true;
    }

    private boolean firstReachSide=true;
    private boolean firstNotReachSide=true;
    private float moveDistance=0;
    private void processOnDelta(float x, float y,boolean overSide) {

        if (overSide){
            if (firstReachSide) {
                mFirstPressDown.set(x, y);
                mProcessCurrentDelta.set(0, 0);
                firstReachSide=false;
            }
            float deltaY=y-mFirstPressDown.y;
            mProcessLastDelta.set(mProcessCurrentDelta.x,mProcessCurrentDelta.y);
            mProcessCurrentDelta.set(0,  (float) ((deltaY/Math.abs(deltaY))* Math.sqrt(Math.abs(deltaY)*heightFactor)));
            firstNotReachSide=true;
        }else {
            if (firstNotReachSide){
                mFirstPressDown.set(x, y);
                mProcessCurrentDelta.set(0, 0);
                firstNotReachSide=false;
            }
            float deltaY=y-mFirstPressDown.y;
            mProcessLastDelta.set(mProcessCurrentDelta.x,mProcessCurrentDelta.y);
            mProcessCurrentDelta.set(0, deltaY);
            moveDistance=deltaY;
            firstReachSide=true;
        }
    }

    //上一次和当前此处理后距离的相差
    public float getDeltaY(){
        return mProcessCurrentDelta.y-mProcessLastDelta.y;
    }


    protected void setOffset(float x, float y) {
        mOffsetX = x;
        mOffsetY = y;
    }





}