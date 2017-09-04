package com.netease.nimlib.sdk;

/**
 * Created by dansejijie on 17/4/9.
 */
import com.netease.nimlib.sdk.RequestCallback;

public abstract class RequestCallbackWrapper<T> implements RequestCallback<T> {

    public RequestCallbackWrapper() {
    }

    public abstract void onResult(int var1, T var2, Throwable var3);

    public void onSuccess(T var1) {
        this.onResult(200, var1, (Throwable)null);
    }

    public void onFailed(int var1) {
        this.onResult(var1, (T)null, (Throwable)null);
    }

    public void onException(Throwable var1) {
        this.onResult(1000, (T)null, var1);
    }
}