package com.lightappbuilder.lab4.test;

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
import com.facebook.react.modules.fresco.FrescoModule;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.react.uimanager.ViewManager;
import com.facebook.soloader.SoLoader;
import com.imagepicker.ImagePickerPackage;
import com.lightappbuilder.lab4.lablibrary.LABApplication;
import com.lightappbuilder.lab4.lablibrary.LABPackage;
import com.lightappbuilder.lab4.lablibrary.startpagemgr.QDPage;
import com.lightappbuilder.lab4.lablibrary.startpagemgr.StartPageManager;
import com.lightappbuilder.lab4.lablibrary.utils.DisplayUtils;
import com.lightappbuilder.lab4.lablibrary.utils.L;
import com.lightappbuilder.lab4.lablogger.LABLoggerPackage;
import com.lightappbuilder.lab4.labmap.LABMapPackage;
import com.lightappbuilder.lab4.labmap.LABMapViewManager;
import com.lightappbuilder.lab4.labmap.dynamicmap.LABDynamicMapView;
import com.lightappbuilder.lab4.labpay.LABPayPackage;
import com.lightappbuilder.lab4.labpush.LABPushPackage;
import com.lightappbuilder.lab4.labsocial.LABSocialPackage;
import com.lightappbuilder.lab4.labvideo.LABVideoModule;
import com.lwansbrough.RCTCamera.RCTCameraPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.tencent.bugly.Bugly;
import com.tencent.bugly.crashreport.CrashReport;
import com.umeng.analytics.MobclickAgent;
import com.umeng.socialize.PlatformConfig;

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
        Log.i(TAG, "attachBaseContext:  MultiDex.install time " + (SystemClock.elapsedRealtime() - start));
    }

    @Override
    public void onCreate() {
//        Thread.setDefaultUncaughtExceptionHandler(new Thread.UncaughtExceptionHandler() {
//            @Override
//            public void uncaughtException(Thread t, Throwable e) {
//                Log.e(TAG, "uncaughtException: ", e);
//            }
//        });
        MobclickAgent.setCatchUncaughtExceptions(false);
        Bugly.init(this, BuildConfig.BUGLY_ID, false /*BuildConfig.DEBUG*/);
        SDKInitializer.initialize(this);
        super.onCreate();
        L.setCrashReportHandler(new L.CrashReportHandler() {
            @Override
            public void postException(Throwable e) {
                CrashReport.postCatchedException(e);
            }
        });
        SoLoader.init(this, /* native exopackage */ false);

        com.umeng.socialize.Config.DEBUG = BuildConfig.DEBUG;
        // 下面是绿农的配置 测试时需要将包名改成com.backustech.apps.lvnong
        PlatformConfig.setQQZone("1105768460", "xDzHCEbkYbCXXBN4");
        PlatformConfig.setWeixin("wx44df5f68f4fbc196", "97e35bbda38bd1fd7785988b37789f26");
        //豆瓣RENREN平台目前只能在服务器端配置
        PlatformConfig.setSinaWeibo("3921700954", "04b48b094faeb16683c32669824ebdad","");

//        LABPushModule.init(this);
//        JPushInterface.setLatestNotificationNumber(this, 3);
//        BasicPushNotificationBuilder basicPushNotificationBuilder = new BasicPushNotificationBuilder(this);
//        basicPushNotificationBuilder.notificationDefaults = 0;
//        JPushInterface.setDefaultPushNotificationBuilder(basicPushNotificationBuilder);
    }

    @Override
    protected void mainProcessOnCreate() {
        super.mainProcessOnCreate();

        FrescoModule.init(this, null);
        //环信初始化
//        LABIMHelper.getInstance().init(this);
//        EMImageLoadHelper.init(getApplicationContext());//用于加头信息请求图片
//        UserInfoProvider infoProvider = new DefaultUserInfoProvider(getApplicationContext());
//        NimUIKit.init(this,infoProvider);
//        EMOptions options=new EMOptions();
//        options.setAutoLogin(true);
//        options.setAcceptInvitationAlways(false);
//        options.setRequireAck(true);
//        options.setRequireDeliveryAck(false);
//        EMClient.getInstance().init(this,options);


        QDPage qdPage = new QDPage();
        qdPage.imgResId = R.drawable.splash;
        qdPage.defQdDuration = 1200;
        qdPage.disableUpdate = false;
        qdPage.code = 0;
        StartPageManager.setupQDPage(qdPage);
        //StartPageManager.checkUpdateUrl = "http://top.hz.backustech.com/Content/Index/getCover";
//        YDPage ydPage = new YDPage();
//        ydPage.imgResIds = new int[] {R.drawable.ic_launcher, R.drawable.ic_launcher};
//        StartPageManager.setupYDPage(ydPage);

        LABMapViewManager.setViewMarkerOptionsProvider(new MyViewMarkerOptionsProvider(this));
        LABDynamicMapView.setLayerMarkerOptionsProvider(new MyLayerMarkerOptionsProvider(this));

//        Log.i(TAG, "mainProcessOnCreate: density=" + DisplayUtils.getDisplayMetrics().density);
    }

    @Override
    protected boolean isDebug() {
        return BuildConfig.DEBUG;
    }

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

        @Override
        public boolean getUseDeveloperSupport() {
//        return false;
            return BuildConfig.DEBUG;
        }

        @Override
        protected String getJSMainModuleName() {
            return "demo/index";
        }

        @Override
        protected List<ReactPackage> getPackages() {
//            List<NativeModule> nativeModules = super.createNativeModules(reactContext);
//            NativeModule nativeModule;
//            for(int i = 0; i < nativeModules.size(); ++i) {
//                nativeModule = nativeModules.get(i);
//                if(nativeModule instanceof NetworkingModule) {
//                    //TODO 对网络模块对增强
//                    break;
//                }
//            }
//            return nativeModules;
            L.i(TAG, "ReactNativeHost getPackages");
            //SystemClock.sleep(3000);
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
                    new LABPackage(),
                    new ReactPackage() {
                        @Override
                        public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
                            return Arrays.<NativeModule>asList(new LABVideoModule(reactContext));
                        }

                        @Override
                        public List<Class<? extends JavaScriptModule>> createJSModules() {
                            return Collections.emptyList();
                        }

                        @Override
                        public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
                            return Arrays.<ViewManager>asList(new LABTestViewManager());
                        }
                    },
                    new LABPushPackage(),
                    new LABMapPackage(),
                    new RCTCameraPackage(),
                    new VectorIconsPackage(),
                    //new LABIMPackage(),
                    new LABPayPackage(),
                    new LABSocialPackage(),
//                    new LABAudioPackage(),
                    new ImagePickerPackage(),
                    new LABLoggerPackage()
            );
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

}
