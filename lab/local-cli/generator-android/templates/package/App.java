package <%=package%>;

import android.app.Application;
import android.util.Log;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.lightappbuilder.lab4.lablibrary.LABApplication;
import com.lightappbuilder.lab4.lablibrary.LABPackage;
import com.imagepicker.ImagePickerPackage;

import com.tencent.bugly.Bugly;

import java.util.Arrays;
import java.util.List;

public class App extends LABApplication {
    private static final String TAG = "App";

    @Override
    public void onCreate() {
        Bugly.init(this, "xxxx", false);
        super.onCreate();

        // PlatformConfig.setWeixin("xxxx", "xxxx");
        // PlatformConfig.setQQZone("xxxx", "xxxx");
        // PlatformConfig.setSinaWeibo("xxxx", "xxxx");
    }

    // @Override
    // protected void attachBaseContext(Context base) {
    //     super.attachBaseContext(base);
    //     long start = SystemClock.elapsedRealtime();
    //     MultiDex.install(this);
    //     Log.i(TAG, "attachBaseContext:  MultiDex.install time " + (SystemClock.elapsedRealtime() - start));
    // }

    @Override
    protected void mainProcessOnCreate() {
        super.mainProcessOnCreate();
    }

    @Override
    protected boolean isDebug() {
        return BuildConfig.DEBUG;
    }

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        protected boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected String getJSMainModuleName() {
            return "<%= entryFile %>";
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
                    new LABPackage(),
                    new ImagePickerPackage()
            );
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }
}
