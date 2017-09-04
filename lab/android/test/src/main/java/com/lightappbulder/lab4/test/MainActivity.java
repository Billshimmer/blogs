package com.lightappbulder.lab4.test;

import android.os.Bundle;
import android.util.Log;
import android.widget.Toast;
import com.hyphenate.EMCallBack;
import com.hyphenate.chat.EMClient;
import com.lightappbuilder.lab4.lablibrary.LABActivity;

public class MainActivity extends LABActivity {
    private static final String TAG = "MainActivity";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
//        if (BuildConfig.DEBUG) {
//            if (!ezy.assist.compat.SettingsCompat.canDrawOverlays(this)) {
//                Toast.makeText(this, "请开启悬浮窗权限", Toast.LENGTH_SHORT).show();
//                ezy.assist.compat.SettingsCompat.manageDrawOverlays(this);
//            }
//        }
        super.onCreate(savedInstanceState);
//        EMClient.getInstance().login("dansejijie","xhzxzq15",new EMCallBack() {//回调
//            @Override
//            public void onSuccess() {
//                EMClient.getInstance().groupManager().loadAllGroups();
//                EMClient.getInstance().chatManager().loadAllConversations();
//                Log.e(TAG,"im login success");
//                //Toast.makeText(MainActivity.this,"登录聊天服务器成功！",Toast.LENGTH_SHORT);
//
//            }
//
//            @Override
//            public void onProgress(int progress, String status) {
//                //Log.e(TAG,status);
//            }
//
//            @Override
//            public void onError(int code, String message) {
//                Log.e(TAG, "im login failed ,message:"+message);
//            }
//        });
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
