package com.netease.nimlib.sdk.team.model;

import com.netease.nimlib.sdk.msg.model.IMMessage;

/**
 * Created by dansejijie on 17/4/4.
 */

public interface IMMessageFilter {
    boolean shouldIgnore(IMMessage var1);
}
