package com.lightappbuilder.lab4.lablibrary.rnviews.scrollview;

import android.view.animation.Interpolator;

/**
 * Created by tygzx on 17/3/1.
 */

public class CustomAccelerateDecelerate implements Interpolator {

    @Override
    public float getInterpolation(float input) {
        return (float) ((Math.cos((input + 1) * Math.PI) / 2.0) + 0.5);
    }
}
