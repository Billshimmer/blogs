package com.netease.nimlib.sdk.msg.attachment;

import android.util.Log;

import com.hyphenate.chat.EMMessageBody;
import com.hyphenate.chat.EMVideoMessageBody;
import com.netease.nimlib.sdk.msg.model.IMMessage;

/**
 * Created by dansejijie on 17/4/4.
 */

public class VideoAttachment extends FileAttachment{

    public VideoAttachment(IMMessage imMessage){
        super(imMessage);
    }

    public int getWidth() {
        Log.e("TAG","unhanler");
        return 100;
    }

    public void setWidth(int var1) {
        Log.e("TAG","unhanler");
    }

    public int getHeight() {
        return 100;
    }

    public void setHeight(int var1) {
        Log.e("TAG","unhanler");
    }

    public long getDuration() {
        return 100;
    }

    public void setDuration(long var1) {
        Log.e("TAG","unhanler");
    }
}
