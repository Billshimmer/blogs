package com.lightappbuilder.lab4.lablibrary.utils;

import android.widget.Toast;

public class ToastUtils {

    private ToastUtils() {}

    public static void showShort(CharSequence msg) {
        Toast.makeText(AppContextUtils.get(), msg, Toast.LENGTH_SHORT).show();
    }

    public static void showLong(CharSequence msg) {
        Toast.makeText(AppContextUtils.get(), msg, Toast.LENGTH_LONG).show();
    }

    public static void showShort(int msg) {
        Toast.makeText(AppContextUtils.get(), msg, Toast.LENGTH_SHORT).show();
    }

    public static void showLong(int msg) {
        Toast.makeText(AppContextUtils.get(), msg, Toast.LENGTH_LONG).show();
    }

}
