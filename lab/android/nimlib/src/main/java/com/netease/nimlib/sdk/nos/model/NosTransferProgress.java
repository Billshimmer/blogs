package com.netease.nimlib.sdk.nos.model;

import java.io.Serializable;

/**
 * Created by dansejijie on 17/4/15.
 */

public class NosTransferProgress implements Serializable {
    private final String key;
    private final long transferred;
    private final long total;

    public NosTransferProgress(String var1, long var2, long var4) {
        this.key = var1;
        this.transferred = var2;
        this.total = var4;
    }

    public String getKey() {
        return this.key;
    }

    public long getTransferred() {
        return this.transferred;
    }

    public long getTotal() {
        return this.total;
    }
}