package com.netease.nimlib.sdk.friend.constant;

/**
 * Created by dansejijie on 17/4/15.
 */

public enum VerifyType {
    DIRECT_ADD((byte)1),
    VERIFY_REQUEST((byte)2);

    private byte value;

    private VerifyType(byte var3) {
        this.value = var3;
    }

    public static VerifyType verifyTypeOfValue(byte var0) {
        VerifyType[] var1;
        int var2 = (var1 = values()).length;

        for(int var3 = 0; var3 < var2; ++var3) {
            VerifyType var4;
            if((var4 = var1[var3]).getValue() == var0) {
                return var4;
            }
        }

        return null;
    }

    public final byte getValue() {
        return this.value;
    }
}