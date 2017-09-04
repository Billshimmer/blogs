package com.netease.nimlib.sdk.avchat.constant;

/**
 * Created by dansejijie on 17/4/15.
 */

public enum AVChatRecordState {
    Success(0),
    Missed(1),
    Rejected(2),
    Canceled(3);

    private int value;

    private AVChatRecordState(int var3) {
        this.value = var3;
    }

    public final int getValue() {
        return this.value;
    }

    public static AVChatRecordState stateOfValue(int var0) {
        AVChatRecordState[] var1;
        int var2 = (var1 = values()).length;

        for(int var3 = 0; var3 < var2; ++var3) {
            AVChatRecordState var4;
            if((var4 = var1[var3]).getValue() == var0) {
                return var4;
            }
        }

        return Success;
    }
}
