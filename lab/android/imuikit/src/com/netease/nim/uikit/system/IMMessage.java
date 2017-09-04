package com.netease.nim.uikit.system;

import com.hyphenate.EMCallBack;
import com.hyphenate.chat.EMMessage;
import com.hyphenate.chat.EMMessageBody;
import com.hyphenate.chat.EMTextMessageBody;

import java.io.Serializable;

/**
 * Created by zhengqiang on 2016/12/31.
 */

public class IMMessage implements Serializable {

    private EMMessage message;

    public IMMessage(EMMessage emMessage) {
        message = emMessage;
    }

    public boolean isTheSame(IMMessage imMessage) {
        return this.getMsgId().equals(imMessage.getMsgId());
    }

    public String getMsgId() {
        return message.getMsgId();
    }

    public void setUuid(String uuid) {
        message.setMsgId(uuid);
    }

    public String getUuid() {
        return message.getMsgId();
    }

    public long getTime() {
        return message.localTime();
    }

    public SessionTypeEnum getSessionType() {
        return SessionTypeEnum.typeOfValue(message.getChatType());
    }

    public String getSessionId() {
        //Log.i("个人测试:","getSessionId到底是username还是from还是to有待考证，目前理解是to");
        if (message.direct() == EMMessage.Direct.RECEIVE) {
            return message.getFrom();
        } else {
            return message.getTo();
        }

    }

    public void setUnRead(boolean b) {
        message.setUnread(b);
    }

    public MsgDirectionEnum getDirect() {
        return MsgDirectionEnum.directionOfValue(message.direct());
    }

    public EMMessageBody getAttachment() {
        return message.getBody();
    }

    public MsgStatusEnum getStatus() {
        return MsgStatusEnum.statusOfValue(message.status());
    }

    public void setStatus(MsgStatusEnum status) {
        message.setStatus(status.getValue());
    }

    public MsgTypeEnum getMsgType() {
        return MsgTypeEnum.typeOfValue(message.getType());
    }

    public String getFromAccount() {
        return message.getFrom();
    }

    public String getContent() {
        return ((EMTextMessageBody) message.getBody()).getMessage();
    }

    /*public void setAttachStatus(EMFileMessageBody.EMDownloadStatus status){

    }*/
    public EMMessage getEMMessage() {
        return message;
    }

    public void addBody(EMMessageBody messageBody) {
        message.addBody(messageBody);
    }

    public MsgTypeEnum getType() {
        return MsgTypeEnum.typeOfValue(message.getType());
    }

    public boolean isUnread() {
        return message.isUnread();
    }

    public String getUserName() {
        return message.getUserName();
    }

    public String getFrom() {
        return message.getFrom();
    }

    public String getTo() {
        return message.getTo();
    }

    public void setDirection(MsgDirectionEnum msgDirectionEnum) {
        message.setDirection(msgDirectionEnum.getValue());
    }

    public void setAcked(boolean b) {
        message.setAcked(b);
    }

    public void setMessageStatusCallback(EMCallBack callBack) {
        message.setMessageStatusCallback(callBack);

    }
    public void setFrom(String from){
        message.setFrom(from);
    }

    public void setMsgId(String id){
        message.setMsgId(id);
    }
}
