package com.netease.nimlib.sdk.avchat.model;

import com.netease.nimlib.sdk.avchat.constant.AVChatRecordState;
import com.netease.nimlib.sdk.avchat.constant.AVChatType;
import com.netease.nimlib.sdk.msg.attachment.MsgAttachment;

/**
 * Created by dansejijie on 17/4/15.
 */

public interface AVChatAttachment {
    AVChatRecordState getState();

    int getDuration();

    AVChatType getType();

    boolean isMultiUser();
}