package com.netease.nimlib.sdk.team.constant;

/**
 * Created by dansejijie on 17/4/15.
 */


public enum TeamUpdateModeEnum {
    Manager(0),
    All(1);

    private int value;

    private TeamUpdateModeEnum(int var3) {
        this.value = var3;
    }

    public static TeamUpdateModeEnum typeOfValue(int var0) {
        TeamUpdateModeEnum[] var1;
        int var2 = (var1 = values()).length;

        for(int var3 = 0; var3 < var2; ++var3) {
            TeamUpdateModeEnum var4;
            if((var4 = var1[var3]).value == var0) {
                return var4;
            }
        }

        return Manager;
    }

    public final int getValue() {
        return this.value;
    }
}
