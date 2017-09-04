package com.lightappbuilder.lab4.lablibrary.utils;

import android.app.Activity;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.provider.Settings;
import android.support.annotation.NonNull;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.AlertDialog;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 * Created by yinhf on 16/9/30.
 */

public class SimplePermissionChecker {

    private static final int PERMISSION_REQUEST_CODE = 333;
    private static final String PACKAGE_URL_SCHEME = "package:";

    private Activity activity;
    private String[] allPermissions; //需要请求的权限
    private List<String> requiredPermissions; //必须具有的权限
    private boolean isRequireCheck = true;
    private OnRequiredPermissionGrantedListener onRequiredPermissionGrantedListener;

    public SimplePermissionChecker(Activity activity, String [] requiredPermissions, String[] permissions) {
        this.activity = activity;

        ArrayList<String> allPermissions = new ArrayList<>();
        if (requiredPermissions != null) {
            Collections.addAll(allPermissions, requiredPermissions);
            this.requiredPermissions = Arrays.asList(requiredPermissions);
        } else {
            this.requiredPermissions = Collections.emptyList();
        }
        if (permissions != null) {
            for (String permission : permissions) {
                if (!allPermissions.contains(permission)) {
                    allPermissions.add(permission);
                }
            }
        }
        this.allPermissions = allPermissions.toArray(new String[allPermissions.size()]);

    }

    public void onResume() {
        if (isRequireCheck) {
            isRequireCheck = false;
            String[] lacksPermissions = getLacksPermissions();
            if (lacksPermissions.length > 0) {
                ActivityCompat.requestPermissions(activity, lacksPermissions, PERMISSION_REQUEST_CODE);
            } else if (onRequiredPermissionGrantedListener != null) {
                onRequiredPermissionGrantedListener.onRequiredPermissionGranted();
            }
        }
    }

    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        if (requestCode == PERMISSION_REQUEST_CODE) {
            for (int i = 0; i < permissions.length; ++i) {
                if (grantResults[i] != PackageManager.PERMISSION_GRANTED && requiredPermissions.contains(permissions[i])) {
                    //有必须权限没有给予
                    showMissingPermissionDialog();
                    return;
                }
            }
            if (onRequiredPermissionGrantedListener != null) {
                onRequiredPermissionGrantedListener.onRequiredPermissionGranted();
            }
        }
    }

    private String[] getLacksPermissions() {
        ArrayList<String> lacksPermissions = new ArrayList<>();
        for (String permission : allPermissions) {
            if (ContextCompat.checkSelfPermission(activity, permission) == PackageManager.PERMISSION_DENIED) {
                lacksPermissions.add(permission);
            }
        }
        return lacksPermissions.toArray(new String[lacksPermissions.size()]);
    }

    // 显示缺失权限提示
    private void showMissingPermissionDialog() {
        AlertDialog.Builder builder = new AlertDialog.Builder(activity);
        builder.setTitle("帮助");
        builder.setMessage("当前应用缺少必要权限。\n\n请点击\"设置\"-\"权限\"-打开所需权限。");

        // 拒绝, 退出应用
        builder.setNegativeButton("退出", new DialogInterface.OnClickListener() {
            @Override public void onClick(DialogInterface dialog, int which) {
                activity.finish();
            }
        });

        builder.setPositiveButton("设置", new DialogInterface.OnClickListener() {
            @Override public void onClick(DialogInterface dialog, int which) {
                startAppSettings();
                isRequireCheck = true;
            }
        });

        builder.setCancelable(false);

        builder.show();
    }

    // 启动应用的设置
    private void startAppSettings() {
        Intent intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
        intent.setData(Uri.parse(PACKAGE_URL_SCHEME + activity.getPackageName()));
        activity.startActivity(intent);
    }

    public void setOnRequiredPermissionGrantedListener(OnRequiredPermissionGrantedListener onRequiredPermissionGrantedListener) {
        this.onRequiredPermissionGrantedListener = onRequiredPermissionGrantedListener;
    }

    public interface OnRequiredPermissionGrantedListener {
        void onRequiredPermissionGranted();
    }
}
