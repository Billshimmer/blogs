package com.netease.nim.uikit.system;

import com.hyphenate.EMMessageListener;
import com.hyphenate.chat.EMClient;
import com.hyphenate.chat.EMConversation;
import com.hyphenate.chat.EMMessage;
import com.hyphenate.exceptions.HyphenateException;
import com.netease.nim.uikit.system.RequestCallback;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by zhengqiang on 2016/12/31.
 */

public enum MsgStatusEnum {
    //draft(-1),
    sending(EMMessage.Status.INPROGRESS),
    success(EMMessage.Status.SUCCESS),
    fail(EMMessage.Status.FAIL);
    //read(3),
    //unread(4);

    private EMMessage.Status value;

    private MsgStatusEnum(EMMessage.Status var3) {
        this.value = var3;
    }

    public static MsgStatusEnum statusOfValue(EMMessage.Status var0) {
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

    public final EMMessage.Status getValue() {
        return this.value;
    }

}
