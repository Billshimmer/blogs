package com.lightappbuilder.lab4.lablibrary.utils;

import android.content.Context;

public class AppContextUtils {

    private static Context sAppContext;

    public static Context get() {
        if(sAppContext == null) {
            throw new NullPointerException("the context is null, please init AppContextUtils in Application first.");
        }
        return sAppContext;
    }

    public static void init(Context context) {
        sAppContext = context;
    }
}
