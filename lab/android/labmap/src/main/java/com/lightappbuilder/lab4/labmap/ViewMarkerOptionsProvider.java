package com.lightappbuilder.lab4.labmap;

import android.view.View;

import com.baidu.mapapi.map.MarkerOptions;
import com.facebook.react.bridge.ReadableMap;

/**
 * Created by yinhf on 2016/12/14.
 */

public abstract class ViewMarkerOptionsProvider {
    private ViewMarkerOptionsHelper viewMarkerOptionsHelper = new ViewMarkerOptionsHelper();

    public abstract MarkerOptions getViewMarkerOptions(String type, String title, ReadableMap data);

    protected MarkerOptions crateMarkerOptions(View view, int widthMeasureSpec, int heightMeasureSpec) {
        return viewMarkerOptionsHelper.crateMarkerOptions(view, widthMeasureSpec, heightMeasureSpec);
    }

}
