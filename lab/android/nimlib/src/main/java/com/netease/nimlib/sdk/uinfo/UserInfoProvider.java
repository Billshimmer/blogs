package com.netease.nimlib.sdk.uinfo;

import android.graphics.Bitmap;

import com.netease.nimlib.sdk.msg.constant.SessionTypeEnum;

import java.io.Serializable;

/**
 * Created by dansejijie on 17/4/8.
 */
public interface UserInfoProvider {
    UserInfoProvider.UserInfo getUserInfo(String var1);

    int getDefaultIconResId();

    Bitmap getAvatarForMessageNotifier(String var1);

    String getDisplayNameForMessageNotifier(String var1, String var2, SessionTypeEnum var3);

    Bitmap getTeamIcon(String var1);

    public interface UserInfo extends Serializable {
        String getAccount();

        String getName();

        String getAvatar();
    }
}