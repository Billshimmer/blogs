package com.lightappbuilder.lab4.lablibrary.startpagemgr;

import android.net.Uri;
import android.os.Bundle;
import android.os.SystemClock;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;

import com.facebook.drawee.backends.pipeline.Fresco;
import com.facebook.drawee.drawable.ScalingUtils;
import com.facebook.drawee.generic.GenericDraweeHierarchy;
import com.facebook.drawee.interfaces.DraweeController;
import com.facebook.drawee.interfaces.DraweeHierarchy;
import com.facebook.drawee.view.SimpleDraweeView;
import com.facebook.imagepipeline.request.ImageRequestBuilder;
import com.lightappbuilder.lab4.lablibrary.R;
import com.lightappbuilder.lab4.lablibrary.utils.UiThreadHelper;

/**
 * Created by yinhf on 16/1/8.
 */
public class LABSplashFragment extends Fragment {
    private static final String TAG = "LABSplashFragment";

    public interface OnHideListener {
        void onHideSplash();
    }

    public static LABSplashFragment newInstance(QDPage qdPage, GGPage ggPage) {
        LABSplashFragment frag = new LABSplashFragment();
        frag.qdPage = qdPage;
        return frag;
    }

    protected QDPage qdPage;
    private long showStartTime;
    private OnHideListener mOnHideListener;

    private Runnable hideQDRunnable = new Runnable() {
        @Override
        public void run() {
            if (mOnHideListener != null) {
                mOnHideListener.onHideSplash();
            }
        }
    };

    public void setOnHideListener(OnHideListener onHideListener) {
        this.mOnHideListener = onHideListener;
    }

    public void hide(boolean checkDuration) {
        UiThreadHelper.removeUiHandlerCallbacks(hideQDRunnable);
        if (checkDuration && qdPage != null) {
            long dt = SystemClock.elapsedRealtime() - showStartTime;
            long remainTime = qdPage.minQdDuration - dt;
            if (remainTime > 0) {
                UiThreadHelper.postDelayedOnUiThread(hideQDRunnable, remainTime);
            } else {
                hideQDRunnable.run();
            }
        } else {
            hideQDRunnable.run();
        }
    }

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        showStartTime = SystemClock.elapsedRealtime();
        onStartTimer();
    }

    @Nullable
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        if (qdPage != null) {
            if (qdPage.imgUri == null) {
                ImageView imageView = new ImageView(getActivity());
                imageView.setScaleType(ImageView.ScaleType.CENTER_CROP);
                imageView.setLayoutParams(new ViewGroup.LayoutParams(-1, -1));
                imageView.setImageResource(qdPage.imgResId);
                return imageView;
            } else {
                SimpleDraweeView simpleDraweeView = new SimpleDraweeView(getActivity());
                GenericDraweeHierarchy hierarchy = simpleDraweeView.getHierarchy();
                hierarchy.setActualImageScaleType(ScalingUtils.ScaleType.CENTER_CROP);
                DraweeController controller = Fresco.newDraweeControllerBuilder()
                        .setOldController(simpleDraweeView.getController())
                        .setImageRequest(ImageRequestBuilder.newBuilderWithSource(qdPage.imgUri)
                                .disableDiskCache().build())
                        .build();

                simpleDraweeView.setController(controller);
                return simpleDraweeView;
            }
        }
        return null;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        UiThreadHelper.removeUiHandlerCallbacks(hideQDRunnable);
    }

    protected void onStartTimer() {
        UiThreadHelper.postDelayedOnUiThread(hideQDRunnable, qdPage != null ? qdPage.defQdDuration : 2500);
    }

}
