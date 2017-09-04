package com.netease.nimlib.sdk.msg.constant;

import com.hyphenate.chat.EMMessage;

/**
 * Created by dansejijie on 17/4/4.
 */


public enum MsgTypeEnum {
    undef(-1, "Unknown"),
    text(0, ""),
    image(1, "图片"),
    audio(2, "语音"),
    video(3, "视频"),
    location(4, "位置"),
    file(6, "文件"),
    avchat(7, "音视频通话"),
    notification(5, "通知消息"),
    tip(10, "提醒消息"),
    custom(100, "自定义消息");

    private final int value;
    final String sendMessageTip;

    private MsgTypeEnum(int var3, String var4) {
        this.value = var3;
        this.sendMessageTip = var4;
    }

    public final int getValue() {
        return this.value;
    }

    public final String getSendMessageTip() {
        return this.sendMessageTip;
    }

    public static MsgTypeEnum EMMessageMsgTypeEnumConvertToIMMessageMsgTypeEnum(EMMessage.Type var2){
        if(var2 == EMMessage.Type.TXT) {
            return MsgTypeEnum.text;
        }

        if(var2 == EMMessage.Type.IMAGE) {
            return MsgTypeEnum.image;
        }

        if(var2 == EMMessage.Type.CMD) {
            return MsgTypeEnum.custom;
        }

        if(var2 == EMMessage.Type.FILE) {
            return MsgTypeEnum.file;
        }

        if(var2 == EMMessage.Type.VIDEO) {
            return MsgTypeEnum.video;
        }

        if(var2 == EMMessage.Type.VOICE) {
            return MsgTypeEnum.audio;
        }

        if(var2 == EMMessage.Type.LOCATION) {
            return MsgTypeEnum.location;
        }else {
            return MsgTypeEnum.text;
        }
    }

    public static EMMessage.Type IMMessageMsgTypeEnumConvertToEMMessageMsgTypeEnum(MsgTypeEnum var2){
        if(var2 == MsgTypeEnum.text) {
            return EMMessage.Type.TXT;
        }

        if(var2 == MsgTypeEnum.image) {
            return EMMessage.Type.IMAGE;
        }

        if(var2 == MsgTypeEnum.custom) {
            return EMMessage.Type.CMD;
        }

        if(var2 == MsgTypeEnum.file) {
            return EMMessage.Type.FILE;
        }

        if(var2 == MsgTypeEnum.video) {
            return EMMessage.Type.VIDEO;
        }

        if(var2 == MsgTypeEnum.audio) {
            return EMMessage.Type.VOICE;
        }

        if(var2 == MsgTypeEnum.location) {
            return EMMessage.Type.LOCATION;
        }else {
            return EMMessage.Type.TXT;
        }
    }
}
