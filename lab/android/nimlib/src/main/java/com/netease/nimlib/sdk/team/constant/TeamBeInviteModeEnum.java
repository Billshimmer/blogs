package com.netease.nimlib.sdk.team.constant;

/**
 * Created by dansejijie on 17/4/15.
 */

public enum TeamBeInviteModeEnum {
    NeedAuth(0),
    NoAuth(1);

    private int value;

    private TeamBeInviteModeEnum(int var3) {
        this.value = var3;
    }

    public static TeamBeInviteModeEnum typeOfValue(int var0) {
        TeamBeInviteModeEnum[] var1;
        int var2 = (var1 = values()).length;

        for(int var3 = 0; var3 < var2; ++var3) {
            TeamBeInviteModeEnum var4;
            if((var4 = var1[var3]).value == var0) {
                return var4;
            }
        }

        return NeedAuth;
    }

    public final int getValue() {
        return this.value;
    }
}