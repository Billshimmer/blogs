package com.lightappbuilder.lab4.lablibrary.utils;

import android.graphics.Color;

/**
 * Created by yinhf on 16/1/5.
 */
public class ColorUtils {

    public static int parseColor(String colorString, int fallback) {
        try {
            return Color.parseColor(colorString);
        } catch (Exception ignored) {
        }
        return fallback;
    }
}
