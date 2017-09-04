package com.netease.nimlib.sdk.nos.constant;

/**
 * Created by dansejijie on 17/4/15.
 */

public enum NosTransferStatus {
    def(0),
    transferring(1),
    transferred(2),
    fail(3);

    private int value;

    private NosTransferStatus(int var3) {
        this.value = var3;
    }

    public static NosTransferStatus statusOfValue(int var0) {
        NosTransferStatus[] var1;
        int var2 = (var1 = values()).length;

        for(int var3 = 0; var3 < var2; ++var3) {
            NosTransferStatus var4;
            if((var4 = var1[var3]).getValue() == var0) {
                return var4;
            }
        }

        return def;
    }

    public final int getValue() {
        return this.value;
    }
}