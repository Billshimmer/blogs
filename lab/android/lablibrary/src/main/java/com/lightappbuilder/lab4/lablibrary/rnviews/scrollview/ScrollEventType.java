package com.lightappbuilder.lab4.lablibrary.rnviews.scrollview;

/**
 * Created by tygzx on 17/1/20.
 */

public enum ScrollEventType {
    BEGIN_DRAG("topScrollBeginDrag"),
    END_DRAG("topScrollEndDrag"),
    SCROLL("topScroll"),
    MOMENTUM_BEGIN("topMomentumScrollBegin"),
    MOMENTUM_END("topMomentumScrollEnd"),
    ANIMATION_END("topScrollAnimationEnd");

    private final String mJSEventName;

    ScrollEventType(String jsEventName) {
        mJSEventName = jsEventName;
    }

    public String getJSEventName() {
        return mJSEventName;
    }
}