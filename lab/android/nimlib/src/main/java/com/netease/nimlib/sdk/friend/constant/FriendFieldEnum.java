package com.netease.nimlib.sdk.friend.constant;

import java.util.Map;

/**
 * Created by dansejijie on 17/4/15.
 */

public enum FriendFieldEnum {
    undefined(-1, (Class)null),
    ALIAS(8, String.class),
    EXTENSION(10, Map.class);

    private int value;
    private Class fieldType;

    private FriendFieldEnum(int var3, Class var4) {
        this.value = var3;
        this.fieldType = var4;
    }

    public static FriendFieldEnum typeOfValue(int var0) {
        FriendFieldEnum[] var1;
        int var2 = (var1 = values()).length;

        for(int var3 = 0; var3 < var2; ++var3) {
            FriendFieldEnum var4;
            if((var4 = var1[var3]).value == var0) {
                return var4;
            }
        }

        return undefined;
    }

    public final int getValue() {
        return this.value;
    }

    public final Class getFieldType() {
        return this.fieldType;
    }
}
