package com.netease.nim.uikit.system;

import com.hyphenate.chat.EMMessage;

/**
 * Created by zhengqiang on 2016/12/31.
 */

public enum SessionTypeEnum {

    P2P(EMMessage.ChatType.Chat),
    Team(EMMessage.ChatType.GroupChat),
    ChatRoom(EMMessage.ChatType.ChatRoom);

    private EMMessage.ChatType value;
    private SessionTypeEnum(EMMessage.ChatType var3) {
        this.value = var3;
    }
    public final EMMessage.ChatType getValue() {
        return this.value;
    }
    public static SessionTypeEnum typeOfValue(EMMessage.ChatType var0) {
        SessionTypeEnum[] var1;
        int var2 = (var1 = values()).length;
        for(int var3 = 0; var3 < var2; ++var3) {
            SessionTypeEnum var4;
            if((var4 = var1[var3]).getValue() == var0) {
                return var4;
            }
        }
        return P2P;
    }
}
