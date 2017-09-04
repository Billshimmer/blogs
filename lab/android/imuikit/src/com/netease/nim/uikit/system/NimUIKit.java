package com.netease.nim.uikit.system;

import android.content.Context;

import com.netease.nim.uikit.userinfo.DefaultUserInfoProvider;
import com.netease.nim.uikit.userinfo.UserInfoProvider;

/**
 * Created by tygzx on 17/1/5.
 */
public class NimUIKit {

    private static Context context;
    private static SessionEventListener sessionListener;
    private static UserInfoProvider userInfoProvider;

    private NimUIKit() {

    }

    public static void init(Context context, UserInfoProvider infoProvider) {
        NimUIKit.context = context;
        userInfoProvider=infoProvider;
    }

    public static Context getContext() {
        return context;
    }

    public static SessionEventListener getSessionListener() {
        return sessionListener;
    }

    /**
     * 设置聊天界面的事件监听器
     * @param sessionListener
     */
    public static void setSessionListener(SessionEventListener sessionListener) {
        NimUIKit.sessionListener = sessionListener;
    }

    // 初始化用户信息提供者
    private static void initUserInfoProvider(UserInfoProvider userInfoProvider) {

        if (userInfoProvider == null) {
            userInfoProvider = new DefaultUserInfoProvider(context);
        }

        NimUIKit.userInfoProvider = userInfoProvider;
    }

    public static UserInfoProvider getUserInfoProvider() {
        return userInfoProvider;
    }
}
