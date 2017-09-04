package com.lightappbuilder.lab4.labim.nim;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.graphics.Color;
import android.os.Environment;
import android.text.TextUtils;
import android.widget.Toast;

import com.facebook.drawee.backends.pipeline.Fresco;
import com.hyphenate.chat.EMClient;
import com.hyphenate.chat.EMOptions;
import com.netease.nim.uikit.NimUIKit;
import com.netease.nim.uikit.cache.DataCacheManager;
import com.netease.nim.uikit.contact.core.query.PinYin;
import com.netease.nim.uikit.custom.DefalutUserInfoProvider;
import com.netease.nim.uikit.extra.session.activity.EMImageLoadHelper;
import com.netease.nim.uikit.session.SessionEventListener;
import com.netease.nim.uikit.session.activity.P2PMessageActivity;
import com.netease.nim.uikit.session.viewholder.MsgViewHolderThumbBase;
import com.netease.nimlib.sdk.NIMClient;
import com.netease.nimlib.sdk.NimStrings;
import com.netease.nimlib.sdk.SDKOptions;
import com.netease.nimlib.sdk.StatusBarNotificationConfig;
import com.netease.nimlib.sdk.auth.LoginInfo;
import com.netease.nimlib.sdk.msg.MessageNotifierCustomization;
import com.netease.nimlib.sdk.msg.model.IMMessage;

/**
 * Created by tygzx on 17/5/24.
 */

public class NIMApplication {

    private static Context mInstance;

    public static void init(Context context){
        //        Thread.setDefaultUncaughtExceptionHandler(new CrashHandler());
        mInstance=context;
        DemoCache.setContext(context);
        // 注册小米推送appID 、appKey 以及在云信管理后台添加的小米推送证书名称，该逻辑放在 NIMClient init 之前
        //NIMPushClient.registerMiPush(this, "DEMO_MI_PUSH", "2882303761517502883", "5671750254883");
        // 注册自定义小米推送消息处理，这个是可选项
        //NIMPushClient.registerMixPushMessageHandler(new DemoMixPushMessageHandler());
        NIMClient.init(context, getLoginInfo(), getOptions());
//        ExtraOptions.provide();
        // crash handler
        //AppCrashHandler.getInstance(context);

        if (inMainProcess()) {

            EMImageLoadHelper.init(context);
            Fresco.initialize(context);

            //环信


            EMOptions options=new EMOptions();
            EMClient.getInstance().init(context, options);

            EMClient.getInstance().setDebugMode(true);
            //end

            // init pinyin
            PinYin.init(context);
            PinYin.validate();

            // 初始化UIKit模块
            initUIKit();

            // 注册通知消息过滤器
            registerIMMessageFilter();

            // 初始化消息提醒
            NIMClient.toggleNotification(UserPreferences.getNotificationToggle());

            // 注册网络通话来电
            enableAVChat();

            // 注册白板会话
            enableRTS();

            // 注册语言变化监听
            registerLocaleReceiver(true);
        }
    }

    private static LoginInfo getLoginInfo() {
        String account = Preferences.getUserAccount();
        String token = Preferences.getUserToken();

        if (!TextUtils.isEmpty(account) && !TextUtils.isEmpty(token)) {
            DemoCache.setAccount(account.toLowerCase());
            return new LoginInfo(account, token);
        } else {
            return null;
        }
    }

    private static SDKOptions getOptions() {
        SDKOptions options = new SDKOptions();

        // 如果将新消息通知提醒托管给SDK完成，需要添加以下配置。
        initStatusBarNotificationConfig(options);

        // 配置保存图片，文件，log等数据的目录
        String sdkPath = Environment.getExternalStorageDirectory() + "/" + mInstance.getPackageName() + "/nim";
        options.sdkStorageRootPath = sdkPath;

        // 配置数据库加密秘钥
        options.databaseEncryptKey = "NETEASE";

        // 配置是否需要预下载附件缩略图
        options.preloadAttach = true;

        // 配置附件缩略图的尺寸大小，
        options.thumbnailSize = MsgViewHolderThumbBase.getImageMaxEdge();

        // 用户信息提供者
        options.userInfoProvider = new DefalutUserInfoProvider(mInstance);

        // 定制通知栏提醒文案（可选，如果不定制将采用SDK默认文案）
        options.messageNotifierCustomization = messageNotifierCustomization;

        // 在线多端同步未读数
        options.sessionReadAck = true;

        return options;
    }

