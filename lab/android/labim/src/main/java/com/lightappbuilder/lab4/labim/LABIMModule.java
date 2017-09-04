package com.lightappbuilder.lab4.labim;

import android.text.TextUtils;
import android.util.Log;
import android.util.Pair;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.hyphenate.EMCallBack;
import com.hyphenate.EMMessageListener;
import com.hyphenate.chat.EMClient;
import com.hyphenate.chat.EMConversation;
import com.hyphenate.chat.EMMessage;
import com.lightappbuilder.lab4.lablibrary.utils.L;
import com.lightappbuilder.lab4.lablibrary.utils.RNArgumentsUtils;
import com.netease.nim.uikit.extra.easeui.controller.EaseUI;
import com.netease.nim.uikit.extra.easeui.utils.EaseCommonUtils;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

/**
 * Created by vice on 2016/7/28.
 */
public class LABIMModule extends ReactContextBaseJavaModule {
    private static final String TAG = "LABIMModule";

    private static final String MESSAGE_RECEIVED = "LAB_IM_MESSAGE_RECEIVED";//收到新消息
    private static final String LAB_IM_DISCONNECTED = "LAB_IM_DISCONNECTED";//退出登录事件数据
    private static final String LAB_IM_CONNECTED = "LAB_IM_CONNECTED";//登录事件

    private static ReactApplicationContext rac;

    /**
     * 断开连接
     */
    public static void onDisconnected(String type) {
        if (rac == null || !rac.hasActiveCatalystInstance()) {
            return;
        }

        EMClient.getInstance().logout(true, new EMCallBack() {
            @Override
            public void onSuccess() {
                Log.i(TAG,"logout by onDisconnected");
            }

            @Override
            public void onError(int i, String s) {
                L.d(TAG, "logout onError() called with code = ", i, ", message = ", s, "");
            }

            @Override
            public void onProgress(int i, String s) {
            }
        });

        WritableMap map = Arguments.createMap();
        map.putString("code", type);
        rac.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(LAB_IM_DISCONNECTED, map);


    }

    private EMMessageListener emMessageListener = new EMMessageListener() {
        @Override
        public void onMessageReceived(List<EMMessage> list) {
            getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(MESSAGE_RECEIVED, null);

//            for (EMMessage emMessage : list) {
//                if (emMessage.getType() == EMMessage.Type.IMAGE) {
//                    EMImageMessageBody body = (EMImageMessageBody) emMessage.getBody();
//                    Log.d(TAG, "onMessageReceived: xxx" + body.toString() + "secret" + body.getSecret() + "nailsecret" + body.getThumbnailSecret());
//                    ///storage/emulated/0/Android/data/com.lightappbuilder.lab4.test/35248620-0#etu/files/180/10000037/b182cdb0-682f-11e6-87c3-9b38f0cd8dee.png
//                } else if (emMessage.getType() == EMMessage.Type.VOICE) {
//                    EMVoiceMessageBody body = (EMVoiceMessageBody) emMessage.getBody();
//                    Log.d(TAG, "onMessageReceived: xxx" + body.toString());
//                }
//            }
        }

        @Override
        public void onCmdMessageReceived(List<EMMessage> list) {

        }

        @Override
        public void onMessageChanged(EMMessage emMessage, Object o) {

        }

        @Override
        public void onMessageDelivered(List<EMMessage> list) {

        }

        @Override
        public void onMessageRead(List<EMMessage> list) {

        }


    };

    public LABIMModule(ReactApplicationContext reactContext) {
        super(reactContext);

        rac = reactContext;

        reactContext.addLifecycleEventListener(new LifecycleEventListener() {
            @Override
            public void onHostResume() {
                EMClient.getInstance().chatManager().addMessageListener(emMessageListener);
                // cancel the notification TODO 目前简单处理
                EaseUI.getInstance().getNotifier().reset();
            }

            @Override
            public void onHostPause() {
                // TODO 进入后台之后要不要向js发送消息?
                EMClient.getInstance().chatManager().removeMessageListener(emMessageListener);
            }

            @Override
            public void onHostDestroy() {

            }
        });
    }

    @Override
    public String getName() {
        return "LABIMModule";
    }

    @ReactMethod
    public void init(final ReadableMap options) {
        if (options.hasKey("chatRecordUrl")) {
            IMConfig.chatRecordUrl = options.getString("chatRecordUrl");
        }
    }

    /**
     * 登录
     */
    @ReactMethod
    public void login(final ReadableMap options, final Callback callback) {
        final String userName = options.getString("imId");
        final String password = options.getString("password");

        //用户信息存在SharedPreferences,登出的时候手动设置为空
        //SharedPreferences var2 = android.preference.PreferenceManager.getDefaultSharedPreferences(getCurrentActivity());

        //String currentUser =var2.getString("easemob.chat.loginuser","");

        String currentUser = EMClient.getInstance().getCurrentUser();
        if (TextUtils.equals(currentUser, userName)&&EMClient.getInstance().isLoggedInBefore()&&EMClient.getInstance().isConnected()) {
            callback.invoke(null, "success");
        } else if (!TextUtils.isEmpty(currentUser)&&EMClient.getInstance().isLoggedInBefore()&&EMClient.getInstance().isConnected()) {
            EMClient.getInstance().logout(true, new EMCallBack() {

                @Override
                public void onSuccess() {
                    login(userName, password, callback);
                }

                @Override
                public void onProgress(int progress, String status) {

                }

                @Override
                public void onError(int code, String message) {
                    L.d(TAG, "logout onError() called with code = ", code, ", message = ", message, "");
                    callback.invoke(RNArgumentsUtils.createMap(Integer.toString(code), message));
                }
            });
        } else {
            login(userName, password, callback);
        }

    }

