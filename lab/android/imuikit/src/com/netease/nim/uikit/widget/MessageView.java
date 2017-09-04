package com.netease.nim.uikit.widget;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.media.AudioManager;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import com.hyphenate.EMMessageListener;
import com.hyphenate.chat.EMClient;
import com.hyphenate.chat.EMMessage;
import com.netease.nim.uikit.R;
import com.netease.nim.uikit.actions.BaseAction;
import com.netease.nim.uikit.actions.ImageAction;
import com.netease.nim.uikit.common.http.MessageRemoteLoader;
import com.netease.nim.uikit.common.util.MessageUtil;
import com.netease.nim.uikit.module.Container;
import com.netease.nim.uikit.module.input.InputPanel;
import com.netease.nim.uikit.module.list.MessageListPanel;
import com.netease.nim.uikit.module.ModuleProxy;
import com.netease.nim.uikit.constant.Extras;
import com.netease.nim.uikit.system.IMMessage;
import com.netease.nim.uikit.system.MsgStatusEnum;
import com.netease.nim.uikit.system.NIMClient;
import com.netease.nim.uikit.system.NimUIKit;
import com.netease.nim.uikit.system.SessionCustomization;
import com.netease.nim.uikit.system.SessionTypeEnum;
import com.netease.nim.uikit.userinfo.LABUserInfo;
import com.netease.nim.uikit.userinfo.UserInfoProvider;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Created by zhengqiang on 2017/1/1.
 */
public class MessageView extends TView implements ModuleProxy, EMMessageListener {
    private static final String TAG = "MessageView";

    /**
     * NOTE context需要activity
     */
    public MessageView(Context context) {
        super(context);
        LayoutInflater.from(context).inflate(R.layout.nim_message_view, this);
        rootView = getChildAt(0);
    }

    private View rootView;
    private SessionCustomization customization;
    // 聊天对象
    protected String sessionId; // p2p对方Account或者群id
    protected String myNickName;
    protected String myAvator;
    protected String toAvator;
    protected String toNickName;
    protected SessionTypeEnum sessionType;

    // modules
    protected InputPanel inputPanel;
    protected MessageListPanel messageListPanel;

    private Bundle arguments;

    /*public interface AvatarClickListener {
        void onAvatarClicked(String username);
    }

    public AvatarClickListener avatarClickListener;

    public void setAvatarClickListener(AvatarClickListener avatarClickListener) {
        this.avatarClickListener = avatarClickListener;
    }

    SessionEventListener sessionEventListener = new SessionEventListener() {
        @Override
        public void onAvatarClicked(Context context, IMMessage message) {
            if (avatarClickListener != null) {
                avatarClickListener.onAvatarClicked(message.getFrom());
            }
        }

        @Override
        public void onAvatarLongClicked(Context context, IMMessage message) {

        }
    };*/

    public void setArguments(Bundle bundle) {
        arguments = bundle;
        parseIntent();

    }

    private Bundle getArguments() {
        return arguments;
    }

    public void onPause() {

        if (inputPanel!=null){
            inputPanel.onPause();
        }

        if (messageListPanel!=null){
            messageListPanel.onPause();
        }
    }

    public void onResume() {
        if (messageListPanel!=null){
            messageListPanel.onResume();
        }

        ((Activity) getContext()).setVolumeControlStream(AudioManager.STREAM_VOICE_CALL); // 默认使用听筒播放
    }

    @Override
    public void onDestroy() {
        if (isDestroyed()) {
            return;
        }
        super.onDestroy();
        if (messageListPanel!=null){
            messageListPanel.onDestroy();
        }

        registerObservers(false);
    }

    public boolean onBackPressed() {
        if (inputPanel.collapse(true)) {
            return true;
        }

        if (messageListPanel.onBackPressed()) {
            return true;
        }
        return false;
    }



    /*********************************
     * 以上是需要对Activity提供的事件
     ***********************************************/

    public void refreshMessageList() {
        messageListPanel.refreshMessageList();
    }

