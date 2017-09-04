package com.netease.nimlib.sdk;

/**
 * Created by dansejijie on 17/4/4.
 */

public interface RequestCallback<T> {
    void onSuccess(T var1);

    void onFailed(int var1);

    void onException(Throwable var1);
}
