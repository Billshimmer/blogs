package com.netease.nimlib.sdk.msg.model;

import java.io.Serializable;

/**
 * Created by dansejijie on 17/4/4.
 */

public class CustomNotificationConfig implements Serializable {
    public boolean enablePush = true;
    public boolean enablePushNick = false;
    public boolean enableUnreadCount = true;

    public CustomNotificationConfig() {
    }
}
