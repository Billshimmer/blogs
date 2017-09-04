package com.netease.nimlib.sdk.auth;

import com.netease.nimlib.sdk.Observer;
import com.netease.nimlib.sdk.StatusCode;
import com.netease.nimlib.sdk.auth.constant.LoginSyncStatus;

import java.util.List;

/**
 * Created by dansejijie on 17/4/15.
 */

public interface AuthServiceObserver {
    void observeOnlineStatus(Observer<StatusCode> var1, boolean var2);

    void observeOtherClients(Observer<List<OnlineClient>> var1, boolean var2);

    void observeLoginSyncDataStatus(Observer<LoginSyncStatus> var1, boolean var2);
}
