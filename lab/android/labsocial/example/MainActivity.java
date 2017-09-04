package com.lightappbuilder.lab4.labsocial;

import android.Manifest;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.support.v4.app.ActivityCompat;

import com.facebook.react.ReactActivity;
import com.umeng.socialize.Config;
import com.umeng.socialize.UMShareAPI;

public class MainActivity extends ReactActivity {
    public static UMShareAPI mShareAPI = null;

    @Override
    protected String getMainComponentName() {
        return "YouMengDemo";
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        mShareAPI = UMShareAPI.get(getApplicationContext());

//       如想让你的app在android 6.0系统上也能运行的话，需要动态获取权限，没有权限的话分享sdk会出错，参考一下代码做动态获取权限,适配安卓6.0系统
//       你需要最新的android.support.v4包，或者v13的包可也以
        if (Build.VERSION.SDK_INT >= 23) {
            String[] mPermissionList = new String[]{Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.CALL_PHONE, Manifest.permission.READ_LOGS, Manifest.permission.READ_PHONE_STATE, Manifest.permission.WRITE_EXTERNAL_STORAGE, Manifest.permission.SET_DEBUG_APP, Manifest.permission.SYSTEM_ALERT_WINDOW, Manifest.permission.GET_ACCOUNTS};
            ActivityCompat.requestPermissions(MainActivity.this, mPermissionList, 100);
        }
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        mShareAPI.onActivityResult(requestCode, resultCode, data);
    }
}
