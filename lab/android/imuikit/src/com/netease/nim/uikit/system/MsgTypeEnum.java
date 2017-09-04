package com.netease.nim.uikit.system;

import com.hyphenate.chat.EMMessage;

/**
 * Created by zhengqiang on 2016/12/31.
 */

public enum MsgTypeEnum {
    //undef(-1, "Unknown"),
    text(EMMessage.Type.TXT),
    image(EMMessage.Type.IMAGE),
    audio(EMMessage.Type.VOICE),
    video(EMMessage.Type.VIDEO),
    location(EMMessage.Type.LOCATION),
    file(EMMessage.Type.FILE);
    //avchat(7, "音视频通话"),
    //notification(5, "通知消息"),
    //tip(10, "提醒消息"),
    //custom(100, "自定义消息");

    private EMMessage.Type value;
    //final String sendMessageTip;

    private MsgTypeEnum(EMMessage.Type var3) {
        this.value = var3;
        //this.sendMessageTip = var4;
    }

    public final EMMessage.Type getValue() {
        return this.value;
    }

    public static MsgTypeEnum typeOfValue(EMMessage.Type var0) {
        MsgTypeEnum[] var1;
        int var2 = (var1 = values()).length;
        for(int var3 = 0; var3 < var2; ++var3) {
            MsgTypeEnum var4;
            if((var4 = var1[var3]).getValue() == var0) {
                return var4;
            }
        }
        return text;
    }
}
