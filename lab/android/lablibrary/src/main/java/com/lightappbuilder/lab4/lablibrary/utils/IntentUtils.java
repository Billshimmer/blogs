package com.lightappbuilder.lab4.lablibrary.utils;

import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;

/**
 * Created by yinhf on 16/8/15.
 */
public class IntentUtils {

    /**
     * 获取启动主Activity的Intent
     * TODO 可配置
     */
    public static Intent getLaunchIntent(Context context) {
        return context.getPackageManager().getLaunchIntentForPackage(context.getPackageName());
    }

    /**
     * 判断Intent是否为当前app内部的Activity的Intent
     */
    public static boolean isCurrentAppActivityIntent(Context context, Intent intent) {
        ComponentName componentName = intent.resolveActivity(context.getPackageManager());
        String otherPackageName = (componentName != null ? componentName.getPackageName() : null);
        return context.getPackageName().equals(otherPackageName);
    }
}
