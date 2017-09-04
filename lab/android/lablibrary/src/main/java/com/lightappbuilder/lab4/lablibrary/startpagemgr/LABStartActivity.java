package com.lightappbuilder.lab4.lablibrary.startpagemgr;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;

import com.lightappbuilder.lab4.lablibrary.R;
import com.lightappbuilder.lab4.lablibrary.utils.L;

/**
 * Created by yinhf on 16/1/8.
 */
public class LABStartActivity extends AppCompatActivity implements LABSplashFragment.OnHideListener, LABGuideFragment.OnHideListener {
    private static final String TAG = "LABStartActivity";

    public static void start(Activity context, QDPage qdPage, GGPage ggPage, YDPage ydPage) {
        LABStartActivity.qdPage = qdPage;
        LABStartActivity.ggPage = ggPage;
        LABStartActivity.ydPage = ydPage;
        Intent intent = new Intent(context, LABStartActivity.class);
        context.overridePendingTransition(0, 0);
        context.startActivity(intent);
    }

    private static QDPage qdPage;
    private static GGPage ggPage;
    private static YDPage ydPage;

    LABSplashFragment labSplashFragment;
    private LABGuideFragment labGuideFragment;
    private boolean isDestroyed;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(null);
        if (savedInstanceState != null) {
            finish();
            return;
        }
        if (qdPage == null && ggPage == null && ydPage == null) {
            L.e(TAG, "onCreate qdPage == null && ggPage == null && ydPage == null");
            finish();
            return;
        }

        StartPageManagerCallback startPageManagerCallback = StartPageManager.getsStartPageManagerCallback();
        if (startPageManagerCallback == null) {
            startPageManagerCallback = StartPageManager.DEFAULT_CALLBACK;
        }
        if (ydPage != null) {
            labGuideFragment = startPageManagerCallback.onNewGuideFragment(ydPage);
            labGuideFragment.setOnHideListener(this);
        }
        if (qdPage != null || ggPage != null) {
            labSplashFragment = startPageManagerCallback.onNewSplashFragment(qdPage);
            labSplashFragment.setOnHideListener(this);
            getSupportFragmentManager().beginTransaction().add(android.R.id.content, labSplashFragment).commit();

        } else {
            getSupportFragmentManager().beginTransaction().add(android.R.id.content, labGuideFragment).commit();
        }

        qdPage = null;
        ggPage = null;
        ydPage = null;
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        isDestroyed = true;
    }

    @Override
    public void onBackPressed() {
        Intent intent = new Intent(Intent.ACTION_MAIN);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        intent.addCategory(Intent.CATEGORY_HOME);
        startActivity(intent);
    }

    @Override
    public void onHideSplash() {
        if (isDestroyed) {
            return;
        }
        if (labGuideFragment != null) {
            try {
                getSupportFragmentManager().beginTransaction()
                        .replace(android.R.id.content, labGuideFragment)
                        .setCustomAnimations(0, R.anim.anim_splash_fragment_hide)
                        .commit();
            } catch (Exception e) {
                e.printStackTrace();
                toMain();
            }
            labSplashFragment = null;
        } else {
            toMain();
        }
    }

    @Override
    public void onHideGuide() {
        if (isDestroyed) {
            return;
        }
        toMain();
    }

    private void toMain() {
        overridePendingTransition(0, android.R.anim.fade_out);
        finish();
    }
}
