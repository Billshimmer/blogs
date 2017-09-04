package com.netease.nimlib.sdk.uinfo.constant;

/**
 * Created by dansejijie on 17/4/15.
 */

public enum GenderEnum {
    UNKNOWN(0),
    MALE(1),
    FEMALE(2);

    private Integer value;

    private GenderEnum(int var3) {
        this.value = Integer.valueOf(var3);
    }

    public static GenderEnum genderOfValue(int var0) {
        GenderEnum[] var1;
        int var2 = (var1 = values()).length;

        for(int var3 = 0; var3 < var2; ++var3) {
            GenderEnum var4;
            if((var4 = var1[var3]).getValue().intValue() == var0) {
                return var4;
            }
        }

        return UNKNOWN;
    }

    public final Integer getValue() {
        return this.value;
    }
}
