package com.lightappbuilder.lab4.labim;

import android.content.Context;
import android.content.SharedPreferences;

import com.lightappbuilder.lab4.lablibrary.utils.DisplayUtils;

/**
 * Created by vice on 2016/8/2.
 */
public class SharedPreferencesUtils {
    public static void setKeyboardHeight(Context context, int keyboardHeight) {
        SharedPreferences sp = context.getSharedPreferences("config", Context.MODE_PRIVATE);
        sp.edit().putInt("keyboardHeight", keyboardHeight).apply();
    }

    public static int getKeyboardHeight(Context context) {
        SharedPreferences sp = context.getSharedPreferences("config", Context.MODE_PRIVATE);
        return sp.getInt("keyboardHeight", DisplayUtils.dp2px(243));
    }
}
