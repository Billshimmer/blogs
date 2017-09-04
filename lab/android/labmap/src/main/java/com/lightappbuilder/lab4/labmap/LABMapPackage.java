package com.lightappbuilder.lab4.labmap;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.JavaScriptModule;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.lightappbuilder.lab4.labmap.dynamicmap.LABDynamicMapViewManager;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 * Created by yinhf on 16/6/30.
 */
public class LABMapPackage implements ReactPackage {
    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        return Arrays.<NativeModule>asList(
                new LABLocationModule(reactContext),
                new LABNavigationModule(reactContext));
    }

    @Override
    public List<Class<? extends JavaScriptModule>> createJSModules() {
        return Collections.emptyList();
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Arrays.<ViewManager>asList(
                new LABMapViewManager(reactContext),
                // TODO LABDynamicMapViewManager可单独配置
                new LABDynamicMapViewManager(reactContext));
    }
}
