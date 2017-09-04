package com.netease.nimlib.sdk.msg.attachment;

import android.util.Log;

import com.hyphenate.chat.EMLocationMessageBody;
import com.hyphenate.chat.EMMessageBody;
import com.netease.nimlib.sdk.msg.model.IMMessage;

/**
 * Created by dansejijie on 17/4/4.
 */

public class LocationAttachment  extends MsgAttachment{

    public LocationAttachment(IMMessage imMessage){
        super(imMessage);
    }

    public double getLatitude() {
        return ((EMLocationMessageBody)emMessageBody).getLatitude();
    }

    public void setLatitude(double var1) {
        Log.e("TAG","unhandler");
    }

    public double getLongitude() {
        return ((EMLocationMessageBody)emMessageBody).getLongitude();
    }

    public void setLongitude(double var1) {
        Log.e("TAG","unhandler");
    }

    public String getAddress() {
        return ((EMLocationMessageBody)emMessageBody).getAddress();
    }

    public void setAddress(String var1) {
        Log.e("TAG","unhandler");
    }
}
