package com.netease.nimlib.sdk.uinfo;

import com.netease.nimlib.sdk.InvocationFuture;
import com.netease.nimlib.sdk.uinfo.constant.UserInfoFieldEnum;
import com.netease.nimlib.sdk.uinfo.model.NimUserInfo;

import java.util.List;
import java.util.Map;

/**
 * Created by dansejijie on 17/4/15.
 */

public interface UserService {
    InvocationFuture<List<NimUserInfo>> fetchUserInfo(List<String> var1);

    List<NimUserInfo> getUserInfoList(List<String> var1);

    NimUserInfo getUserInfo(String var1);

    List<NimUserInfo> getAllUserInfo();

    InvocationFuture<Void> updateUserInfo(Map<UserInfoFieldEnum, Object> var1);

    InvocationFuture<Void> setUserState(int var1);
}
