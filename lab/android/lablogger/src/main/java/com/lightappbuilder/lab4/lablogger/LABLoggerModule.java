package com.lightappbuilder.lab4.lablogger;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.tencent.bugly.crashreport.CrashReport;

public class LABLoggerModule extends ReactContextBaseJavaModule {

    private static final String NAME = "LABLoggerModule";

    @Override
    public String getName() {
        return NAME;
    }

    public LABLoggerModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @ReactMethod
    public void reportError(ReadableMap options) {
        String message = options.getString("message");
        boolean isFatal = options.getBoolean("isFatal");
        String stack = options.getString("stack");
        CrashReport.postCatchedException(new LABLoggerException(message + ", isFatal: " + isFatal + ", stack:\n" + stack));
    }
}
