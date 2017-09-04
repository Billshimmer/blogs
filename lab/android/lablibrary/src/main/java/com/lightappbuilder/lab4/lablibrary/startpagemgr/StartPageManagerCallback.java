package com.lightappbuilder.lab4.lablibrary.startpagemgr;

/**
 * Created by yinhf on 2016/11/9.
 */

public interface StartPageManagerCallback {

    LABSplashFragment onNewSplashFragment(QDPage qdPage);

    LABGuideFragment onNewGuideFragment(YDPage ydPage);
}
