package com.netease.nimlib.sdk.msg.model;

import java.io.Serializable;
import java.util.List;

/**
 * Created by dansejijie on 17/4/15.
 */

public class MemberPushOption implements Serializable {
    private List<String> forcePushList = null;
    private String forcePushContent = null;
    private boolean isForcePush = true;

    public MemberPushOption() {
    }

    public List<String> getForcePushList() {
        return this.forcePushList;
    }

    public String getForcePushContent() {
        return this.forcePushContent;
    }

    public boolean isForcePush() {
        return this.isForcePush;
    }

    public void setForcePush(boolean var1) {
        this.isForcePush = var1;
    }

    public void setForcePushList(List<String> var1) {
        this.forcePushList = var1;
    }

    public void setForcePushContent(String var1) {
        this.forcePushContent = var1;
    }
}
