package com.netease.nimlib.sdk.msg.attachment;

import android.util.Log;

import com.hyphenate.chat.EMFileMessageBody;
import com.hyphenate.chat.EMLocationMessageBody;
import com.hyphenate.chat.EMMessageBody;
import com.hyphenate.chat.EMVoiceMessageBody;
import com.netease.nimlib.sdk.msg.model.IMMessage;

/**
 * Created by dansejijie on 17/4/4.
 */

public class AudioAttachment extends FileAttachment{


    public AudioAttachment(IMMessage var1) {
        super(var1);
    }

    public long getDuration() {
        return ((EMVoiceMessageBody)emMessageBody).getLength()*1000;
    }

    public void setDuration(long var1) {
        Log.e("TAG","unhandler");
    }



}
