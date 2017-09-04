package com.netease.nimlib.sdk.msg.constant;

import com.hyphenate.chat.EMFileMessageBody;
import com.hyphenate.chat.EMMessage;
import com.hyphenate.chat.EMMessageBody;

/**
 * Created by dansejijie on 17/4/4.
 */

public enum AttachStatusEnum {
    def(0),
    transferring(1),
    transferred(2),
    fail(3);

    private int value;

    private AttachStatusEnum(int var3) {
        this.value = var3;
    }

    public static AttachStatusEnum statusOfValue(int var0) {
        AttachStatusEnum[] var1;
        int var2 = (var1 = values()).length;

        for(int var3 = 0; var3 < var2; ++var3) {
            AttachStatusEnum var4;
            if((var4 = var1[var3]).getValue() == var0) {
                return var4;
            }
        }

        return def;
    }

    public final int getValue() {
        return this.value;
    }

    public static AttachStatusEnum EMMessageMsgStatusEnumConvertToIMMessageMsgStatusEnum(EMFileMessageBody.EMDownloadStatus var1){
        if (var1==EMFileMessageBody.EMDownloadStatus.DOWNLOADING){
            return AttachStatusEnum.transferring;
        }
        if (var1==EMFileMessageBody.EMDownloadStatus.FAILED){
            return AttachStatusEnum.fail;
        }

        if (var1==EMFileMessageBody.EMDownloadStatus.PENDING){
            return AttachStatusEnum.transferring;
        }

        return AttachStatusEnum.def;
    }

    public static EMFileMessageBody.EMDownloadStatus IMMessageMsgStatusEnumConvertToEMMessageMsgStatusEnum(AttachStatusEnum var1){
        if (var1==transferring){
            return EMFileMessageBody.EMDownloadStatus.DOWNLOADING;
        }

        if (var1==transferred){
            return EMFileMessageBody.EMDownloadStatus.SUCCESSED;
        }

        if (var1==fail){
            return EMFileMessageBody.EMDownloadStatus.FAILED;
        }
        return EMFileMessageBody.EMDownloadStatus.FAILED;
    }
}
