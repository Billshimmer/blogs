package com.netease.nimlib.sdk.msg;

import com.netease.nimlib.sdk.Observer;
import com.netease.nimlib.sdk.msg.model.AttachmentProgress;
import com.netease.nimlib.sdk.msg.model.CustomNotification;
import com.netease.nimlib.sdk.msg.model.IMMessage;
import com.netease.nimlib.sdk.msg.model.MessageReceipt;
import com.netease.nimlib.sdk.msg.model.RecentContact;

import java.util.List;

/**
 * Created by dansejijie on 17/4/4.
 */

public interface MsgServiceObserve {
    void observeReceiveMessage(Observer<List<IMMessage>> var1, boolean var2);

    void observeMsgStatus(Observer<IMMessage> var1, boolean var2);

    void observeMessageReceipt(Observer<List<MessageReceipt>> var1, boolean var2);

    void observeAttachmentProgress(Observer<AttachmentProgress> var1, boolean var2);

    void observeRecentContact(Observer<List<RecentContact>> var1, boolean var2);

    void observeRecentContactDeleted(Observer<RecentContact> var1, boolean var2);

    void observeCustomNotification(Observer<CustomNotification> var1, boolean var2);

    void observeRevokeMessage(Observer<IMMessage> var1, boolean var2);
}
