package com.lightappbuilder.lab4.lablibrary.rnviews.scrollview;

import android.os.SystemClock;

/**
 * Created by tygzx on 17/1/20.
 */

public class OnScrollDispatchHelper {

    private static final int MIN_EVENT_SEPARATION_MS = 10;

    private int mPrevX = Integer.MIN_VALUE;
    private int mPrevY = Integer.MIN_VALUE;
    private long mLastScrollEventTimeMs = -(MIN_EVENT_SEPARATION_MS + 1);

    /**
     * Call from a ScrollView in onScrollChanged, returns true if this onScrollChanged is legit (not a
     * duplicate) and should be dispatched.
     */
    public boolean onScrollChanged(int x, int y) {
        long eventTime = SystemClock.uptimeMillis();
        boolean shouldDispatch =
                eventTime - mLastScrollEventTimeMs > MIN_EVENT_SEPARATION_MS ||
                        mPrevX != x ||
                        mPrevY != y;

        mLastScrollEventTimeMs = eventTime;
        mPrevX = x;
        mPrevY = y;

        return shouldDispatch;
    }
}
