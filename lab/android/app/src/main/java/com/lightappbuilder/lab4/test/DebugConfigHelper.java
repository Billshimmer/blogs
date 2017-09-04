package com.lightappbuilder.lab4.test;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.SystemClock;
import android.view.MotionEvent;

import com.facebook.react.ReactApplication;
import com.lightappbuilder.lab4.lablibrary.utils.DisplayUtils;
import com.lightappbuilder.lab4.lablibrary.utils.ToastUtils;

/**
 * Created by yinhf on 2015/11/11.
 */
public class DebugConfigHelper {

    private static int debugTouchCount = 0;
    private static long debugTouchTime = 0;

    public static void dispatchTouchEvent(MotionEvent ev, Context context) {
        //屏幕右侧边缘向内滑动3次进入测试配置页面
        switch(ev.getAction()) {
        case MotionEvent.ACTION_DOWN:
            if((debugTouchTime == 0 || SystemClock.elapsedRealtime() - debugTouchTime < 500)
                    && ev.getX() >= DisplayUtils.getDisplayMetrics().widthPixels - DisplayUtils.dp2px(35)) {
                ++debugTouchCount;
                debugTouchTime = SystemClock.elapsedRealtime();
            } else {
                debugTouchCount = 0;
                debugTouchTime = 0;
            }
            break;
        case MotionEvent.ACTION_UP:
            if(SystemClock.elapsedRealtime() - debugTouchTime < 500 && ev.getX() < DisplayUtils.getDisplayMetrics().widthPixels - DisplayUtils.dp2px(35)) {
                if(debugTouchCount >= 3) {
                    ((ReactApplication) context.getApplicationContext()).getReactNativeHost().getReactInstanceManager().showDevOptionsDialog();
                    debugTouchCount = 0;
                    debugTouchTime = 0;
                } else {
                    debugTouchTime = SystemClock.elapsedRealtime();
                }
            } else {
                debugTouchCount = 0;
                debugTouchTime = 0;
            }
            break;
        }
    }
}
