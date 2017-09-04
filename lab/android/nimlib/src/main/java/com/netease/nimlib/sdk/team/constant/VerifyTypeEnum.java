package com.netease.nimlib.sdk.team.constant;

/**
 * Created by dansejijie on 17/4/15.
 */

public enum VerifyTypeEnum {
    Free(0),
    Apply(1),
    Private(2);

    private int value;

    private VerifyTypeEnum(int var3) {
        this.value = var3;
    }

    public static VerifyTypeEnum typeOfValue(int var0) {
        VerifyTypeEnum[] var1;
        int var2 = (var1 = values()).length;

        for(int var3 = 0; var3 < var2; ++var3) {
            VerifyTypeEnum var4;
            if((var4 = var1[var3]).value == var0) {
                return var4;
            }
        }

        return Apply;
    }

    public final int getValue() {
        return this.value;
    }
}
