package com.netease.nimlib.sdk.team.constant;

/**
 * Created by dansejijie on 17/4/4.
 */
public enum TeamMemberType {
    Normal(0),
    Owner(1),
    Manager(2),
    Apply(3);

    private int value;

    private TeamMemberType(int var3) {
        this.value = var3;
    }

    public static TeamMemberType typeOfValue(int var0) {
        TeamMemberType[] var1;
        int var2 = (var1 = values()).length;

        for(int var3 = 0; var3 < var2; ++var3) {
            TeamMemberType var4;
            if((var4 = var1[var3]).value == var0) {
                return var4;
            }
        }

        return Normal;
    }

    public final int getValue() {
        return this.value;
    }
}