package com.netease.nimlib.sdk.friend.model;

import com.netease.nimlib.sdk.friend.constant.VerifyType;

import java.io.Serializable;

/**
 * Created by dansejijie on 17/4/15.
 */

public class AddFriendData implements Serializable {
    private String account;
    private VerifyType verifyType;
    private String msg;

    public AddFriendData(String var1, VerifyType var2) {
        this.account = var1;
        this.verifyType = var2;
    }

    public AddFriendData(String var1, VerifyType var2, String var3) {
        this.account = var1;
        this.verifyType = var2;
        this.msg = var3;
    }

    public String getAccount() {
        return this.account;
    }

    public VerifyType getVerifyType() {
        return this.verifyType;
    }

    public String getMsg() {
        return this.msg;
    }
}
