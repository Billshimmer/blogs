package com.netease.nim.uikit.userinfo;

import android.graphics.Bitmap;

import java.io.Serializable;
import java.util.List;

/**
 * Created by yinhf on 2017/1/9.
 */
public interface UserInfoProvider {
    UserInfoProvider.UserInfo getUserInfo(String var1);

    int getDefaultIconResId();

    Bitmap getAvatarForMessageNotifier(String var1);

//    String getDisplayNameForMessageNotifier(String var1, String var2, SessionTypeEnum var3);

    Bitmap getTeamIcon(String var1);

    void todo(List<UserInfo> userInfos);

    public interface UserInfo extends Serializable {
        String getAccount();

        String getName();

        String getAvatar();

    }
}