package com.lightappbuilder.lab4.lablibrary.rnviews.photobrowser;

import android.view.View;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.Map;

import javax.annotation.Nullable;

/**
 * Created by yinhf on 2017/1/4.
 */

public class PhotoBrowserViewManager extends SimpleViewManager {
    private static final String TAG = "PhotoBrowserViewManager";

    @Override
    public String getName() {
        return "LABPhotoBrowser";
    }

    @Override
    protected View createViewInstance(ThemedReactContext reactContext) {
        return new PhotoBrowserView(reactContext);
    }

    @ReactProp(name = "options")
    public void setOptions(PhotoBrowserView view, ReadableMap options) {
        view.setOptions(options);
    }

    @Override
    public @Nullable
    Map getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.builder()
                .put("onPhotoTap", MapBuilder.of("registrationName", "onPhotoTap"))
                .put("onPhotoSelected", MapBuilder.of("registrationName", "onPhotoSelected"))
                .build();
    }
}
