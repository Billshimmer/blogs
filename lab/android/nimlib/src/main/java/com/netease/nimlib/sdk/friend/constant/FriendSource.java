package com.netease.nimlib.sdk.friend.constant;

/**
 * Created by dansejijie on 17/4/15.
 */

public enum FriendSource {
    DEFAULT((byte)0);

    private byte value;

    private FriendSource(byte var3) {
        this.value = var3;
    }

    public static FriendSource friendSourceOfValue(int var0) {
        byte var5 = (byte)var0;
        FriendSource[] var1;
        int var2 = (var1 = values()).length;

        for(int var3 = 0; var3 < var2; ++var3) {
            FriendSource var4;
            if((var4 = var1[var3]).getValue() == var5) {
                return var4;
            }
        }

        return null;
    }

    public final byte getValue() {
        return this.value;
    }
}
