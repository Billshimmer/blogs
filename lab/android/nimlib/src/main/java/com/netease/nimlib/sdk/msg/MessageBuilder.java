package com.netease.nimlib.sdk.msg;

import android.text.TextUtils;
import android.util.Log;

import com.hyphenate.chat.EMMessage;
import com.netease.nimlib.sdk.msg.attachment.MsgAttachment;
import com.netease.nimlib.sdk.msg.constant.AttachStatusEnum;
import com.netease.nimlib.sdk.msg.constant.MsgDirectionEnum;
import com.netease.nimlib.sdk.msg.constant.MsgStatusEnum;
import com.netease.nimlib.sdk.msg.constant.MsgTypeEnum;
import com.netease.nimlib.sdk.msg.constant.SessionTypeEnum;
import com.netease.nimlib.sdk.msg.model.CustomMessageConfig;
import com.netease.nimlib.sdk.msg.model.IMMessage;

import java.io.File;

/**
 * Created by dansejijie on 17/4/4.
 */

public class MessageBuilder {

    public MessageBuilder() {
    }

    public static IMMessage createTextMessage(String var0, SessionTypeEnum var1, String var2) {

        EMMessage emMessage= EMMessage.createTxtSendMessage(var2,var0);
        emMessage.setChatType(SessionTypeEnum.IMMessageSessionTypeEnumConvertToEMMessageSessionTypeEnum(var1));
        return new IMMessage(emMessage);
    }

    public static IMMessage createImageMessage(String var0, SessionTypeEnum var1, File var2) {
        return createImageMessage(var0, var1, var2, (String)null);
    }

    public static IMMessage createImageMessage(String var0, SessionTypeEnum var1, File var2, String var3) {
        EMMessage emMessage=EMMessage.createImageSendMessage(var2.getAbsolutePath(),true,var0);
        emMessage.setChatType(SessionTypeEnum.IMMessageSessionTypeEnumConvertToEMMessageSessionTypeEnum(var1));
        return new IMMessage(emMessage);
    }

    public static IMMessage createAudioMessage(String var0, SessionTypeEnum var1, File var2, long var3) {
        EMMessage emMessage=EMMessage.createVoiceSendMessage(var2.getAbsolutePath(),(int)(var3),var0);
        emMessage.setChatType(SessionTypeEnum.IMMessageSessionTypeEnumConvertToEMMessageSessionTypeEnum(var1));
        return new IMMessage(emMessage);
    }

    public static IMMessage createLocationMessage(String var0, SessionTypeEnum var1, double var2, double var4, String var6) {
        EMMessage emMessage=EMMessage.createLocationSendMessage(var2,var4,var6,var0);
        emMessage.setChatType(SessionTypeEnum.IMMessageSessionTypeEnumConvertToEMMessageSessionTypeEnum(var1));
        return new IMMessage(emMessage);
    }

    public static IMMessage createVideoMessage(String var0, SessionTypeEnum var1, File var2, long var3, int var5, int var6, String var7) {
        EMMessage emMessage=EMMessage.createVideoSendMessage(var2.getAbsolutePath(),var7,(int)(var3/1000),var0);
        emMessage.setChatType(SessionTypeEnum.IMMessageSessionTypeEnumConvertToEMMessageSessionTypeEnum(var1));
        return new IMMessage(emMessage);
    }

    public static IMMessage createFileMessage(String var0, SessionTypeEnum var1, File var2, String var3) {
        EMMessage emMessage=EMMessage.createFileSendMessage(var2.getAbsolutePath(),var0);
        emMessage.setChatType(SessionTypeEnum.IMMessageSessionTypeEnumConvertToEMMessageSessionTypeEnum(var1));
        return new IMMessage(emMessage);
    }

    public static IMMessage createTipMessage(String var0, SessionTypeEnum var1) {
        Log.e("TAG","unhandler");
        EMMessage emMessage= EMMessage.createTxtSendMessage(" ",var0);
        emMessage.setChatType(SessionTypeEnum.IMMessageSessionTypeEnumConvertToEMMessageSessionTypeEnum(var1));
        return new IMMessage(emMessage);
    }
//
    public static IMMessage createCustomMessage(String var0, SessionTypeEnum var1, MsgAttachment var2) {
        //return createCustomMessage(var0, var1, (String)null, var2, (CustomMessageConfig)null);
        return createCustomMessage(var0,var1," ",var2);
    }

    public static IMMessage createCustomMessage(String var0, SessionTypeEnum var1, String var2, MsgAttachment var3) {
        return createCustomMessage(var0, var1, var2, var3, (CustomMessageConfig)null);
    }

    public static IMMessage createCustomMessage(String var0, SessionTypeEnum var1, String var2, MsgAttachment var3, CustomMessageConfig var4) {
        EMMessage emMessage= EMMessage.createTxtSendMessage(" ",var0);
        emMessage.setChatType(SessionTypeEnum.IMMessageSessionTypeEnumConvertToEMMessageSessionTypeEnum(var1));
        return new IMMessage(emMessage);
    }
//
    public static IMMessage createEmptyMessage(String var0, SessionTypeEnum var1, long var2) {
        EMMessage emMessage= EMMessage.createTxtSendMessage("anchor de info",var0);
        emMessage.setChatType(SessionTypeEnum.IMMessageSessionTypeEnumConvertToEMMessageSessionTypeEnum(var1));
        return new IMMessage(emMessage);
    }
//
    public static IMMessage createForwardMessage(IMMessage var0, String var1, SessionTypeEnum var2) {
//        if(var0.getMsgType() != MsgTypeEnum.notification && var0.getMsgType() != MsgTypeEnum.avchat) {
//            a var3;
//            if((var3 = ((a)var0).i()) != null) {
//                var3.b(var1);
//                var3.a(var2);
//                var3.a(l.a());
//                var3.setFromAccount(b.b());
//                var3.setDirect(MsgDirectionEnum.Out);
//                var3.setStatus(MsgStatusEnum.sending);
//                var3.b(System.currentTimeMillis());
//                var3.c(0L);
//                var3.a(0L);
//                MsgAttachment var4;
//                if((var4 = var3.getAttachment()) != null && var4 instanceof FileAttachment && !TextUtils.isEmpty(((FileAttachment)var4).getUrl())) {
//                    var3.setAttachStatus(AttachStatusEnum.def);
//                }
//            }
//
//            return var3;
//        } else {
//            return null;
//        }
        Log.e("TAG","unhandler");
        EMMessage emMessage= EMMessage.createTxtSendMessage(" ",var0.getFromAccount());
        emMessage.setChatType(SessionTypeEnum.IMMessageSessionTypeEnumConvertToEMMessageSessionTypeEnum(var2));
        return new IMMessage(emMessage);
    }

//    private static a initSendMessage(String var0, SessionTypeEnum var1) {
//        a var2;
//        (var2 = new a()).a(l.a());
//        var2.b(var0);
//        var2.setFromAccount(b.b());
//        var2.setDirect(MsgDirectionEnum.Out);
//        var2.setStatus(MsgStatusEnum.sending);
//        var2.a(var1);
//        var2.b(System.currentTimeMillis());
//        return var2;
//    }
}
