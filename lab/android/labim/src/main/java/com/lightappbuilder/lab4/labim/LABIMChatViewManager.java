package com.lightappbuilder.lab4.labim;

import android.app.Activity;
import android.content.Intent;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.Map;

/**
 * Created by vice on 2016/7/22.
 */
public class LABIMChatViewManager extends ViewGroupManager<ChatView> {
    private static final String TAG = LABIMChatViewManager.class.getSimpleName();
    public static final String REACT_CLASS = "LABIMChatView";

    private ReactApplicationContext reactApplicationContext;

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    public LABIMChatViewManager(ReactApplicationContext reactApplicationContext) {
        this.reactApplicationContext = reactApplicationContext;
    }

    @Override
    protected ChatView createViewInstance(ThemedReactContext reactContext) {
        return new ChatView(reactContext, reactApplicationContext);
    }

    @Override
    public boolean needsCustomLayoutForChildren() {
        return true;
    }

    @ReactProp(name = "options")
    public void setOptions(ChatView view, ReadableMap options) {
        view.setOptions(options);
    }

    @Override
    public
    @javax.annotation.Nullable
    Map getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.builder()
                .put("onAvatarClick", MapBuilder.of("registrationName", "onAvatarClick"))
                .build();
    }

    @Override
    public void onDropViewInstance(ChatView view) {
        super.onDropViewInstance(view);
        view.onDropViewInstance();
    }
}
