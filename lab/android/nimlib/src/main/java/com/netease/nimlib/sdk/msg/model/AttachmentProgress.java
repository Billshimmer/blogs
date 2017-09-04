package com.netease.nimlib.sdk.msg.model;

import java.io.Serializable;

/**
 * Created by dansejijie on 17/4/4.
 */

public class AttachmentProgress implements Serializable {
    private final String uuid;
    private final long transferred;
    private final long total;

    public AttachmentProgress(String var1, long var2, long var4) {
        this.uuid = var1;
        this.transferred = var2;
        this.total = var4;
    }

    public String getUuid() {
        return this.uuid;
    }

    public long getTransferred() {
        return this.transferred;
    }

    public long getTotal() {
        return this.total;
    }
}

