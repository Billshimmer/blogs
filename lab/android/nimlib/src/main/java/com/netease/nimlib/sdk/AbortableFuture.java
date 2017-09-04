package com.netease.nimlib.sdk;

/**
 * Created by dansejijie on 17/4/4.
 */

public interface AbortableFuture<T> extends InvocationFuture {
    boolean abort();
}