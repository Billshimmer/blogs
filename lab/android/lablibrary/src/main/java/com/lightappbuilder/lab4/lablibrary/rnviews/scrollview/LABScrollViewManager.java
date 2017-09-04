package com.lightappbuilder.lab4.lablibrary.rnviews.scrollview;

import android.graphics.Color;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ReactClippingViewGroupHelper;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.Map;

import javax.annotation.Nullable;

/**
 * Created by tygzx on 17/1/20.
 */

public class LABScrollViewManager extends ViewGroupManager<LABScrollView> implements LABScrollViewCommandHelper.ScrollCommandHandler<LABScrollView>{
    protected static final String LAB_CLASS = "LABScrollView";

    private @Nullable
    FpsListener mFpsListener = null;

    public LABScrollViewManager() {
        this(null);
    }

    public LABScrollViewManager(@Nullable FpsListener fpsListener) {
        mFpsListener = fpsListener;
    }

    @Override
    public String getName() {
        return LAB_CLASS;
    }

    @Override
    public LABScrollView createViewInstance(ThemedReactContext context) {
        return new LABScrollView(context, mFpsListener);
    }

    @ReactProp(name = "scrollEnabled", defaultBoolean = true)
    public void setScrollEnabled(LABScrollView view, boolean value) {
        view.setScrollEnabled(value);
    }

    @ReactProp(name = "showsVerticalScrollIndicator")
    public void setShowsVerticalScrollIndicator(LABScrollView view, boolean value) {
        view.setVerticalScrollBarEnabled(value);
    }

    @ReactProp(name = ReactClippingViewGroupHelper.PROP_REMOVE_CLIPPED_SUBVIEWS)
    public void setRemoveClippedSubviews(LABScrollView view, boolean removeClippedSubviews) {
        view.setRemoveClippedSubviews(removeClippedSubviews);
    }

    /**
     * Computing momentum events is potentially expensive since we post a runnable on the UI thread
     * to see when it is done.  We only do that if {@param sendMomentumEvents} is set to true.  This
     * is handled automatically in js by checking if there is a listener on the momentum events.
     *
     * @param view
     * @param sendMomentumEvents
     */
    @ReactProp(name = "sendMomentumEvents")
    public void setSendMomentumEvents(LABScrollView view, boolean sendMomentumEvents) {
        view.setSendMomentumEvents(sendMomentumEvents);
    }

    /**
     * Tag used for logging scroll performance on this scroll view. Will force momentum events to be
     * turned on (see setSendMomentumEvents).
     *
     * @param view
     * @param scrollPerfTag
     */
    @ReactProp(name = "scrollPerfTag")
    public void setScrollPerfTag(LABScrollView view, String scrollPerfTag) {
        view.setScrollPerfTag(scrollPerfTag);
    }

    /**
     * When set, fills the rest of the scrollview with a color to avoid setting a background and
     * creating unnecessary overdraw.
     * @param view
     * @param color
     */
    @ReactProp(name = "endFillColor", defaultInt = Color.TRANSPARENT, customType = "Color")
    public void setBottomFillColor(LABScrollView view, int color) {
        view.setEndFillColor(color);
    }

    @Override
    public @Nullable
    Map<String, Integer> getCommandsMap() {
        return LABScrollViewCommandHelper.getCommandsMap();
    }

    @Override
    public void receiveCommand(
            LABScrollView scrollView,
            int commandId,
            @Nullable ReadableArray args) {
        LABScrollViewCommandHelper.receiveCommand(this, scrollView, commandId, args);
    }

    @Override
    public void scrollTo(
            LABScrollView scrollView,
            LABScrollViewCommandHelper.ScrollToCommandData data) {
        if (data.mAnimated) {
            scrollView.smoothScrollTo(data.mDestX, data.mDestY);
        } else {
            scrollView.abstractScrollTo(data.mDestX, data.mDestY);
        }
    }

    @Override
    public @Nullable Map getExportedCustomDirectEventTypeConstants() {
        return createExportedCustomDirectEventTypeConstants();
    }

    public static Map createExportedCustomDirectEventTypeConstants() {
        return MapBuilder.builder()
                .put(ScrollEventType.SCROLL.getJSEventName(), MapBuilder.of("registrationName", "onScroll"))
                .put(ScrollEventType.BEGIN_DRAG.getJSEventName(), MapBuilder.of("registrationName", "onScrollBeginDrag"))
                .put(ScrollEventType.END_DRAG.getJSEventName(), MapBuilder.of("registrationName", "onScrollEndDrag"))
                .put(ScrollEventType.ANIMATION_END.getJSEventName(), MapBuilder.of("registrationName", "onScrollAnimationEnd"))
                .put(ScrollEventType.MOMENTUM_BEGIN.getJSEventName(), MapBuilder.of("registrationName", "onMomentumScrollBegin"))
                .put(ScrollEventType.MOMENTUM_END.getJSEventName(), MapBuilder.of("registrationName", "onMomentumScrollEnd"))
                .build();
    }
}
