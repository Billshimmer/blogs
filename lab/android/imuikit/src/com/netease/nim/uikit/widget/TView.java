package com.netease.nim.uikit.widget;

import android.app.Activity;
import android.content.Context;
import android.os.Bundle;
import android.os.Handler;
import android.util.AttributeSet;
import android.util.Log;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import android.widget.FrameLayout;


/**
 * Created by zhengqiang on 2017/1/1.
 */

public class TView extends FrameLayout {

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

    public TView(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        //onCreateView(context);
    }

    public TView(Context context, AttributeSet attrs) {
        this(context, attrs, 0);
    }

    public TView(Context context) {
        this(context, null);
    }

    public void onActivityCreated(Bundle savedInstanceState) {

        //Log.i("TView: " + getClass().getSimpleName() + " onActivityCreated()");
        destroyed = false;
    }

    protected void onCreateView(Context context) {

    }

    public void onDestroy() {

        //LogUtil.ui("TView: " + getClass().getSimpleName() + " onDestroy()");

        destroyed = true;
    }

    public final Handler getHandler() {
        return handler;
    }

//    public final void postRunnable(final Runnable runnable) {
//        handler.post(new Runnable() {
//            @Override
//            public void run() {
//                // validate
//                //
//                if ((Activity) getContext() == null) {
//                    return;
//                }
//                // run
//                runnable.run();
//            }
//        });
//    }

    /*public final void postDelayed(final Runnable runnable, long delay) {
        handler.postDelayed(new Runnable() {
            @Override
            public void run() {
                // validate
                //
                if ((Activity)getContext()==null) {
                    return;
                }
                // run
                runnable.run();
            }
        }, delay);
    }*/

//    @Override
//    public boolean postDelayed(Runnable action, long delayMillis) {
//        return super.postDelayed(action, delayMillis);
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
        Activity activity = (Activity) view.getContext();
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
        return (T) (findViewById(resId));
    }

    /*protected void setToolBar(int toolbarId, int titleId, int logoId) {
        if (getActivity() != null && getActivity() instanceof UI) {
            ((UI)getActivity()).setToolBar(toolbarId, titleId, logoId);
        }
    }
    protected void setTitle(int titleId) {
        if (getActivity() != null && getActivity() instanceof UI) {
            getActivity().setTitle(titleId);
        }
    }*/
}
