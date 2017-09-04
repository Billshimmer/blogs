package com.lightappbuilder.lab4.lablibrary.startpagemgr;

import android.app.Activity;
import android.app.DialogFragment;
import android.os.Bundle;
import android.os.SystemClock;
import android.support.annotation.Nullable;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;

import com.lightappbuilder.lab4.lablibrary.R;
import com.lightappbuilder.lab4.lablibrary.utils.UiThreadHelper;

/**
 * Created by yinhf on 2017/6/15.
 */

public class SplashDialogFragment extends DialogFragment {
    private static final String TAG = "SplashDialogFragment";

    private static final String LAB_SPLASH_DIALOG_TAG = "lab_splash_dialog";
    private static final int DEFAULT_SPLASH_DURATION = 2500;
    private static final int DEFAULT_MIN_SPLASH_DURATION = 1000;

    public static void showSplash(Activity activity, int splashImageResId) {
        SplashDialogFragment splashDialogFragment = new SplashDialogFragment();
        Bundle arguments = new Bundle();
        arguments.putInt("splash_image", splashImageResId);
        splashDialogFragment.setArguments(arguments);
        splashDialogFragment.show(activity.getFragmentManager(), LAB_SPLASH_DIALOG_TAG);
    }

    public static void hideSplash(Activity activity, boolean checkDuration) {
        SplashDialogFragment splashDialogFragment = (SplashDialogFragment) activity.getFragmentManager().findFragmentByTag(LAB_SPLASH_DIALOG_TAG);
        if (splashDialogFragment != null) {
            splashDialogFragment.hide(checkDuration);
        }
    }

    private int splashImageResId;
    private int splashDuration = DEFAULT_SPLASH_DURATION;
    private int splashMinDuration = DEFAULT_MIN_SPLASH_DURATION;
    private long showStartTime;

    private Runnable hideQDRunnable = new Runnable() {
        @Override
        public void run() {
            dismissAllowingStateLoss();
        }
    };

    public SplashDialogFragment() {
        super();
        setCancelable(false);
        setStyle(0, R.style.LABSplashDialogTheme);
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Bundle arguments = getArguments();
        splashImageResId = arguments.getInt("splash_image");
        showStartTime = SystemClock.elapsedRealtime();
        UiThreadHelper.postDelayedOnUiThread(hideQDRunnable, splashDuration);
    }

    @Nullable
    @Override
    public View onCreateView(LayoutInflater inflater, @Nullable ViewGroup container, Bundle savedInstanceState) {
        ImageView imageView = new ImageView(getActivity());
        imageView.setScaleType(ImageView.ScaleType.CENTER_CROP);
        imageView.setLayoutParams(new ViewGroup.LayoutParams(-1, -1));
        imageView.setImageResource(splashImageResId);
        return imageView;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        UiThreadHelper.removeUiHandlerCallbacks(hideQDRunnable);
    }

    public void hide(boolean checkDuration) {
        UiThreadHelper.removeUiHandlerCallbacks(hideQDRunnable);
        if (checkDuration) {
            long dt = SystemClock.elapsedRealtime() - showStartTime;
            long remainTime = splashMinDuration - dt;
            if (remainTime > 0) {
                UiThreadHelper.postDelayedOnUiThread(hideQDRunnable, remainTime);
            } else {
                hideQDRunnable.run();
            }
        } else {
            hideQDRunnable.run();
        }
    }
}
