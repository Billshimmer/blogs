package com.netease.nimlib.sdk.uinfo;

import com.netease.nimlib.sdk.Observer;
import com.netease.nimlib.sdk.uinfo.model.NimUserInfo;

import java.util.List;

/**
 * Created by dansejijie on 17/4/15.
 */

public interface UserServiceObserve {
    void observeUserInfoUpdate(Observer<List<NimUserInfo>> var1, boolean var2);
}

