package com.lightappbuilder.lab4.lablibrary;

import android.os.Bundle;
import android.view.View;

import com.facebook.react.ReactActivity;

/**
 * Created by yinhf on 16/7/15.
 */
public abstract class LABActivity extends ReactActivity {
    private static final String TAG = "LABActivity";

    private static LABActivity currentActivity;

    /**
     * TODO
     */
    public static LABActivity getCurrentActivity() {
        return currentActivity;
    }

    private boolean rootViewEnabled = true;
    protected LABRootView mLABRootView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        currentActivity = this;
    }

    @Override
    protected void onResume() {
        super.onResume();
        currentActivity = this;
    }

    @Override
    protected void onPause() {
        super.onPause();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (currentActivity == this) {
            currentActivity = null;
        }
    }

    /**
     * 设置是否启用LABRootView
     * 需在super.onCreate()之前调用
     */
    protected void setLABRootViewEnabled(boolean enabled) {
        rootViewEnabled = enabled;
    }

    protected LABRootView getLABRootView() {
        return mLABRootView;
    }

    @Override
    public void setContentView(View view) {
        if (rootViewEnabled) {
            //TODO 更好的插入LABRootView的方式
            mLABRootView = new LABRootView(this);
            mLABRootView.addView(view, -1, -1);
            view = mLABRootView;
        }
        super.setContentView(view);
    }
}
