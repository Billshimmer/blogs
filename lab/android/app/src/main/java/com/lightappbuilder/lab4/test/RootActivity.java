package com.lightappbuilder.lab4.test;

import android.Manifest;
import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;

import com.lightappbuilder.lab4.lablibrary.utils.SimplePermissionChecker;

public class RootActivity extends AppCompatActivity implements SimplePermissionChecker.OnRequiredPermissionGrantedListener {

    private SimplePermissionChecker permissionChecker;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        permissionChecker = new SimplePermissionChecker(this, new String[] {Manifest.permission.WRITE_CALENDAR, Manifest.permission.CALL_PHONE, Manifest.permission.READ_SMS, Manifest.permission.READ_EXTERNAL_STORAGE, Manifest.permission.WRITE_EXTERNAL_STORAGE}, new String[] {Manifest.permission.CAMERA, Manifest.permission.ACCESS_FINE_LOCATION});
        permissionChecker.setOnRequiredPermissionGrantedListener(this);
    }

    @Override
    protected void onResume() {
        super.onResume();
        permissionChecker.onResume();
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        permissionChecker.onRequestPermissionsResult(requestCode, permissions, grantResults);
    }

    private void toMain() {
        Intent intent = new Intent(getIntent());
        intent.setClass(this, MainActivity.class);
        startActivity(intent);
        finish();
    }

    @Override
    public void onRequiredPermissionGranted() {
        toMain();
    }
}
