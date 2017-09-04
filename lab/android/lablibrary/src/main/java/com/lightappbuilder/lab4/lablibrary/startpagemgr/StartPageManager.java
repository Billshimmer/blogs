package com.lightappbuilder.lab4.lablibrary.startpagemgr;

import android.app.Activity;
import android.content.Context;
import android.content.SharedPreferences;
import android.preference.PreferenceManager;
import android.util.Log;

import com.lightappbuilder.lab4.lablibrary.utils.L;
import com.lightappbuilder.lab4.lablibrary.utils.UiThreadHelper;

import org.apache.commons.io.FileUtils;

import java.io.File;
import java.io.FileFilter;

/**
 * Created by yinhf on 16/1/8.
 */
public class StartPageManager {
    private static final String TAG = "StartPageManager";

    static final String LAB_START_PAGE_FILE = "lab_start_page";
    static final String TYPE_QD = "qd";
    static final String TYPE_GG = "gg";
    static final String TYPE_YD = "yd";
    static final String DOWNLOAD_PACKAGE_NAME = ".__";
    static final String CONFIG_FILE_NAME = "config";

    static final String PREF_KEY_GG = "LAB_PREF_KEY_GG";
    static final String PREF_KEY_YD = "LAB_PREF_KEY_YD";

    static final int MIN_LOADING_DURATION = 2000;
    static final int MAX_LOADING_DURATION = 3000;

    private static File labStartPageFile;

    private static QDPage sInitQDPage;
    private static GGPage sInitGGPage;
    private static YDPage sInitYDPage;

    public static String checkUpdateUrl;

    private static FileFilter packageFilter = new FileFilter() {
        @Override
        public boolean accept(File file) {
            return file.isDirectory() && !DOWNLOAD_PACKAGE_NAME.equals(file.getName());
        }
    };

    private static StartPageManagerCallback sStartPageManagerCallback;
    public static final StartPageManagerCallback DEFAULT_CALLBACK = new StartPageManagerCallback() {
        @Override
        public LABSplashFragment onNewSplashFragment(QDPage qdPage) {
            return LABSplashFragment.newInstance(qdPage, null);
        }

        @Override
        public LABGuideFragment onNewGuideFragment(YDPage ydPage) {
            return LABGuideFragment.newInstance(ydPage);
        }
    };

    private static File getLABStartPageFile(Context context) {
        if (labStartPageFile == null) {
            labStartPageFile = new File(context.getFilesDir(), LAB_START_PAGE_FILE);
        }
        return labStartPageFile;
    }

    static File getDownloadFile(Context context, String type) {
        return new File(getLABStartPageFile(context), type + "/" + DOWNLOAD_PACKAGE_NAME);
    }

    public static void setupQDPage(QDPage initQDPage) {
        sInitQDPage = initQDPage;
    }

    public static void setupGGPage(GGPage initGGPage) {
        sInitGGPage = initGGPage;
    }

    public static void setupYDPage(YDPage initYDPage) {
        sInitYDPage = initYDPage;
    }

    public static void setStartPageManagerCallback(StartPageManagerCallback callback) {
        sStartPageManagerCallback = callback;
    }

    public static StartPageManagerCallback getsStartPageManagerCallback() {
        return sStartPageManagerCallback;
    }

    public static void showStartPage(final Activity context) {
        L.time("showStartPage prepare");
        final QDPage qdPage = getNewPage(context, sInitQDPage, TYPE_QD);
        final GGPage ggPage = getNewPage(context, sInitGGPage, TYPE_GG);
        final YDPage ydPage = getNewPage(context, sInitYDPage, TYPE_YD);

        if (qdPage == null && ggPage == null && ydPage == null) {
            Log.w(TAG, "showStartPage: qdPage == null && ggPage == null && ydPage == null");
            return;
        }
        boolean showGG = false;
        boolean showYD = false;
        SharedPreferences sp = PreferenceManager.getDefaultSharedPreferences(context);
        long currentTime = System.currentTimeMillis();
        if (ggPage != null && !ggPage.disable) {
            if (ggPage.interval > 0) {
                ggPage.loadPref(sp);
                showGG = currentTime - ggPage.lastShowTime > ggPage.interval;
                if (showGG) {
                    ggPage.savePref(sp, currentTime);
                }
            } else {
                showGG = true;
            }
        }
        if (ydPage != null) {
            ydPage.loadPref(sp);
            showYD = (ydPage.showCount < ydPage.times) && (ydPage.interval == 0 || currentTime - ydPage.lastShowTime > ydPage.interval);
            if (showYD) {
                ydPage.savePref(sp, currentTime, ydPage.showCount + 1);
            }
        }
        L.timeEnd("showStartPage prepare");
        toStartPage(context, qdPage, showGG ? ggPage : null, showYD ? ydPage : null);
        if (checkUpdateUrl != null) {
            UiThreadHelper.postDelayedOnUiThread(new Runnable() {
                @Override
                public void run() {
                    checkUpdate(context, qdPage, ggPage, ydPage);
                }
            }, 5000);
        }
    }

    private static <T extends BasePage> T getNewPage(Context context, BasePage page, String type) {
        if (page != null && !page.disableUpdate) {
            File file = getNewPackage(new File(getLABStartPageFile(context), type), page.code);
            if (file != null) {
                try {
                    if (TYPE_QD.equals(type)) {
                        return (T) new QDPage(file);
                    } else if (TYPE_GG.equals(type)) {
                        return (T) new GGPage(file);
                    } else if (TYPE_YD.equals(type)) {
                        return (T) new YDPage(file);
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                    FileUtils.deleteQuietly(file);
                }
            }
        }
        return (T) page;
    }

    private static File getNewPackage(File pageFile, int maxCode) {
        if (!pageFile.isDirectory()) {
            return null;
        }
        File[] packageFiles = pageFile.listFiles(packageFilter);
        if (packageFiles == null) {
            return null;
        }
        int code;
        File lastFile = null;
        for (File packageFile : packageFiles) {
            try {
                String name = packageFile.getName();
                int temp = name.indexOf('_');
                if (temp < 0) {
                    temp = 0;
                }
                code = Integer.parseInt(name.substring(temp + 1));
            } catch (Exception e) {
                FileUtils.deleteQuietly(packageFile);
                continue;
            }
            if (code <= maxCode) {
                FileUtils.deleteQuietly(packageFile);
                continue;
            }
            lastFile = packageFile;
            maxCode = code;
        }
        return lastFile;
    }

    private static void toStartPage(Activity context, QDPage qdPage, GGPage ggPage, YDPage ydPage) {
        if (qdPage == null && ggPage == null && ydPage == null) {
            return;
        }
        LABStartActivity.start(context, qdPage, ggPage, ydPage);
    }

    private static void checkUpdate(Context context, QDPage qdPage, GGPage ggPage, YDPage ydPage) {
        LABStartPageUpdateService.startUpdate(context, qdPage, ggPage, ydPage);
    }
}
