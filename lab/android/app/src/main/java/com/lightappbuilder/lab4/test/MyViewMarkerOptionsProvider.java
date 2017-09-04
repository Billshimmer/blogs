package com.lightappbuilder.lab4.test;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.TextView;

import com.baidu.mapapi.map.MarkerOptions;
import com.facebook.react.bridge.ReadableMap;
import com.lightappbuilder.lab4.lablibrary.utils.DisplayUtils;
import com.lightappbuilder.lab4.labmap.ViewMarkerOptionsProvider;

/**
 * Created by yinhf on 2016/12/14.
 */

public class MyViewMarkerOptionsProvider extends ViewMarkerOptionsProvider {

    private int widthMeasureSpec;
    private int heightMeasureSpec;

    private View view;
    private TextView titleView;

    public MyViewMarkerOptionsProvider(Context context) {
        view = LayoutInflater.from(context).inflate(R.layout.test_marker, null);
        titleView = (TextView) view.findViewById(R.id.title);
        widthMeasureSpec =
                View.MeasureSpec.makeMeasureSpec(DisplayUtils.dp2px(100), View.MeasureSpec.AT_MOST);
        heightMeasureSpec = View.MeasureSpec.makeMeasureSpec(DisplayUtils.dp2px(80), View.MeasureSpec.AT_MOST);
    }

    @Override
    public MarkerOptions getViewMarkerOptions(String type, String title, ReadableMap data) {
        title = type + "-" + title + "-" + Math.random();
        titleView.setText(title);

        return crateMarkerOptions(view, widthMeasureSpec, heightMeasureSpec);
    }
}
