package com.netease.nimlib.sdk.msg.constant;

import com.hyphenate.chat.EMMessage;

public enum MsgDirectionEnum {
    Out(0),
    In(1);

    private int value;

    private MsgDirectionEnum(int var3) {
        this.value = var3;
    }

    public final int getValue() {
        return this.value;
    }

    public static MsgDirectionEnum directionOfValue(int var0) {
        MsgDirectionEnum[] var1;
        int var2 = (var1 = values()).length;

        for(int var3 = 0; var3 < var2; ++var3) {
            MsgDirectionEnum var4;
            if((var4 = var1[var3]).getValue() == var0) {
                return var4;
            }
        }

        return Out;
    }

    public static MsgDirectionEnum EMMessageMsgStatusEnumConvertToIMMessageMsgStatusEnum(EMMessage.Direct var1){

        if (var1== EMMessage.Direct.RECEIVE){
            return MsgDirectionEnum.In;
        }else {
            return MsgDirectionEnum.Out;
        }

    }

    public static EMMessage.Direct IMMessageMsgStatusEnumConvertToEMMessageMsgStatusEnum(MsgDirectionEnum var1){
        if (var1==Out){
            return EMMessage.Direct.SEND;
        }else {
            return EMMessage.Direct.RECEIVE;
        }
    }
}