package com.netease.nimlib.sdk.msg.attachment;
import com.hyphenate.chat.EMMessageBody;
import com.netease.nimlib.sdk.msg.model.IMMessage;

import java.io.Serializable;

/**
 * Created by dansejijie on 17/4/4.
 */

public class MsgAttachment{
    EMMessageBody emMessageBody;
    IMMessage imMessage;

    public MsgAttachment(IMMessage imMessage){
        this.imMessage=imMessage;
        this.emMessageBody=imMessage.getEMMessage().getBody();
    }

    public void setEMMessageBody(EMMessageBody emMessageBody){
        this.emMessageBody=emMessageBody;
    }

    public EMMessageBody getEMMessageBody(){
        return emMessageBody;
    }
}

