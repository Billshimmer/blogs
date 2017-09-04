package com.netease.nim.uikit.userinfo;

import android.content.Context;
import android.graphics.Bitmap;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by yinhf on 2017/1/9.
 * TODO 实现自动从网络加载用户信息
 */
public class DefaultUserInfoProvider implements UserInfoProvider {

    private Map<String, UserInfo> userInfoMap = new HashMap<>();

    public DefaultUserInfoProvider(Context context) {

    }

    @Override
    public UserInfo getUserInfo(String account) {
        return userInfoMap.get(account);
    }

    @Override
    public int getDefaultIconResId() {
        return 0;
    }

    @Override
    public Bitmap getAvatarForMessageNotifier(String var1) {
        return null;
    }

    @Override
    public Bitmap getTeamIcon(String var1) {
        return null;
    }

    public void todo(List<UserInfo> userInfos) {
        for (UserInfo userInfo : userInfos) {
            userInfoMap.put(userInfo.getAccount(), userInfo);
        }
    }

}
