package com.lightappbuilder.lab4.labmap;

import android.view.View;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.UIManagerModule;

/**
 * Created by yinhf on 16/7/19.
 */
public class AnnotationEventHelper {

    public static void emitPress(ReactContext reactContext, View view, String annId) {
        WritableMap map = Arguments.createMap();
        map.putString("annotationId", annId);
        reactContext.getNativeModule(UIManagerModule.class).getEventDispatcher()
                .dispatchEvent(new AnnotationEvent(view.getId(), "onAnnotationPress", map));
    }

    public static void emitPress(ReactContext reactContext, View view, WritableMap map) {
        reactContext.getNativeModule(UIManagerModule.class).getEventDispatcher()
                .dispatchEvent(new AnnotationEvent(view.getId(), "onAnnotationPress", map));
    }
}
