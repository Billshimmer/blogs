package com.netease.nimlib.sdk.msg.model;

import java.io.Serializable;

/**
 * Created by dansejijie on 17/4/4.
 */
public class CustomMessageConfig implements Serializable {
    public static String KEY_ENABLE_HISTORY = "KEY_ENABLE_HISTORY";
    public static String KEY_ENABLE_ROAMING = "KEY_ENABLE_ROAMING";
    public static String KEY_ENABLE_SELF_SYNC = "KEY_ENABLE_SELF_SYNC";
    public static String KEY_ENABLE_PUSH = "KEY_ENABLE_PUSH";
    public static String KEY_ENABLE_PUSH_NICK = "KEY_ENABLE_PUSH_NICK";
    public static String KEY_ENABLE_UNREAD_COUNT = "KEY_ENABLE_UNREAD_COUNT";
    public static String KEY_ENABLE_ROUTE = "KEY_ENABLE_ROUTE";
    public boolean enableHistory = true;
    public boolean enableRoaming = true;
    public boolean enableSelfSync = true;
    public boolean enablePush = true;
    public boolean enablePushNick = true;
    public boolean enableUnreadCount = true;
    public boolean enableRoute = true;

    public CustomMessageConfig() {
    }
}
