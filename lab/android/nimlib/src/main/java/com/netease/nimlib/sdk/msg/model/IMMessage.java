package com.netease.nimlib.sdk.msg.model;

import android.util.Log;

import com.hyphenate.EMCallBack;
import com.hyphenate.chat.EMFileMessageBody;
import com.hyphenate.chat.EMImageMessageBody;
import com.hyphenate.chat.EMLocationMessageBody;
import com.hyphenate.chat.EMMessage;
import com.hyphenate.chat.EMTextMessageBody;
import com.hyphenate.chat.EMVoiceMessageBody;
import com.netease.nimlib.sdk.msg.attachment.AudioAttachment;
import com.netease.nimlib.sdk.msg.attachment.FileAttachment;
import com.netease.nimlib.sdk.msg.attachment.ImageAttachment;
import com.netease.nimlib.sdk.msg.attachment.LocationAttachment;
import com.netease.nimlib.sdk.msg.attachment.MsgAttachment;
import com.netease.nimlib.sdk.msg.constant.AttachStatusEnum;
import com.netease.nimlib.sdk.msg.constant.MsgDirectionEnum;
import com.netease.nimlib.sdk.msg.constant.MsgStatusEnum;
import com.netease.nimlib.sdk.msg.constant.MsgTypeEnum;
import com.netease.nimlib.sdk.msg.constant.SessionTypeEnum;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by dansejijie on 17/4/4.
 */

public class IMMessage implements Serializable {

    private static final String TAG=IMMessage.class.getSimpleName();

    public EMMessage emMessage;

    public IMMessage(){

    }

    public IMMessage(EMMessage emMessage){
        this.emMessage=emMessage;
    }

    public EMMessage getEMMessage(){
        return emMessage;
    }

    public void setEMMessage(EMMessage emMessage){
        this.emMessage=emMessage;
    }

    public String getUuid(){
        return emMessage.getMsgId();
    };


    public boolean isTheSame(IMMessage var1){
        return var1.emMessage.getMsgId().equals(emMessage.getMsgId());
    };

    public String getSessionId(){
        return emMessage.getUserName();
    }

    public SessionTypeEnum getSessionType(){
        return SessionTypeEnum.EMMessageSessionTypeEnumConvertToIMMessageSessionTypeEnum(emMessage.getChatType());
    }

    public String getFromNick(){
        return emMessage.getFrom();
    }

    public MsgTypeEnum getMsgType(){

       return MsgTypeEnum.EMMessageMsgTypeEnumConvertToIMMessageMsgTypeEnum(emMessage.getType());
    }

    public MsgStatusEnum getStatus(){

        MsgStatusEnum msgStatusEnum=MsgStatusEnum.EMMessageMsgStatusEnumConvertToIMMessageMsgStatusEnum(emMessage);
        Log.e(TAG,msgStatusEnum.toString());
        return msgStatusEnum;
    }

    public void setStatus(MsgStatusEnum var1){

        EMMessage.Status status=MsgStatusEnum.IMMessageMsgStatusEnumConvertToEMMessageMsgStatusEnum(var1);
        if (status==EMMessage.Status.CREATE){
            Log.e("TAG","这里需要修改下");//TODO
        }else {
            emMessage.setStatus(status);
        }

    }

    public void setDirect(MsgDirectionEnum var1){

        emMessage.setDirection(MsgDirectionEnum.IMMessageMsgStatusEnumConvertToEMMessageMsgStatusEnum(var1));
    }

    public MsgDirectionEnum getDirect(){
        return MsgDirectionEnum.EMMessageMsgStatusEnumConvertToIMMessageMsgStatusEnum(emMessage.direct());
    }

    public void setContent(String var1){
        Log.e("TAG","unhandle");
    }

    public String getContent(){
        //Log.e("TAG","unhandle");
        return ((EMTextMessageBody) emMessage.getBody()).getMessage();
    }

    public long getTime(){
        return emMessage.getMsgTime();
    }

    public void setFromAccount(String var1){
        emMessage.setFrom(var1);
    }

    public String getFromAccount(){
        return emMessage.getFrom();
    }

    public void setAttachment(MsgAttachment var1){
        emMessage.addBody(var1.getEMMessageBody());
    }

    public MsgAttachment getAttachment(){


        Class clz=emMessage.getBody().getClass();
        if (clz.isAssignableFrom(EMImageMessageBody.class)){
            return new ImageAttachment(this);
        }else if (clz.isAssignableFrom(EMVoiceMessageBody.class)){
            return new AudioAttachment(this);
        }else if (clz.isAssignableFrom(EMLocationMessageBody.class)){
            return new LocationAttachment(this);
        }else if (clz.isAssignableFrom(EMFileMessageBody.class)){
            return new FileAttachment(this);
        }else {
            return new MsgAttachment(this);
        }
    }

    public AttachStatusEnum getAttachStatus(){
        return AttachStatusEnum.EMMessageMsgStatusEnumConvertToIMMessageMsgStatusEnum(((EMFileMessageBody)(emMessage.getBody())).downloadStatus());
    }

    public void setAttachStatus(AttachStatusEnum var1){
        Log.e("TAG","not handler");//// TODO: 17/4/4
    }

    public CustomMessageConfig getConfig(){
        Log.e("TGA","unhandler");
        return new CustomMessageConfig();
    }

    public void setConfig(CustomMessageConfig var1){
        Log.e("TGA","unhandler");
    }
//
//    public Map<String, Object> getRemoteExtension(){
//
//    }
//
//    public void setRemoteExtension(Map<String, Object> var1){
//
//    }
//
//    public Map<String, Object> getLocalExtension(){
//
//    }
//
//    public void setLocalExtension(Map<String, Object> var1){
//
//    }
//
    public String getPushContent(){
        Log.e("TAG","unhandler");
        return " ";

    }

    public void setPushContent(String var1){
        Log.e("TAG","unhandler");

    }

    public Map<String, Object> getPushPayload(){
        Log.e("TAG","unhandler");
        return new HashMap<String,Object>();
    }

    public void setPushPayload(Map<String, Object> var1){
        Log.e("TAG","unhandler");

    }

    public MemberPushOption getMemberPushOption(){
        return new MemberPushOption();
    }

    public void setMemberPushOption(MemberPushOption var1){
        Log.e("TAG","unhandler");
    }
//
    public boolean isRemoteRead(){
        return !emMessage.isUnread();
    }
//
//    public int getFromClientType(){
//
//    }
//
//    public NIMAntiSpamOption getNIMAntiSpamOption(){
//
//    }
//
//    public void setNIMAntiSpamOption(NIMAntiSpamOption var1){
//
//    }

    public void setMessageStatusCallback(EMCallBack callback){
        emMessage.setMessageStatusCallback(callback);
    }

    public String getAccount(){
        return emMessage.getFrom();
    }

    public void setUuid(String uuid){
        emMessage.setMsgId(uuid);
    }

    public void setDirection(MsgDirectionEnum direction){
        emMessage.setDirection(MsgDirectionEnum.IMMessageMsgStatusEnumConvertToEMMessageMsgStatusEnum(direction));
    }

    public String getFrom(){
        return emMessage.getFrom();
    }

    public String getTo(){
        return emMessage.getTo();
    }

    public String getUserName(){//获取的是接收方的用户名
        return emMessage.getUserName();
    }
}
