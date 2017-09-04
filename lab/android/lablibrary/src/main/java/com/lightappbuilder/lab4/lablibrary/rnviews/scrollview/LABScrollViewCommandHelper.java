package com.lightappbuilder.lab4.lablibrary.rnviews.scrollview;

import com.facebook.infer.annotation.Assertions;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.PixelUtil;

import java.util.Map;

import javax.annotation.Nullable;

/**
 * Created by tygzx on 17/1/20.
 */

public class LABScrollViewCommandHelper {

    public static final int COMMAND_SCROLL_TO = 1;

    public interface ScrollCommandHandler<T> {
        void scrollTo(T scrollView, ScrollToCommandData data);
    }

    public static class ScrollToCommandData {

        public final int mDestX, mDestY;
        public final boolean mAnimated;

        ScrollToCommandData(int destX, int destY, boolean animated) {
            mDestX = destX;
            mDestY = destY;
            mAnimated = animated;
        }
    }

    public static Map<String,Integer> getCommandsMap() {
        return MapBuilder.of(
                "scrollTo",
                COMMAND_SCROLL_TO);
    }

    public static <T> void receiveCommand(
            ScrollCommandHandler<T> viewManager,
            T scrollView,
            int commandType,
            @Nullable ReadableArray args) {
        Assertions.assertNotNull(viewManager);
        Assertions.assertNotNull(scrollView);
        Assertions.assertNotNull(args);
        switch (commandType) {
            case COMMAND_SCROLL_TO: {
                int destX = Math.round(PixelUtil.toPixelFromDIP(args.getDouble(0)));
                int destY = Math.round(PixelUtil.toPixelFromDIP(args.getDouble(1)));
                boolean animated = args.getBoolean(2);
                viewManager.scrollTo(scrollView, new ScrollToCommandData(destX, destY, animated));
                return;
            }
            default:
                throw new IllegalArgumentException(String.format(
                        "Unsupported command %d received by %s.",
                        commandType,
                        viewManager.getClass().getSimpleName()));
        }
    }
}
