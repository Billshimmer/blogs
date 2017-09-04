package com.netease.nimlib.sdk;

import com.netease.nimlib.sdk.msg.MessageNotifierCustomization;
import com.netease.nimlib.sdk.uinfo.UserInfoProvider;

/**
 * Created by dansejijie on 17/4/8.
 */

public class SDKOptions {
    public static final SDKOptions DEFAULT = new SDKOptions();
    public String appKey;
    public StatusBarNotificationConfig statusBarNotificationConfig;
    public UserInfoProvider userInfoProvider;
    public MessageNotifierCustomization messageNotifierCustomization;
    public String sdkStorageRootPath;
    public String databaseEncryptKey;
    public boolean preloadAttach = true;
    public int thumbnailSize = 350;
    public boolean sessionReadAck = false;
    public boolean improveSDKProcessPriority = true;
    public ServerAddresses serverConfig;
    public boolean preLoadServers = true;

    public SDKOptions() {
    }
}