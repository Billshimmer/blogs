package com.netease.nimlib.sdk;

import java.io.Serializable;

/**
 * Created by dansejijie on 17/4/4.
 */

public interface Observer<T> extends Serializable {
    void onEvent(T var1);
}
