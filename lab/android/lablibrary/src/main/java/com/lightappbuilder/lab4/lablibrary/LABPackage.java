package com.lightappbuilder.lab4.lablibrary;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.JavaScriptModule;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.lightappbuilder.lab4.lablibrary.rnmodules.CookieManagerModule;
import com.lightappbuilder.lab4.lablibrary.rnmodules.notification.LABNotificationModule;
import com.lightappbuilder.lab4.lablibrary.rnviews.photobrowser.PhotoBrowserViewManager;
import com.lightappbuilder.lab4.lablibrary.rnviews.richtext.LABRichTextViewManager;
import com.lightappbuilder.lab4.lablibrary.rnviews.scrollview.LABScrollViewManager;
import com.lightappbuilder.lab4.lablibrary.rnviews.sideindexview.LABSideIndexViewManager;
import com.lightappbuilder.lab4.lablibrary.rnviews.webview.ReactWebViewManager;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 * Created by yinhf on 16/6/24.
 */
public class LABPackage implements ReactPackage {
    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        return Arrays.<NativeModule>asList(
            new CookieManagerModule(reactContext),
            new LABNotificationModule(reactContext)
        );
    }

    @Override
    public List<Class<? extends JavaScriptModule>> createJSModules() {
        return Collections.emptyList();
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Arrays.<ViewManager>asList(
                new ReactWebViewManager(),
                new LABRichTextViewManager(reactContext),
                new PhotoBrowserViewManager(),
                new LABSideIndexViewManager(),
                new LABScrollViewManager());
    }
}
