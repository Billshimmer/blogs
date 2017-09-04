package com.netease.nimlib.sdk.auth;

import java.io.Serializable;

/**
 * Created by dansejijie on 17/4/15.
 */

public interface OnlineClient extends Serializable {
    String getOs();

    int getClientType();

    long getLoginTime();

    String getClientIp();
}
