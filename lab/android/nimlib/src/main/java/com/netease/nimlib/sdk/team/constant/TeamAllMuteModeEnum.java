package com.netease.nimlib.sdk.team.constant;

/**
 * Created by dansejijie on 17/4/15.
 */

public enum TeamAllMuteModeEnum {
    Cancel(0),
    Mute(1);

    private int value;

    private TeamAllMuteModeEnum(int var3) {
        this.value = var3;
    }

    public static TeamAllMuteModeEnum typeOfValue(int var0) {
        TeamAllMuteModeEnum[] var1;
        int var2 = (var1 = values()).length;

        for(int var3 = 0; var3 < var2; ++var3) {
            TeamAllMuteModeEnum var4;
            if((var4 = var1[var3]).value == var0) {
                return var4;
            }
        }

        return Cancel;
    }

    public final int getValue() {
        return this.value;
    }
}