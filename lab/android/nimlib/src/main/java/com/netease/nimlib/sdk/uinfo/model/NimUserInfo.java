package com.netease.nimlib.sdk.uinfo.model;

import com.netease.nimlib.sdk.uinfo.UserInfoProvider;
import com.netease.nimlib.sdk.uinfo.constant.GenderEnum;

import java.util.Map;

/**
 * Created by dansejijie on 17/4/15.
 */


public interface NimUserInfo extends UserInfoProvider.UserInfo {
    String getSignature();

    GenderEnum getGenderEnum();

    String getEmail();

    String getBirthday();

    String getMobile();

    String getExtension();

    Map<String, Object> getExtensionMap();
}