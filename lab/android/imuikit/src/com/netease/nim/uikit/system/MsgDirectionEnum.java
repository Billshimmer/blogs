package com.netease.nim.uikit.system;

import com.hyphenate.chat.EMMessage;

/**
 * Created by zhengqiang on 2016/12/31.
 */

public enum MsgDirectionEnum {
    Out(EMMessage.Direct.SEND),
    In(EMMessage.Direct.RECEIVE);

    private EMMessage.Direct value;

    private MsgDirectionEnum(EMMessage.Direct var3) {
        this.value = var3;
    }

    public final EMMessage.Direct getValue() {
        return this.value;
    }

    public static MsgDirectionEnum directionOfValue(EMMessage.Direct var0) {
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
}
