package com.lightappbuilder.lab4.lablibrary;

import android.annotation.TargetApi;
import android.content.Context;
import android.graphics.Canvas;
import android.graphics.drawable.ColorDrawable;
import android.graphics.drawable.Drawable;
import android.os.Build;
import android.util.AttributeSet;
import android.util.Log;
import android.view.View;
import android.view.WindowInsets;
import android.widget.FrameLayout;

/**
 * Created by yhf on 2016/8/8.
 * 实现绘制顶部statusBar区域半透明背景
 * 消耗顶部Insets(但并不设置paddingTop)并将剩余Insets传递给所有子View
 * 参考DrawLayout处理方式
 * status bar 高度
 * https://www.reddit.com/r/Android/comments/37zafp/it_seems_the_status_bar_size_has_been_reduced_to/
 * https://plus.google.com/+AlexLockwood/posts/GiUNZukWf52
 */
public class LABRootView extends FrameLayout {
    private static final String TAG = "LABRootView";

    private Drawable mStatusBarBackground;
    private Object mLastInsets;
    private Object mChildInsets;
    private boolean softInputAdjustResize;
    private boolean drawStatusBarBackground = true;

    public LABRootView(Context context) {
        super(context);
        init();
    }

    public LABRootView(Context context, AttributeSet attrs) {
        super(context, attrs);
        init();
    }

    public LABRootView(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init();
    }

    @TargetApi(Build.VERSION_CODES.LOLLIPOP)
    public LABRootView(Context context, AttributeSet attrs, int defStyleAttr, int defStyleRes) {
        super(context, attrs, defStyleAttr, defStyleRes);
        init();
    }

    private void init() {
        if (Build.VERSION.SDK_INT >= 21) {
            // TODO 参考最新 CoordinatorLayout
            setFitsSystemWindows(true);
            setOnApplyWindowInsetsListener(new OnApplyWindowInsetsListener() {

                @TargetApi(Build.VERSION_CODES.KITKAT_WATCH)
                @Override
                public WindowInsets onApplyWindowInsets(View v, WindowInsets insets) {
                    mLastInsets = insets;
                    Log.i(TAG, "onApplyWindowInsets: top:" + insets.getSystemWindowInsetTop() + " bottom:" + insets.getSystemWindowInsetBottom());
                    //本View消耗掉顶部statusBar区域的insets //TODO 对windowTranslucentNavigation的支持
                    if (softInputAdjustResize) {
                        mChildInsets = insets.replaceSystemWindowInsets(insets.getSystemWindowInsetLeft(), 0, insets.getSystemWindowInsetRight(), 0);
                        //TODO 更好的setPadding方式
                        setPadding(getPaddingLeft(), getPaddingTop(), getPaddingRight(), insets.getSystemWindowInsetBottom());
                    } else {
                        mChildInsets = insets.replaceSystemWindowInsets(insets.getSystemWindowInsetLeft(), 0, insets.getSystemWindowInsetRight(), insets.getSystemWindowInsetBottom());
                    }
                    requestLayout();
                    return insets.consumeSystemWindowInsets();
                }
            });
            setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                    | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN);

            //TODO 不知道android 系统标准的statusBar透明度是多少,暂时参考这个库 https://github.com/niorgai/StatusBarCompat
            mStatusBarBackground = new ColorDrawable(0x70000000);
            setWillNotDraw(false);
        }
    }

    @Override
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        if (Build.VERSION.SDK_INT >= 21) {
            if (mChildInsets != null) {
                final int childCount = getChildCount();
                final WindowInsets insets = (WindowInsets) mChildInsets;
                for (int i = 0; i < childCount; ++i) {
                    final View child = getChildAt(i);
                    if (child.getVisibility() == GONE) {
                        continue;
                    }
                    child.dispatchApplyWindowInsets(insets);
                }
            }
        }
        super.onMeasure(widthMeasureSpec, heightMeasureSpec);
    }

    @Override
    public void draw(Canvas canvas) {
        super.draw(canvas);
        if (Build.VERSION.SDK_INT >= 21 && drawStatusBarBackground) {
            if (mStatusBarBackground != null && mLastInsets != null) {
                WindowInsets insets = (WindowInsets) mLastInsets;
                final int inset = insets.getSystemWindowInsetTop();
                if (inset > 0) {
                    mStatusBarBackground.setBounds(0, 0, getWidth(), inset);
                    mStatusBarBackground.draw(canvas);
                }
            }
        }
    }

    public Drawable getStatusBarBackground() {
        return mStatusBarBackground;
    }

    public void setStatusBarBackground(Drawable statusBarBackground) {
        this.mStatusBarBackground = statusBarBackground;
        invalidate();
    }

    /**
     * API >= 21
     * 设置全局的底部键盘弹出时伸缩
     */
    public void setEnableSoftInputAdjustResize(boolean enabled) {
        softInputAdjustResize = enabled;
    }

    public void setDrawStatusBarBackground(boolean draw) {
        this.drawStatusBarBackground = draw;
    }

}
