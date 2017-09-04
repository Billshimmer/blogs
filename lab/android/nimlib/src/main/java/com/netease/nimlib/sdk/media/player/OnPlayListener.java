package com.netease.nimlib.sdk.media.player;

/**
 * Created by dansejijie on 17/4/4.
 */
public interface OnPlayListener {
    void onPrepared();

    void onCompletion();

    void onInterrupt();

    void onError(String var1);

    void onPlaying(long var1);
}