package com.netease.nimlib.sdk;

/**
 * Created by dansejijie on 17/4/15.
 */

public enum StatusCode {
    INVALID(0),
    UNLOGIN(1),
    NET_BROKEN(2),
    CONNECTING(3),
    LOGINING(4),
    SYNCING(5),
    LOGINED(6),
    KICKOUT(7),
    KICK_BY_OTHER_CLIENT(8),
    FORBIDDEN(9),
    VER_ERROR(10),
    PWD_ERROR(11);

    private int value;

    public final boolean wontAutoLogin() {
        return this == KICKOUT || this == KICK_BY_OTHER_CLIENT || this == FORBIDDEN || this == PWD_ERROR;
    }

    public final boolean shouldReLogin() {
        return this == UNLOGIN || this == NET_BROKEN;
    }

    private StatusCode(int var3) {
        this.value = var3;
    }

    public final int getValue() {
        return this.value;
    }

    public static StatusCode typeOfValue(int var0) {
        StatusCode[] var1;
        int var2 = (var1 = values()).length;

        for(int var3 = 0; var3 < var2; ++var3) {
            StatusCode var4;
            if((var4 = var1[var3]).getValue() == var0) {
                return var4;
            }
        }

        return INVALID;
    }

    public static StatusCode statusOfResCode(int var0) {
        switch(var0) {
            case 200:
                return LOGINED;
            case 302:
            case 404:
            case 414:
                return PWD_ERROR;
            case 317:
                return VER_ERROR;
            case 403:
            case 422:
                return FORBIDDEN;
            case 417:
                return KICKOUT;
            case 431:
                return UNLOGIN;
            default:
                return UNLOGIN;
        }
    }
}