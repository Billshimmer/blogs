package com.lightappbuilder.lab4.test;

import android.content.Context;
import android.graphics.Rect;
import android.util.AttributeSet;
import android.util.Log;
import android.view.inputmethod.InputMethodManager;
import android.widget.EditText;

import com.facebook.infer.annotation.Assertions;

/**
 * Created by yinhf on 2016/10/24.
 */

public class TestEditText extends EditText {
    private static final String TAG = "TestEditText";

    private InputMethodManager mInputMethodManager;
    private boolean mIsJSSettingFocus;

    public TestEditText(Context context) {
        super(context);
        init();
    }

    public TestEditText(Context context, AttributeSet attrs) {
        super(context, attrs);
        init();
    }

    public TestEditText(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init();
    }

    private void init() {
        mInputMethodManager = (InputMethodManager)
                Assertions.assertNotNull(getContext().getSystemService(Context.INPUT_METHOD_SERVICE));
    }

    public boolean showSoftKeyboard() {
        return mInputMethodManager.showSoftInput(this, 0);
    }

    public void hideSoftKeyboard() {
        mInputMethodManager.hideSoftInputFromWindow(getWindowToken(), 0);
    }

    public void requestFocusFromJS() {
        mIsJSSettingFocus = true;
        requestFocus();
        mIsJSSettingFocus = false;
    }

    @Override
    public void clearFocus() {
        //setFocusableInTouchMode(false);
        super.clearFocus();
        //hideSoftKeyboard();
    }

    @Override
    public boolean requestFocus(int direction, Rect previouslyFocusedRect) {
        Log.i(TAG, "requestFocus: direction=" + direction + " previouslyFocusedRect=" + previouslyFocusedRect + " isFocused()=" + isFocused() + " mIsJSSettingFocus=" + mIsJSSettingFocus);
        // Always return true if we are already focused. This is used by android in certain places,
        // such as text selection.
        if (isFocused()) {
            return true;
        }
        if (!mIsJSSettingFocus) {
            return false;
        }
        //setFocusableInTouchMode(true);
        boolean focused = super.requestFocus(direction, previouslyFocusedRect);
        //showSoftKeyboard();
        Log.d(TAG, "requestFocus() returned: " + focused);
        return focused;
    }

    @Override
    protected void onFocusChanged(boolean focused, int direction, Rect previouslyFocusedRect) {
        Log.d(TAG, "onFocusChanged() brfore called with: focused = [" + focused + "], direction = [" + direction + "], previouslyFocusedRect = [" + previouslyFocusedRect + "]");
        super.onFocusChanged(focused, direction, previouslyFocusedRect);
        Log.d(TAG, "onFocusChanged() after called with: focused = [" + focused + "], direction = [" + direction + "], previouslyFocusedRect = [" + previouslyFocusedRect + "]");
    }

    @Override
    public void onWindowFocusChanged(boolean hasWindowFocus) {
        Log.d(TAG, "onWindowFocusChanged() before called with: hasWindowFocus = [" + hasWindowFocus + "]");
        super.onWindowFocusChanged(hasWindowFocus);
        Log.d(TAG, "onWindowFocusChanged() after called with: hasWindowFocus = [" + hasWindowFocus + "]");
    }
}
