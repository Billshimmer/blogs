package com.netease.nim.uikit.extra.session.view;

import android.app.Activity;
import android.content.Context;
import android.os.Bundle;
import android.os.Handler;
import android.support.annotation.AttrRes;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.util.AttributeSet;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import android.widget.FrameLayout;

import com.netease.nim.uikit.common.activity.UI;
import com.netease.nim.uikit.common.util.log.LogUtil;

/**
 * Created by tygzx on 17/5/24.
 */

public class TView extends FrameLayout {

    public TView(@NonNull Context context, int containerId) {
        super(context);
        this.containerId = containerId;
    }

    public TView(@NonNull Context context, @Nullable AttributeSet attrs, int containerId) {
        super(context, attrs);
        this.containerId = containerId;
    }

    public TView(@NonNull Context context, @Nullable AttributeSet attrs, @AttrRes int defStyleAttr, int containerId) {
        super(context, attrs, defStyleAttr);
        this.containerId = containerId;
    }

    private static final Handler handler = new Handler();

    private int containerId;

    private boolean destroyed;

    protected final boolean isDestroyed() {
        return destroyed;
    }

    public int getContainerId() {
        return containerId;
    }

    public void setContainerId(int containerId) {
        this.containerId = containerId;
    }


    public void onActivityCreated(Bundle savedInstanceState) {


        LogUtil.ui("fragment: " + getClass().getSimpleName() + " onActivityCreated()");

        destroyed = false;
    }

    public void onDestroy() {


        LogUtil.ui("fragment: " + getClass().getSimpleName() + " onDestroy()");

        destroyed = true;
    }

//    public final Handler getHandler() {
//        return handler;
//    }

//    protected final void postRunnable(final Runnable runnable) {
//        handler.post(new Runnable() {
//            @Override
//            public void run() {
//                // validate
//                // TODO use getActivity ?
//                if ((Activity)getContext()==null) {
//                    return;
//                }
//
//                // run
//                runnable.run();
//            }
//        });
//    }

//    public final void postDelayed(final Runnable runnable, long delay) {
//        handler.postDelayed(new Runnable() {
//            @Override
//            public void run() {
//                // validate
//                // TODO use getActivity ?
//                if ((Activity)getContext()==null) {
//                    return;
//                }
//
//                // run
//                runnable.run();
//            }
//        }, delay);
//    }

    protected void showKeyboard(boolean isShow) {
        Activity activity = (Activity) getContext();
        if (activity == null) {
            return;
        }

        InputMethodManager imm = (InputMethodManager) activity.getSystemService(Context.INPUT_METHOD_SERVICE);
        if (imm == null) {
            return;
        }

        if (isShow) {
            if (activity.getCurrentFocus() == null) {
                imm.toggleSoftInput(InputMethodManager.SHOW_FORCED, 0);
            } else {
                imm.showSoftInput(activity.getCurrentFocus(), 0);
            }
        } else {
            if (activity.getCurrentFocus() != null) {
                imm.hideSoftInputFromWindow(activity.getCurrentFocus().getWindowToken(),
                        InputMethodManager.HIDE_NOT_ALWAYS);
            }

        }
    }

    protected void hideKeyboard(View view) {
        Activity activity = (Activity) getContext();
        if (activity == null) {
            return;
        }

        InputMethodManager imm = (InputMethodManager) activity.getSystemService(Context.INPUT_METHOD_SERVICE);
        if (imm == null) {
            return;
        }

        imm.hideSoftInputFromWindow(
                view.getWindowToken(),
                InputMethodManager.HIDE_NOT_ALWAYS);
    }

    protected <T extends View> T findView(int resId) {
        return (T) findViewById(resId);
    }

//    protected void setToolBar(int toolbarId, int titleId, int logoId) {
//        if (getActivity() != null && getActivity() instanceof UI) {
//            ((UI)getActivity()).setToolBar(toolbarId, titleId, logoId);
//        }
//    }
//    protected void setTitle(int titleId) {
//        if (getActivity() != null && getActivity() instanceof UI) {
//            getActivity().setTitle(titleId);
//        }
//    }
}
