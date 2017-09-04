package com.netease.nimlib.sdk.friend.model;

import java.io.Serializable;

/**
 * Created by dansejijie on 17/4/15.
 */

public class AddFriendNotify implements Serializable {
    private String account;
    private AddFriendNotify.Event event;
    private String msg;

    public AddFriendNotify(String var1, AddFriendNotify.Event var2) {
        this.account = var1;
        this.event = var2;
    }

    public AddFriendNotify(String var1, AddFriendNotify.Event var2, String var3) {
        this.account = var1;
        this.event = var2;
        this.msg = var3;
    }

    public String getAccount() {
        return this.account;
    }

    public AddFriendNotify.Event getEvent() {
        return this.event;
    }

    public String getMsg() {
        return this.msg;
    }

    public static enum Event {
        RECV_ADD_FRIEND_DIRECT((byte)1),
        RECV_ADD_FRIEND_VERIFY_REQUEST((byte)2),
        RECV_AGREE_ADD_FRIEND((byte)3),
        RECV_REJECT_ADD_FRIEND((byte)4);

        private byte value;

        private Event(byte var3) {
            this.value = var3;
        }

        public static AddFriendNotify.Event eventOfValue(byte var0) {
            AddFriendNotify.Event[] var1;
            int var2 = (var1 = values()).length;

            for(int var3 = 0; var3 < var2; ++var3) {
                AddFriendNotify.Event var4;
                if((var4 = var1[var3]).getValue() == var0) {
                    return var4;
                }
            }

            return null;
        }

        public final byte getValue() {
            return this.value;
        }
    }
}