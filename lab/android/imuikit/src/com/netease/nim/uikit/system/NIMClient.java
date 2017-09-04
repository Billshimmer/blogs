package com.netease.nim.uikit.system;

/**
 * Created by tygzx on 17/2/24.
 */

import com.hyphenate.EMMessageListener;
import com.hyphenate.chat.EMClient;
import com.hyphenate.chat.EMConversation;
import com.hyphenate.chat.EMMessage;
import com.hyphenate.exceptions.HyphenateException;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by zhengqiang on 2016/12/31.
 */

public class NIMClient {

    private static NIMClient instance;

    private NIMClient() {

    }

    public synchronized static NIMClient getInstance() {
        if (instance == null) {
            instance = new NIMClient();
        }
        return instance;
    }

    public synchronized static NIMClient getService(Class clazz) {
        if (instance == null) {
            instance = new NIMClient();
        }
        return instance;
    }

    public void sendMessage(IMMessage message, boolean b) {
        EMClient.getInstance().chatManager().sendMessage(message.getEMMessage());
    }

    public void deleteChattingHistory(IMMessage message) {
        EMClient.getInstance().chatManager().getConversation(message.getUserName()).removeMessage(message.getUuid());
    }

    public void sendMessageReceipt(String account, IMMessage message) {
        try{
            EMClient.getInstance().chatManager().ackMessageRead(account, message.getUuid());
        }catch (Exception e){

        }

    }

    public List<IMMessage> queryMessageListEx(IMMessage message, int pageSize, boolean b) {
        String userName = null;
        if (message.getDirect() == MsgDirectionEnum.In) {
            userName = message.getFrom();
        } else {
            userName = message.getTo();
        }
        EMConversation conversation = EMClient.getInstance().chatManager().getConversation(userName);

        List<IMMessage> messages1 = new ArrayList<>();
        if (conversation != null) {
            conversation.markAllMessagesAsRead();
            List<EMMessage> messages = conversation.loadMoreMsgFromDB(message.getMsgId(), pageSize);
            if (messages != null && messages.size() > 0) {
                for (int i = 0; i < messages.size(); i++) {
                    messages1.add(new IMMessage(messages.get(i)));
                }
            }
        }
        return messages1;
    }

    public void observeReceiveMessage(EMMessageListener incomingMessageObserver, boolean register) {
        if (register) {
            EMClient.getInstance().chatManager().addMessageListener(incomingMessageObserver);
        } else {
            EMClient.getInstance().chatManager().removeMessageListener(incomingMessageObserver);
        }
    }


    public static void queryMessageListByType(MsgTypeEnum type, String account, RequestCallback<List<EMMessage>> callback) {

        try {

            EMConversation conversation = EMClient.getInstance().chatManager().getConversation(account);
            List<EMMessage> msgs = new ArrayList<>();
            if (conversation != null) {
                List<EMMessage> temp = conversation.getAllMessages();
                if (temp != null && temp.size() > 0) {
                    for (int i = 0; i < temp.size(); i++) {
                        if (temp.get(i).getType() == type.getValue()) {
                            if (temp.get(i).status() == EMMessage.Status.SUCCESS) {
                                msgs.add(temp.get(i));
                            }

                        }
                    }
                    callback.onSuccess(msgs);
                } else {
                    callback.onFailed(0);
                }
            } else {
                callback.onFailed(0);
            }
        } catch (Exception e) {
            callback.onException(e);
        }
    }

    public static void downloadAttachment(IMMessage message,boolean b){

    }

}
