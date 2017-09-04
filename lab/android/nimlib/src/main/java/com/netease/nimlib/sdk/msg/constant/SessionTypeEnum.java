package com.netease.nimlib.sdk.msg.constant;

import com.hyphenate.chat.EMMessage;
import com.hyphenate.chat.adapter.message.EMAMessage;

/**
 * Created by dansejijie on 17/4/4.
 */

public enum SessionTypeEnum {
    None(-1),
    P2P(0),
    Team(1),
    System(10001),
    ChatRoom(10002);

    private int value;

    private SessionTypeEnum(int var3) {
        this.value = var3;
    }

    public final int getValue() {
        return this.value;
    }

    public static SessionTypeEnum typeOfValue(int var0) {
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

    public static SessionTypeEnum EMMessageSessionTypeEnumConvertToIMMessageSessionTypeEnum(EMMessage.ChatType var1){
        if(var1 == EMMessage.ChatType.Chat) {
            return SessionTypeEnum.P2P;
        } else if(var1 == EMMessage.ChatType.GroupChat) {
            return SessionTypeEnum.Team;
        } else {
             return SessionTypeEnum.ChatRoom;
        }
    }

    public static EMMessage.ChatType IMMessageSessionTypeEnumConvertToEMMessageSessionTypeEnum(SessionTypeEnum var1){
        if(var1 == P2P) {
            return EMMessage.ChatType.Chat;
        } else if(var1 == Team) {
            return EMMessage.ChatType.GroupChat;
        } else {
            return EMMessage.ChatType.ChatRoom;
        }
    }
}