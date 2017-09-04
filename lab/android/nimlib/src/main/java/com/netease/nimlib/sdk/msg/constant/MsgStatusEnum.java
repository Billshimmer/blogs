package com.netease.nimlib.sdk.msg.constant;

import com.hyphenate.chat.EMMessage;
import com.hyphenate.chat.adapter.message.EMAMessage;

/**
 * Created by dansejijie on 17/4/4.
 */
public enum MsgStatusEnum {
    draft(-1),
    sending(0),
    success(1),
    fail(2),
    read(3),
    unread(4);

    private int value;

    private MsgStatusEnum(int var3) {
        this.value = var3;
    }

    public static MsgStatusEnum statusOfValue(int var0) {
        MsgStatusEnum[] var1;
        int var2 = (var1 = values()).length;

        for(int var3 = 0; var3 < var2; ++var3) {
            MsgStatusEnum var4;
            if((var4 = var1[var3]).getValue() == var0) {
                return var4;
            }
        }

        return sending;
    }

    public final int getValue() {
        return this.value;
    }

    public static MsgStatusEnum EMMessageMsgStatusEnumConvertToIMMessageMsgStatusEnum(EMMessage emMessage){

        EMMessage.Status var1=emMessage.status();

        if(var1 == EMMessage.Status.CREATE) {
            return MsgStatusEnum.sending;
        } else if(var1 == EMMessage.Status.SUCCESS) {
            return MsgStatusEnum.success;
        } else if(var1 == EMMessage.Status.FAIL) {
            return MsgStatusEnum.fail;
        } else if (var1==EMMessage.Status.INPROGRESS){
            return MsgStatusEnum.sending;
        }

        if (emMessage.isUnread()){
            return MsgStatusEnum.unread;
        }else {
            return MsgStatusEnum.read;
        }

    }

    public static EMMessage.Status IMMessageMsgStatusEnumConvertToEMMessageMsgStatusEnum(MsgStatusEnum var1){

        if(var1 == MsgStatusEnum.sending) {
            return EMMessage.Status.INPROGRESS;
        } else if(var1 == MsgStatusEnum.success) {
            return EMMessage.Status.SUCCESS;
        } else if(var1 == MsgStatusEnum.fail) {
            return EMMessage.Status.FAIL;
        } else if (var1==MsgStatusEnum.sending){
            return EMMessage.Status.INPROGRESS;
        }

        return EMMessage.Status.CREATE;

    }
}