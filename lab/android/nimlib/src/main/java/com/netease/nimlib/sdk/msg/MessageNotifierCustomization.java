package com.netease.nimlib.sdk.msg;

import com.netease.nimlib.sdk.msg.model.IMMessage;

/**
 * Created by dansejijie on 17/4/8.
 */


public interface MessageNotifierCustomization {
    String makeNotifyContent(String var1, IMMessage var2);

    String makeTicker(String var1, IMMessage var2);
}