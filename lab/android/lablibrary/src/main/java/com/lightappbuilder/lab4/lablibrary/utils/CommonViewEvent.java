package com.lightappbuilder.lab4.lablibrary.utils;

import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.RCTEventEmitter;

/**
 * Created by yinhf on 2017/1/5.
 */

public class CommonViewEvent extends Event<CommonViewEvent> {

    private String eventName;
    private WritableMap map;

    public CommonViewEvent(int viewId, String eventName, WritableMap map) {
        super(viewId);
        this.eventName = eventName;
        this.map = map;
    }

    @Override
    public String getEventName() {
        return eventName;
    }

    @Override
    public void dispatch(RCTEventEmitter rctEventEmitter) {
        rctEventEmitter.receiveEvent(getViewTag(), eventName, map);
    }
}
