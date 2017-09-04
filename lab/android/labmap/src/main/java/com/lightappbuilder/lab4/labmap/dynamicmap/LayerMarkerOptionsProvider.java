package com.lightappbuilder.lab4.labmap.dynamicmap;

import android.view.View;

import com.baidu.mapapi.map.MarkerOptions;
import com.lightappbuilder.lab4.labmap.ViewMarkerOptionsHelper;

/**
 * Created by yinhf on 2016/12/27.
 */

public abstract class LayerMarkerOptionsProvider {
    private ViewMarkerOptionsHelper viewMarkerOptionsHelper = new ViewMarkerOptionsHelper();

    public abstract MarkerOptions getLayerMarkerOptions(String type, PointData pointData);

    protected MarkerOptions crateMarkerOptions(View view, int widthMeasureSpec, int heightMeasureSpec) {
        return viewMarkerOptionsHelper.crateMarkerOptions(view, widthMeasureSpec, heightMeasureSpec);
    }
}
