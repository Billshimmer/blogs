package com.lightappbuilder.lab4.lablibrary.rnviews.scrollview;


/**
 * Created by tygzx on 17/1/22.
 */

public interface PtrUIHandler {

    /**
     * When the content ViewGroup has reached top and refresh has been completed, ViewGroup will be reset.
     *
     * @param
     */
    public void onUIReset();

    /**
     * prepare for loading
     *
     * @param
     */
    public void onUIRefreshPrepare();

    public void onUIReleaseToRefresh();

    /**
     * perform refreshing UI
     */
    public void onUIRefreshBegin();

    /**
     * perform UI after refresh
     */
    public void onUIRefreshComplete();

    public void onUIPositionChange();

    public void onUIRefreshFooterBegin();
}