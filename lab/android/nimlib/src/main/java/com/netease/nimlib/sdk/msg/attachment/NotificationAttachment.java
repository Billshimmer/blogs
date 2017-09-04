package com.netease.nimlib.sdk.msg.attachment;

import com.hyphenate.chat.EMMessageBody;
import com.netease.nimlib.sdk.msg.constant.NotificationType;
import com.netease.nimlib.sdk.msg.model.IMMessage;

/**
 * Created by dansejijie on 17/4/4.
 */

public class NotificationAttachment extends MsgAttachment{

    private NotificationType type;


    public NotificationAttachment(IMMessage imMessage){
        super(imMessage);
    }

    public NotificationType getType() {
        return this.type;
    }
}
