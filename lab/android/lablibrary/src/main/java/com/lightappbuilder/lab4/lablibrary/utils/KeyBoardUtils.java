package com.lightappbuilder.lab4.lablibrary.utils;

import android.app.Activity;
import android.content.Context;
import android.view.View;
import android.view.inputmethod.InputMethodManager;

/**
 * 软键盘工具
 * Created by yhf on 2015/5/26.
 */
public class KeyBoardUtils {

    private static InputMethodManager imm;

    private static InputMethodManager getInputMethodManager(Context context) {
        if(imm == null) {
            imm = (InputMethodManager) context.getSystemService(Context.INPUT_METHOD_SERVICE);
        }
        return imm;
    }

    /**
     * 打开软键盘
     */
    public static void show(View view) {
        InputMethodManager imm = getInputMethodManager(view.getContext());
        imm.showSoftInput(view, InputMethodManager.RESULT_SHOWN);
        imm.toggleSoftInput(InputMethodManager.SHOW_FORCED, InputMethodManager.HIDE_IMPLICIT_ONLY);
    }

    /**
     * 关闭软键盘
     */
    public static void hide(View view) {
        InputMethodManager imm = getInputMethodManager(view.getContext());
        imm.hideSoftInputFromWindow(view.getWindowToken(), 0);
    }

    /**
     * 关闭软键盘
     */
    public static void hide(Activity activity) {
        InputMethodManager imm = getInputMethodManager(activity);
        imm.hideSoftInputFromWindow(activity.getWindow().getDecorView().getWindowToken(), 0);
    }

}
