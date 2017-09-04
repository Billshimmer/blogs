//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by Fernflower decompiler)
//

package com.netease.nimlib.sdk.friend.model;

public class MuteListChangedNotify {
    private String account;
    private boolean mute;

    public MuteListChangedNotify(String var1, boolean var2) {
        this.account = var1;
        this.mute = var2;
    }

    public String getAccount() {
        return this.account;
    }

    public boolean isMute() {
        return this.mute;
    }
}
