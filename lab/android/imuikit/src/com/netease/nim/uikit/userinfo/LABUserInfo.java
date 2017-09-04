package com.netease.nim.uikit.userinfo;

/**
 * Created by yinhf on 2017/1/9.
 */

public class LABUserInfo implements UserInfoProvider.UserInfo {

    private String account;
    private String name;
    private String avatar;

    public LABUserInfo(String account, String name, String avatar) {
        this.account = account;
        this.name = name;
        this.avatar = avatar;
    }

    @Override
    public String getAccount() {
        return account;
    }

    @Override
    public String getName() {
        return name;
    }

    @Override
    public String getAvatar() {
        return avatar;
    }
}
