package com.lightappbuilder.lab4.lablibrary.utils;

import android.content.Context;
import android.content.SharedPreferences;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;

public class AppUtils {

    private AppUtils() {

    }

    /**
     * 获取应用程序名称
     * @return null 出错
     */
    public static String getAppName(Context context) {
        try {
            PackageInfo pi = context.getPackageManager().getPackageInfo(context.getPackageName(), 0);
            return context.getResources().getString(pi.applicationInfo.labelRes);
        } catch(PackageManager.NameNotFoundException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * 获取versionCode
     * @return -1 出错
     */
    public static int getVersionCode(Context context) {
        try {
            PackageInfo pi = context.getPackageManager().getPackageInfo(
                    context.getPackageName(), 0);
            return pi.versionCode;
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
        }
        return -1;
    }

    /**
     *  获取versionName
     *  @return null 出错
     */
    public static String getVersionName(Context context) {
        try {
            PackageInfo pi = context.getPackageManager().getPackageInfo(context.getPackageName(), 0);
            //Log.i("Version","Version:"+"getVersionName ");
            return pi.versionName;
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * 是否首次启动
     */
    public static boolean isFirstRun(Context context) {
        final String isFirstRunKey = "lab_isFirstRun";
        SharedPreferences sharedPreferences = context.getSharedPreferences("lab_common", Context.MODE_PRIVATE);
        boolean isFirstRun = sharedPreferences.getBoolean(isFirstRunKey, true);
        if(isFirstRun) {
            sharedPreferences.edit().putBoolean(isFirstRunKey, false).apply();
        }
        return isFirstRun;
    }
}
