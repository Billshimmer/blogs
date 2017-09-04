package com.netease.nimlib.sdk.friend.constant;

/**
 * Created by dansejijie on 17/4/15.
 */
public enum FriendRelationship {
    NOT_FRIEND(0),
    NORMAL_FRIEND(1);

    private int value;

    private FriendRelationship(int var3) {
        this.value = var3;
    }

    public static FriendRelationship RelationshipOfValue(int var0) {
        FriendRelationship[] var1;
        int var2 = (var1 = values()).length;

        for(int var3 = 0; var3 < var2; ++var3) {
            FriendRelationship var4;
            if((var4 = var1[var3]).getValue() == var0) {
                return var4;
            }
        }

        return NOT_FRIEND;
    }

    public final int getValue() {
        return this.value;
    }
}