    protected void parseIntent() {
        sessionId = getArguments().getString(Extras.EXTRA_TOIMID);
        toNickName = getArguments().getString(Extras.EXTRA_TONICKNAME, null);
        toAvator = getArguments().getString(Extras.EXTRA_TOAVATOR, null);
        myNickName = getArguments().getString(Extras.EXTRA_MYNICKNAME, null);
        myAvator = getArguments().getString(Extras.EXTRA_MYAVATOR, null);


        UserInfoProvider userInfoProvider = NimUIKit.getUserInfoProvider();
        userInfoProvider.todo(Arrays.asList((UserInfoProvider.UserInfo) (new LABUserInfo(EMClient.getInstance().getCurrentUser(), myNickName, myAvator)),
                                            (UserInfoProvider.UserInfo) (new LABUserInfo(sessionId, toNickName, toAvator))));
        sessionType = SessionTypeEnum.P2P;
        IMMessage anchor = (IMMessage) getArguments().getSerializable(Extras.EXTRA_ANCHOR);
        customization = (SessionCustomization) getArguments().getSerializable(Extras.EXTRA_CUSTOMIZATION);
        Container container = new Container((Activity) getContext(), sessionId, sessionType, this);

        if (messageListPanel == null) {
            messageListPanel = new MessageListPanel(container, rootView, anchor, false, true,messageRemoteLoader);
        } else {
            messageListPanel.reload(container, anchor);
        }
        if (onAvatarClickListener!=null){
            messageListPanel.setOnAvatarClickListener(onAvatarClickListener);
        }

        if (inputPanel == null) {
            inputPanel = new InputPanel(container, rootView, getActionList());
            inputPanel.setCustomization(customization);
        } else {
            inputPanel.reload(container, customization);
        }

        registerObservers(true);

        if (customization != null) {
            messageListPanel.setChattingBackground(customization.backgroundUri, customization.backgroundColor);
        }
    }

    // 是否允许发送消息
    protected boolean isAllowSendMessage(final IMMessage message) {
        return true;
    }

    private void registerObservers(boolean register) {
        NIMClient.getService(NIMClient.class).observeReceiveMessage(this, register);
    }



    //该onAvatarClickListener直接由RN这边提供，这时候可能MessageListPanel还未创建，所以先存着变量
    MessageListPanel.OnAvatarClickListener onAvatarClickListener;

    public void setAvatarClickListener(MessageListPanel.OnAvatarClickListener listener){
        onAvatarClickListener=listener;
    }


    @Override
    public void onMessageReceived(List<EMMessage> list) {

        if (list == null || list.isEmpty()) {
            return;
        }
        List<IMMessage> msg = new ArrayList<>();
        for (int i = 0; i < list.size(); i++) {
            msg.add(new IMMessage(list.get(i)));
        }
        messageListPanel.onIncomingMessage(msg);

        sendMsgReceipt(); // 发送已读回执

    }

    @Override
    public void onCmdMessageReceived(List<EMMessage> list) {

    }

    @Override
    public void onMessageRead(List<EMMessage> list) {
        List<IMMessage> msgs = new ArrayList<>();
        for (int i = 0; i < list.size(); i++) {
            msgs.add(new IMMessage(list.get(i)));
        }
        receiveReceipt(msgs);
    }

    @Override
    public void onMessageDelivered(List<EMMessage> list) {

    }

    @Override
    public void onMessageChanged(EMMessage emMessage, Object o) {

    }

    /**
     * ********************** implements ModuleProxy *********************
     */
    @Override
    public boolean sendMessage(IMMessage message) {
        if (!isAllowSendMessage(message)) {
            return false;
        }
        appendPushConfig(message);
        // send message to server and save to db
        messageListPanel.onMsgSend(message);
        NIMClient.getService(NIMClient.class).sendMessage(message, false);
        return true;
    }


    private void appendPushConfig(IMMessage message) {
        /*CustomPushContentProvider customConfig = NimUIKit.getCustomPushContentProvider();
        if (customConfig != null) {
            String content = customConfig.getPushContent(message);
            Map<String, Object> payload = customConfig.getPushPayload(message);
            message.setPushContent(content);
            message.setPushPayload(payload);
        }*/
    }

    @Override
    public void onInputPanelExpand() {
        messageListPanel.scrollToBottom();
    }

    @Override
    public void shouldCollapseInputPanel() {
        inputPanel.collapse(false);
    }

    @Override
    public boolean isLongClickEnabled() {
        return !inputPanel.isRecording();
    }

    // 操作面板集合
    protected List<BaseAction> getActionList() {
        List<BaseAction> actions = new ArrayList<>();
        actions.add(new ImageAction());
        if (customization != null && customization.actions != null) {
            actions.addAll(customization.actions);
        }
        return actions;
    }

    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        inputPanel.onActivityResult(requestCode, resultCode, data);
        messageListPanel.onActivityResult(requestCode, resultCode, data);
    }

    /**
     * 发送已读回执
     */
    private void sendMsgReceipt() {
        messageListPanel.sendReceipt();
    }

    /**
     * 收到已读回执
     */
    public void receiveReceipt(List<IMMessage> list) {
        messageListPanel.receiveReceipt();
    }

    MessageRemoteLoader messageRemoteLoader;

    public void setMessageRemoteLoader(MessageRemoteLoader loader){
        messageRemoteLoader=loader;
    }
}
