package com.netease.nimlib.sdk;

/**
 * Created by dansejijie on 17/4/4.
 */

public interface InvocationFuture<T> {
    void setCallback(RequestCallback<T> var1);
}