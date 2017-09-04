package com.netease.nimlib.sdk.msg.model;

/**
 * Created by dansejijie on 17/4/4.
 */

public class MessageReceipt {
    private String sessionId;
    private long time;

    public MessageReceipt(String var1, long var2) {
        this.sessionId = var1;
        this.time = var2;
    }

    public String getSessionId() {
        return this.sessionId;
    }

    public long getTime() {
        return this.time;
    }
}