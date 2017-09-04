package com.netease.nim.uikit.system;

/**
 * Created by tygzx on 17/1/4.
 */

public interface RequestCallback<T> {
    void onSuccess(T var1);

    void onFailed(int var1);

    void onException(Throwable var1);
}