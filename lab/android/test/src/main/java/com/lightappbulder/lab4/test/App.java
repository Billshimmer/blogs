package com.lightappbulder.lab4.test;

import android.content.Context;
import android.os.SystemClock;
import android.support.multidex.MultiDex;
import android.util.Log;

import com.baidu.mapapi.SDKInitializer;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.JavaScriptModule;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.react.uimanager.ViewManager;

import com.lightappbuilder.lab4.labim.IMOptions;
import com.lightappbuilder.lab4.labim.IMOptionsBuilder;
import com.lightappbuilder.lab4.labim.LABIMHelper;
import com.lightappbuilder.lab4.labim.LABIMPackage;
import com.lightappbuilder.lab4.labim.nim.NIMApplication;
import com.lightappbuilder.lab4.lablibrary.LABApplication;
import com.lightappbuilder.lab4.lablibrary.LABPackage;
import com.lightappbuilder.lab4.lablibrary.utils.L;
import com.lightappbuilder.lab4.lablogger.LABLoggerPackage;
import com.lightappbuilder.lab4.labmap.LABMapPackage;
import com.lwansbrough.RCTCamera.RCTCameraPackage;
import com.oblador.vectoricons.VectorIconsPackage;
//import com.tencent.bugly.Bugly;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 * Created by yinhf on 16/3/28.
 */
public class App extends LABApplication {
    private static final String TAG = "App";

    @Override
    protected void attachBaseContext(Context base) {
        super.attachBaseContext(base);
        long start = SystemClock.elapsedRealtime();
        MultiDex.install(this);
        SDKInitializer.initialize(this);
        Log.i(TAG, "attachBaseContext:  MultiDex.install time " + (SystemClock.elapsedRealtime() - start));
    }

    @Override
    public void onCreate() {
        //Bugly.init(this, "900046114", false);
        super.onCreate();
    }

    @Override
    protected void mainProcessOnCreate() {
        super.mainProcessOnCreate();

        NIMApplication.init(this);
        IMOptionsBuilder builder = new IMOptionsBuilder(this);
        IMOptions options = builder.setEaseNotificationInfoProvider(null).build();
        LABIMHelper.getInstance().init(this, options);
    }


    @Override
    protected boolean isDebug() {
        return BuildConfig.DEBUG;
    }

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected String getJSMainModuleName() {
            return "demo/index";
        }

        @Override
        protected List<ReactPackage> getPackages() {

            L.i(TAG, "ReactNativeHost getPackages");

            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
                    new LABPackage(),
                    new ReactPackage() {
                        @Override
                        public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
                            return Collections.emptyList();
                        }

                        @Override
                        public List<Class<? extends JavaScriptModule>> createJSModules() {
                            return Collections.emptyList();
                        }

                        @Override
                        public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
                            return Collections.emptyList();
                        }
                    },
                    new RCTCameraPackage(),
                    new VectorIconsPackage(),
                    new LABIMPackage(),
                    new LABLoggerPackage(),
                    new LABMapPackage()


            );
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

}
