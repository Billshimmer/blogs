package com.lightappbuilder.lab4.test;

import android.os.Bundle;
import android.util.Log;

import com.lightappbuilder.lab4.lablibrary.Config;
import com.lightappbuilder.lab4.lablibrary.LABActivity;
import com.lightappbuilder.lab4.lablibrary.startpagemgr.SplashDialogFragment;
import com.umeng.analytics.MobclickAgent;

public class MainActivity extends LABActivity {
    private static final String TAG = "MainActivity";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
//        StartPageManager.showStartPage(this);
        SplashDialogFragment.showSplash(this, R.drawable.splash);
//        if (BuildConfig.DEBUG) {
//            if (!ezy.assist.compat.SettingsCompat.canDrawOverlays(this)) {
//                Toast.makeText(this, "请开启悬浮窗权限", Toast.LENGTH_SHORT).show();
//                ezy.assist.compat.SettingsCompat.manageDrawOverlays(this);
//            }
//        }
        // 恢复Activity Theme为默认主题 释放启动背景图内存
        setTheme(R.style.TestAppTheme);
        super.onCreate(savedInstanceState);

        Log.i(TAG, "onCreate: Config:" + Config.getConfigJson());

//        getLABRootView().setDrawStatusBarBackground(false);
    }

    @Override
    protected void onResume() {
        super.onResume();
        MobclickAgent.onResume(this);
        Log.i(TAG, "onResume");
    }

    @Override
    protected void onPause() {
        super.onPause();
        MobclickAgent.onPause(this);
    }

    @Override
    protected String getMainComponentName() {
        return "index";
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        Log.i(TAG, "onDestroy");
    }
}
