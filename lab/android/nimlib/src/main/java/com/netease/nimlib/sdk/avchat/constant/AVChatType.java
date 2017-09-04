package com.netease.nimlib.sdk.avchat.constant;

/**
 * Created by dansejijie on 17/4/15.
 */
public enum AVChatType {
    UNKNOWN(-1),
    AUDIO(1),
    VIDEO(2);

    private int value;

    private AVChatType(int var3) {
        this.value = var3;
    }

    public final int getValue() {
        return this.value;
    }

    public static AVChatType typeOfValue(int var0) {
        AVChatType[] var1;
        int var2 = (var1 = values()).length;

        for(int var3 = 0; var3 < var2; ++var3) {
            AVChatType var4;
            if((var4 = var1[var3]).getValue() == var0) {
                return var4;
            }
        }

        return UNKNOWN;
    }
}