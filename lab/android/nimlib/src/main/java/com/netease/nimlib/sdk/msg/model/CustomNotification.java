package com.netease.nimlib.sdk.msg.model;

import com.netease.nimlib.sdk.msg.constant.SessionTypeEnum;

import java.io.Serializable;
import java.util.Map;

/**
 * Created by dansejijie on 17/4/4.
 */

public class CustomNotification implements Serializable {
    private String sessionId;
    private SessionTypeEnum sessionType;
    private String fromAccount;
    private long time;
    private String content;
    private boolean sendToOnlineUserOnly = true;
    private String apnsText;
    private Map<String, Object> pushPayload;
    private CustomNotificationConfig config;
    private NIMAntiSpamOption antiSpamOption;

    public CustomNotification() {
    }

    public String getSessionId() {
        return this.sessionId;
    }

    public void setSessionId(String var1) {
        this.sessionId = var1;
    }

    public SessionTypeEnum getSessionType() {
        return this.sessionType;
    }

    public void setSessionType(SessionTypeEnum var1) {
        this.sessionType = var1;
    }

    public String getFromAccount() {
        return this.fromAccount;
    }

    public void setFromAccount(String var1) {
        this.fromAccount = var1;
    }

    public long getTime() {
        return this.time;
    }

    public void setTime(long var1) {
        this.time = var1;
    }

    public String getContent() {
        return this.content;
    }

    public void setContent(String var1) {
        this.content = var1;
    }

    public boolean isSendToOnlineUserOnly() {
        return this.sendToOnlineUserOnly;
    }

    public void setSendToOnlineUserOnly(boolean var1) {
        this.sendToOnlineUserOnly = var1;
    }

    public String getApnsText() {
        return this.apnsText;
    }

    public void setApnsText(String var1) {
        this.apnsText = var1;
    }

    public Map<String, Object> getPushPayload() {
        return this.pushPayload;
    }

    public void setPushPayload(Map<String, Object> var1) {
        this.pushPayload = var1;
    }

    public CustomNotificationConfig getConfig() {
        return this.config;
    }

    public void setConfig(CustomNotificationConfig var1) {
        this.config = var1;
    }

    public NIMAntiSpamOption getNIMAntiSpamOption() {
        return this.antiSpamOption;
    }

    public void setNIMAntiSpamOption(NIMAntiSpamOption var1) {
        this.antiSpamOption = var1;
    }
}
