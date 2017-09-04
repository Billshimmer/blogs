package com.netease.nimlib.sdk.msg.model;

import com.netease.nimlib.sdk.msg.attachment.MsgAttachment;
import com.netease.nimlib.sdk.msg.constant.MsgStatusEnum;
import com.netease.nimlib.sdk.msg.constant.MsgTypeEnum;
import com.netease.nimlib.sdk.msg.constant.SessionTypeEnum;

import java.io.Serializable;
import java.util.Map;

/**
 * Created by dansejijie on 17/4/4.
 */
public interface RecentContact extends Serializable {
    String getContactId();

    String getFromAccount();

    String getFromNick();

    SessionTypeEnum getSessionType();

    String getRecentMessageId();

    MsgTypeEnum getMsgType();

    MsgStatusEnum getMsgStatus();

    void setMsgStatus(MsgStatusEnum var1);

    int getUnreadCount();

    String getContent();

    long getTime();

    MsgAttachment getAttachment();

    void setTag(long var1);

    long getTag();

    Map<String, Object> getExtension();

    void setExtension(Map<String, Object> var1);
}
