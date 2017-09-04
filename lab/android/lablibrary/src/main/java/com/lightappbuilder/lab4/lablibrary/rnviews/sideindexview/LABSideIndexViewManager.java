package com.lightappbuilder.lab4.lablibrary.rnviews.sideindexview;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.events.RCTEventEmitter;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.annotation.Nullable;

/**
 * Created by tygzx on 17/1/12.
 */

public class LABSideIndexViewManager extends SimpleViewManager<SideIndexView> {

    @Override
    public String getName() {
        return "LABSideIndexView";
    }

    @Override
    protected SideIndexView createViewInstance(final ThemedReactContext reactContext) {
        final SideIndexView sideIndexView = new SideIndexView(reactContext);
        sideIndexView.setOnTouchLetterChangeListener(new SideIndexView.OnTouchLetterChangeListener() {
            @Override
            public void onLetterChange(String letter, int position) {

                WritableMap writableMap = Arguments.createMap();
                writableMap.putString("letter", letter);
                writableMap.putInt("position", position);
                reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(sideIndexView.getId(), "onLetterChange", writableMap);

            }
        });

        return sideIndexView;
    }

    @Nullable
    @Override
    public Map getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.builder().put("onLetterChange", MapBuilder.of("registrationName", "onLetterChange")).build();
    }

    @ReactProp(name = "options")
    public void setOptions(SideIndexView sideIndexView, ReadableMap options) {
        if (options.hasKey("letters")) {
            ReadableArray readableArray = options.getArray("letters");
            List<String> temp = new ArrayList<>();
            for (int i = 0; i < readableArray.size(); i++) {
                temp.add(readableArray.getString(i));
            }
            sideIndexView.setLetters(temp);
        }
    }

}
