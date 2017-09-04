package com.lightappbuilder.lab4.labmap;

import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.RCTEventEmitter;

/**
 * Created by yinhf on 16/7/19.
 */
public class AnnotationEvent extends Event {

    private String eventName;
    private WritableMap map;

    public AnnotationEvent(int viewTag, String eventName, WritableMap map) {
        super(viewTag);
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