    private static void initStatusBarNotificationConfig(SDKOptions options) {
        // load 应用的状态栏配置
        StatusBarNotificationConfig config = loadStatusBarNotificationConfig();

        // load 用户的 StatusBarNotificationConfig 设置项
        StatusBarNotificationConfig userConfig = UserPreferences.getStatusConfig();
        if (userConfig == null) {
            userConfig = config;
        } else {
            // 新增的 UserPreferences 存储项更新，兼容 3.4 及以前版本
            // APP默认 StatusBarNotificationConfig 配置修改后，使其生效
            userConfig.notificationEntrance = config.notificationEntrance;
            userConfig.notificationFolded = config.notificationFolded;
        }
        // 持久化生效
        UserPreferences.setStatusConfig(config);
        // SDK statusBarNotificationConfig 生效
        options.statusBarNotificationConfig = userConfig;
    }

    // 这里开发者可以自定义该应用初始的 StatusBarNotificationConfig
    private static StatusBarNotificationConfig loadStatusBarNotificationConfig() {
        StatusBarNotificationConfig config = new StatusBarNotificationConfig();
        // 点击通知需要跳转到的界面
        config.notificationEntrance = P2PMessageActivity.class;
        config.notificationSmallIconId = com.netease.nim.uikit.R.drawable.nim_emoji_icon;

        // 通知铃声的uri字符串
        config.notificationSound = "android.resource://com.netease.nim.demo/raw/msg";

        // 呼吸灯配置
        config.ledARGB = Color.GREEN;
        config.ledOnMs = 1000;
        config.ledOffMs = 1500;

        // save cache，留做切换账号备用
        DemoCache.setNotificationConfig(config);
        return config;
    }


    public static boolean inMainProcess() {
        String packageName = mInstance.getPackageName();
        String processName = SystemUtil.getProcessName(mInstance);
        return packageName.equals(processName);
    }

    /**
     * 通知消息过滤器（如果过滤则该消息不存储不上报）
     */
    private static void registerIMMessageFilter() {
//        NIMClient.getService(MsgService.class).registerIMMessageFilter(new IMMessageFilter() {
//            @Override
//            public boolean shouldIgnore(IMMessage message) {
//                if (UserPreferences.getMsgIgnore() && message.getAttachment() != null) {
//                    if (message.getAttachment() instanceof UpdateTeamAttachment) {
//                        UpdateTeamAttachment attachment = (UpdateTeamAttachment) message.getAttachment();
//                        for (Map.Entry<TeamFieldEnum, Object> field : attachment.getUpdatedFields().entrySet()) {
//                            if (field.getKey() == TeamFieldEnum.ICON) {
//                                return true;
//                            }
//                        }
//                    } else if (message.getAttachment() instanceof AVChatAttachment) {
//                        return true;
//                    }
//                }
//                return false;
//            }
//        });
    }

    /**
     * 音视频通话配置与监听
     */
    private static void enableAVChat() {
        registerAVChatIncomingCallObserver(true);
    }

    private static void registerAVChatIncomingCallObserver(boolean register) {
//        AVChatManager.getInstance().observeIncomingCall(new Observer<AVChatData>() {
//            @Override
//            public void onEvent(AVChatData data) {
//                String extra = data.getExtra();
//                Log.e("Extra", "Extra Message->" + extra);
//                if (PhoneCallStateObserver.getInstance().getPhoneCallState() != PhoneCallStateObserver.PhoneCallStateEnum.IDLE) {
//                    LogUtil.i(TAG, "reject incoming call data =" + data.toString() + " as local phone is not idle");
//                    AVChatManager.getInstance().sendControlCommand(AVChatControlCommand.BUSY, null);
//                    return;
//                }
//                // 有网络来电打开AVChatActivity
//                AVChatProfile.getInstance().setAVChatting(true);
//                AVChatActivity.launch(DemoCache.getContext(), data, AVChatActivity.FROM_BROADCASTRECEIVER);
//            }
//        }, register);
    }