    private void login(String userName, String password, final Callback callback) {
        EMClient.getInstance().login(userName, password, new EMCallBack() {
            @Override
            public void onSuccess() {
                L.d(TAG, "login success");
                EMClient.getInstance().groupManager().loadAllGroups();
                EMClient.getInstance().chatManager().loadAllConversations();
                callback.invoke(null, "success");
            }

            @Override
            public void onProgress(int progress, String status) {

            }

            @Override
            public void onError(int code, String message) {
                L.d(TAG, "login onError() called with code = ", code, ", message = ", message, "");

                callback.invoke(RNArgumentsUtils.createMap(Integer.toString(code), message));
            }
        });
    }

    /**
     * 退出登录
     */
    @ReactMethod
    public void logout(final Callback callback) {
        EMClient.getInstance().logout(true, new EMCallBack() {

            @Override
            public void onSuccess() {
                L.d(TAG, "logout onSuccess() called with ");
                callback.invoke(null, "logoutSuccess");

            }

            @Override
            public void onProgress(int progress, String status) {

            }

            @Override
            public void onError(int code, String message) {
                L.d(TAG, "logout onError() called with code = ", code, ", message = ", message, "");
                WritableMap errorMap = Arguments.createMap();
                errorMap.putInt("code", code);
                errorMap.putString("message", message);
                callback.invoke(errorMap);
            }
        });

    }

    /**
     * 获取消息列表
     */
    @ReactMethod
    public void getConversationList(final Callback callback) {
        final WritableArray conversationArray = Arguments.createArray();

        //按时间排序
        List<Pair<Long, EMConversation>> sortList = new ArrayList<Pair<Long, EMConversation>>();
        Map<String, EMConversation> allConversations = EMClient.getInstance().chatManager().getAllConversations();

        for (EMConversation conversation : allConversations.values()) {
            if (conversation.getAllMessages().size() != 0) {
                sortList.add(new Pair<Long, EMConversation>(conversation.getLastMessage().getMsgTime(), conversation));
            }
        }
        try {
            // Internal is TimSort algorithm, has bug
            sortConversationByLastChatTime(sortList);
        } catch (Exception e) {
            e.printStackTrace();
        }
        List<EMConversation> list = new ArrayList<EMConversation>();
        for (Pair<Long, EMConversation> sortItem : sortList) {
            list.add(sortItem.second);
        }

        StringBuffer tempBuffer = new StringBuffer();
        for (EMConversation emConversation : list) {
            if (emConversation.getAllMessages().size() != 0) {

                int unreadMsgCount;
                double timestamp = 0;
                String lastMsgContent = "";
                String userName;

                EMMessage lastMessage = emConversation.getLastMessage();
                //对方名字
                //userName = emConversation.getUserName();
                userName =emConversation.getLastMessage().getUserName();
                //未读消息数
                unreadMsgCount = emConversation.getUnreadMsgCount();
                //最新消息的时间
                timestamp = lastMessage.getMsgTime();
                lastMsgContent = EaseCommonUtils.getMessageDigest(lastMessage, getReactApplicationContext());
                if (lastMsgContent.length() > 20) {
                    lastMsgContent = lastMsgContent.substring(0, 20) + "...";
                }

                //替换
                tempBuffer.setLength(0);
                EmojiHelper.convertToSystemEmoticons(lastMsgContent, tempBuffer);
                lastMsgContent = tempBuffer.toString();

                WritableMap conversationMap = Arguments.createMap();
                conversationMap.putString("imId", userName);
                conversationMap.putString("unreadMsgCount", unreadMsgCount + "");
                conversationMap.putDouble("timestamp", timestamp);
                conversationMap.putString("lastMsgContent", lastMsgContent);

                conversationArray.pushMap(conversationMap);
                //Log.v("message==", "lastMsgContent" + lastMsgContent + ";;;unReadMessageCount" + unreadMsgCount + ";;;timestamp" + timestamp + ";;;imId" + userName);
            }
        }

        callback.invoke(null, conversationArray);
    }

    private void sortConversationByLastChatTime(List<Pair<Long, EMConversation>> conversationList) {
        Collections.sort(conversationList, new Comparator<Pair<Long, EMConversation>>() {
            @Override
            public int compare(final Pair<Long, EMConversation> con1, final Pair<Long, EMConversation> con2) {

                if (con1.first == con2.first) {
                    return 0;
                } else if (con2.first > con1.first) {
                    return 1;
                } else {
                    return -1;
                }
            }

        });
    }

    /**
     * 获取总的未读消息数
     */
    @ReactMethod
    public void getUnreadMessagesCount(final Callback callback) {
        int unreadMsgsCount = EMClient.getInstance().chatManager().getUnreadMsgsCount();
        callback.invoke(null, unreadMsgsCount);
    }

    /**
     * 获取当前IM登录用户的信息
     */
    @ReactMethod
    public void getCurrentUser(final Callback callback) {
        String currentUser = EMClient.getInstance().getCurrentUser();
        if (!EMClient.getInstance().isLoggedInBefore()){
            currentUser="";
        }
        WritableMap map = null;
        if (!TextUtils.isEmpty(currentUser)) {
            map = Arguments.createMap();
            map.putString("imId", currentUser);
        }
        callback.invoke(null, map);
    }
}