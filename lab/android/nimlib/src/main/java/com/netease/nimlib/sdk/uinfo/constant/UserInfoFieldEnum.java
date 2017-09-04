package com.netease.nimlib.sdk.uinfo.constant;

/**
 * Created by dansejijie on 17/4/15.
 */

public enum UserInfoFieldEnum {
    undefined(-1, (Class)null),
    Name(3, String.class),
    AVATAR(4, String.class),
    SIGNATURE(5, String.class),
    GENDER(6, Integer.class),
    EMAIL(7, String.class),
    BIRTHDAY(8, String.class),
    MOBILE(9, String.class),
    EXTEND(10, String.class);

    private int value;
    private Class<? extends Object> fieldType;

    private UserInfoFieldEnum(int var3, Class<? extends Object> var4) {
        this.value = var3;
        this.fieldType = var4;
    }

    public static UserInfoFieldEnum typeOfValue(int var0) {
        UserInfoFieldEnum[] var1;
        int var2 = (var1 = values()).length;

        for(int var3 = 0; var3 < var2; ++var3) {
            UserInfoFieldEnum var4;
            if((var4 = var1[var3]).value == var0) {
                return var4;
            }
        }

        return undefined;
    }

    public final int getValue() {
        return this.value;
    }

    public final Class<? extends Object> getFieldType() {
        return this.fieldType;
    }
}