    /**
     * 白板实时时会话配置与监听
     */
    private static void enableRTS() {
        registerRTSIncomingObserver(true);
    }


    private static void registerRTSIncomingObserver(boolean register) {
//        RTSManager.getInstance().observeIncomingSession(new Observer<RTSData>() {
//            @Override
//            public void onEvent(RTSData rtsData) {
//                RTSActivity.incomingSession(DemoCache.getContext(), rtsData, RTSActivity.FROM_BROADCAST_RECEIVER);
//            }
//        }, register);
    }

    private static void registerLocaleReceiver(boolean register) {
        if (register) {
            updateLocale();
            IntentFilter filter = new IntentFilter(Intent.ACTION_LOCALE_CHANGED);
            mInstance.registerReceiver(localeReceiver, filter);
        } else {
            mInstance.unregisterReceiver(localeReceiver);
        }
    }

    private static BroadcastReceiver localeReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            if (intent.getAction().equals(Intent.ACTION_LOCALE_CHANGED)) {
                updateLocale();
            }
        }
    };

    private static void updateLocale() {
        NimStrings strings = new NimStrings();
//        strings.status_bar_multi_messages_incoming = getString(R.string.nim_status_bar_multi_messages_incoming);
//        strings.status_bar_image_message = getString(R.string.nim_status_bar_image_message);
//        strings.status_bar_audio_message = getString(R.string.nim_status_bar_audio_message);
//        strings.status_bar_custom_message = getString(R.string.nim_status_bar_custom_message);
//        strings.status_bar_file_message = getString(R.string.nim_status_bar_file_message);
//        strings.status_bar_location_message = getString(R.string.nim_status_bar_location_message);
//        strings.status_bar_notification_message = getString(R.string.nim_status_bar_notification_message);
//        strings.status_bar_ticker_text = getString(R.string.nim_status_bar_ticker_text);
//        strings.status_bar_unsupported_message = getString(R.string.nim_status_bar_unsupported_message);
//        strings.status_bar_video_message = getString(R.string.nim_status_bar_video_message);
//        strings.status_bar_hidden_message_content = getString(R.string.nim_status_bar_hidden_msg_content);
        NIMClient.updateStrings(strings);
    }

    private static void initUIKit() {
        // 初始化，使用 uikit 默认的用户信息提供者
        NimUIKit.init(mInstance);

        // 设置地理位置提供者。如果需要发送地理位置消息，该参数必须提供。如果不需要，可以忽略。
//        NimUIKit.setLocationProvider(new NimDemoLocationProvider());
//
//        // 会话窗口的定制初始化。
//        SessionHelper.init();

//        SessionEventListener listener = new SessionEventListener() {
//            @Override
//            public void onAvatarClicked(Context context, IMMessage message) {
//                // 一般用于打开用户资料页面
//                Toast.makeText(context,message.getFrom(),Toast.LENGTH_LONG).show();
//            }
//
//            @Override
//            public void onAvatarLongClicked(Context context, IMMessage message) {
//                // 一般用于群组@功能，或者弹出菜单，做拉黑，加好友等功能
//            }
//        };
//
//        NimUIKit.setSessionListener(listener);


        // 通讯录列表定制初始化
//        ContactHelper.init();

        // 添加自定义推送文案以及选项，请开发者在各端（Android、IOS、PC、Web）消息发送时保持一致，以免出现通知不一致的情况
        // NimUIKit.CustomPushContentProvider(new DemoPushContentProvider());
    }


    private static MessageNotifierCustomization messageNotifierCustomization = new MessageNotifierCustomization() {
        @Override
        public String makeNotifyContent(String nick, IMMessage message) {
            return null; // 采用SDK默认文案
        }

        @Override
        public String makeTicker(String nick, IMMessage message) {
            return null; // 采用SDK默认文案
        }
    };
}
