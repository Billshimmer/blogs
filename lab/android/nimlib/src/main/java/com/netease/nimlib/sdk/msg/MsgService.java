package com.netease.nimlib.sdk.msg;

import com.netease.nimlib.sdk.AbortableFuture;
import com.netease.nimlib.sdk.InvocationFuture;
import com.netease.nimlib.sdk.msg.attachment.MsgAttachmentParser;
import com.netease.nimlib.sdk.msg.constant.MsgTypeEnum;
import com.netease.nimlib.sdk.msg.constant.SessionTypeEnum;
import com.netease.nimlib.sdk.msg.model.CustomNotification;
import com.netease.nimlib.sdk.msg.model.IMMessage;
import com.netease.nimlib.sdk.msg.model.QueryDirectionEnum;
import com.netease.nimlib.sdk.msg.model.RecentContact;
import com.netease.nimlib.sdk.search.model.MsgIndexRecord;
import com.netease.nimlib.sdk.team.model.IMMessageFilter;

import java.util.List;

/**
 * Created by dansejijie on 17/4/4.
 */


public interface MsgService {

    String MSG_CHATTING_ACCOUNT_ALL = "all";
    String MSG_CHATTING_ACCOUNT_NONE = null;

    InvocationFuture<Void> sendMessage(IMMessage var1, boolean var2);

    InvocationFuture<Void> saveMessageToLocal(IMMessage var1, boolean var2);

    InvocationFuture<Void> saveMessageToLocalEx(IMMessage var1, boolean var2, long var3);

    AbortableFuture<Void> downloadAttachment(IMMessage var1, boolean var2);

    List<IMMessage> queryMessageListByUuidBlock(List<String> var1);

    InvocationFuture<List<IMMessage>> queryMessageListByUuid(List<String> var1);

    InvocationFuture<List<IMMessage>> queryMessageListByType(MsgTypeEnum var1, IMMessage var2, int var3);

    InvocationFuture<List<IMMessage>> queryMessageList(String var1, SessionTypeEnum var2, long var3, int var5);

    InvocationFuture<List<IMMessage>> queryMessageListEx(IMMessage var1, QueryDirectionEnum var2, int var3, boolean var4);

    InvocationFuture<List<IMMessage>> queryMessageListExTime(IMMessage var1, long var2, QueryDirectionEnum var4, int var5);

    InvocationFuture<List<IMMessage>> pullMessageHistory(IMMessage var1, int var2, boolean var3);

    InvocationFuture<List<IMMessage>> pullMessageHistoryEx(IMMessage var1, long var2, int var4, QueryDirectionEnum var5, boolean var6);

    InvocationFuture<List<IMMessage>> searchMessageHistory(String var1, List<String> var2, IMMessage var3, int var4);

    InvocationFuture<List<IMMessage>> searchAllMessageHistory(String var1, List<String> var2, long var3, int var5);

    InvocationFuture<List<MsgIndexRecord>> searchAllSession(String var1, int var2);

    List<MsgIndexRecord> searchAllSessionBlock(String var1, int var2);

    InvocationFuture<List<MsgIndexRecord>> searchSession(String var1, SessionTypeEnum var2, String var3);

    List<MsgIndexRecord> searchSessionBlock(String var1, SessionTypeEnum var2, String var3);

    void deleteChattingHistory(IMMessage var1);

    void clearChattingHistory(String var1, SessionTypeEnum var2);

    void clearMsgDatabase(boolean var1);

    void setChattingAccount(String var1, SessionTypeEnum var2);

    int getTotalUnreadCount();

    void clearUnreadCount(String var1, SessionTypeEnum var2);

    InvocationFuture<Void> sendMessageReceipt(String var1, IMMessage var2);

    void updateIMMessageStatus(IMMessage var1);

    void updateIMMessage(IMMessage var1);

    void registerCustomAttachmentParser(MsgAttachmentParser var1);

    InvocationFuture<Void> sendCustomNotification(CustomNotification var1);

    InvocationFuture<List<RecentContact>> queryRecentContacts();

    List<RecentContact> queryRecentContactsBlock();

    void updateRecent(RecentContact var1);

    void deleteRecentContact(RecentContact var1);

    void deleteRecentContact2(String var1, SessionTypeEnum var2);

    InvocationFuture<Void> deleteRoamingRecentContact(String var1, SessionTypeEnum var2);

    AbortableFuture<String> transVoiceToText(String var1, String var2, long var3);

    void registerIMMessageFilter(IMMessageFilter var1);

    InvocationFuture<Void> revokeMessage(IMMessage var1);
}
