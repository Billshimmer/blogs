package com.netease.nimlib.sdk.auth;

import com.netease.nimlib.sdk.AbortableFuture;
import com.netease.nimlib.sdk.InvocationFuture;

/**
 * Created by dansejijie on 17/4/15.
 */

public interface AuthService {
    AbortableFuture<LoginInfo> login(LoginInfo var1);

    void logout();

    InvocationFuture<Void> kickOtherClient(OnlineClient var1);

    int getKickedClientType();

    boolean openLocalCache(String var1);
}
