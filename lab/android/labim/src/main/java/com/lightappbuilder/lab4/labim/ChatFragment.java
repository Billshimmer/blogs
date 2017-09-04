package com.lightappbuilder.lab4.labim;

import android.content.Context;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.text.TextUtils;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.InputMethodManager;
import android.widget.Toast;
import com.facebook.react.common.network.OkHttpCallUtil;
import com.facebook.react.modules.network.OkHttpClientProvider;
import com.hyphenate.chat.EMClient;
import com.hyphenate.chat.EMImageMessageBody;
import com.hyphenate.chat.EMMessage;
import com.hyphenate.chat.EMTextMessageBody;
import com.hyphenate.chat.EMVoiceMessageBody;
import com.hyphenate.util.PathUtil;
import com.netease.nim.uikit.NimUIKit;
import com.netease.nim.uikit.extra.session.fragment.MessageFragment;
import com.netease.nim.uikit.extra.session.viewholder.EaseImageUtils;
import com.netease.nim.uikit.session.SessionEventListener;
import com.netease.nimlib.sdk.msg.model.IMMessage;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.Request;
import okhttp3.Response;

/**
 * Created by vice on 2016/7/22.
 */
public class ChatFragment extends MessageFragment {
    private static final String TAG = "ChatFragment";


    public interface AvatarClickListener {
        void onAvatarClick(String userName);
    }

    private AvatarClickListener avatarClickListener;

    public static ChatFragment newInstance(final AvatarClickListener avatarClickListener) {
        ChatFragment frag = new ChatFragment();
        frag.avatarClickListener = avatarClickListener;

        SessionEventListener listener = new SessionEventListener() {
            @Override
            public void onAvatarClicked(Context context, IMMessage message) {
                // 一般用于打开用户资料页面
                if (avatarClickListener!=null){
                    avatarClickListener.onAvatarClick(message.getFrom());
                }
                Toast.makeText(context,message.getFrom(),Toast.LENGTH_LONG).show();
            }

            @Override
            public void onAvatarLongClicked(Context context, IMMessage message) {
                // 一般用于群组@功能，或者弹出菜单，做拉黑，加好友等功能
            }
        };

        NimUIKit.setSessionListener(listener);


        return frag;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        return super.onCreateView(inflater, container, savedInstanceState);
    }

    public void hideKBoard(){
//        InputMethodManager imm = (InputMethodManager) getActivity().getSystemService(Context.INPUT_METHOD_SERVICE);
//        EaseChatPrimaryMenu chatPrimaryMenu = (EaseChatPrimaryMenu) inputMenu.chatPrimaryMenu;
//        imm.hideSoftInputFromWindow(chatPrimaryMenu.editText.getWindowToken(), 0); //强制隐藏键盘
        Log.e(TAG,"hideKBoard() method queshi");
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        OkHttpCallUtil.cancelTag(OkHttpClientProvider.getOkHttpClient(), this);
    }

    @Override
    public void onViewCreated(View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        //获取历史消息
        if (!TextUtils.isEmpty(IMConfig.chatRecordUrl)) {
            final Request request = new Request.Builder().url(IMConfig.chatRecordUrl + "&chat_uid=" + sessionId).tag(this).build();
            OkHttpClientProvider.getOkHttpClient().newCall(request).enqueue(new Callback() {
                @Override
                public void onFailure(Call call, IOException e) {
                    Log.e(TAG, "onFailure: 获取聊天记录失败", e);
                }

                @Override
                public void onResponse(Call call, Response response) throws IOException {
                    String result = response.body().string();
                    try {
                        onLoadRecords(result);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            });

        }
    }

    private void onLoadRecords(String json) throws Exception {

        JSONObject jsonObject = new JSONObject(json);

        if (!"ok".equals(jsonObject.getString("CODE"))) {
            return;
        }

        JSONObject data = jsonObject.getJSONObject("DATA");
        //int page_size = data.optInt("page_size");
        JSONArray list = data.getJSONArray("list");

        List<EMMessage> messages = new ArrayList<>();

        for (int i = 0; i < list.length(); ++i) {
            JSONObject messageJson = list.getJSONObject(i);
            EMMessage emMessage = createMessage(messageJson);
            if (emMessage == null) {
                continue;
            }
            messages.add(emMessage);
        }

        if (!messages.isEmpty()) {
            importMessages(messages);
        }
    }

    private EMMessage createMessage(JSONObject messageJson) throws JSONException {
        long timestamp = messageJson.getLong("timestamp");
        String msg_id = messageJson.getString("msg_id");
        String from = messageJson.getString("from");
        String to = messageJson.getString("to");

        boolean isSend;
        if (from.equals(sessionId)) {
            isSend = false;
        } else if (from.equals(NimUIKit.getAccount())) {
            isSend = true;
        } else {
            return null;
        }

        JSONObject payload = messageJson.getJSONObject("payload");
        JSONObject body = payload.getJSONArray("bodies").getJSONObject(0);

        String type = body.getString("type");
        EMMessage emMessage = null;
        switch (body.getString("type")) {
            case "txt": {
                if (isSend) {
                    emMessage = EMMessage.createSendMessage(EMMessage.Type.TXT);
                } else {
                    emMessage = EMMessage.createReceiveMessage(EMMessage.Type.TXT);
                }

                String msg = body.getString("msg");

                EMTextMessageBody emMessageBody = new EMTextMessageBody(msg);
                emMessage.addBody(emMessageBody);
                break;
            }
            case "img": {
                if (isSend) {
                    emMessage = EMMessage.createSendMessage(EMMessage.Type.IMAGE);
                } else {
                    emMessage = EMMessage.createReceiveMessage(EMMessage.Type.IMAGE);
                }

                String url = body.getString("url");
                String secret = body.getString("secret");
                //long file_length = body.getLong("file_length");
                String filename = body.getString("filename");
                String localUrl = EaseImageUtils.getImagePath(url);

                EMImageMessageBody emMessageBody = new EMImageMessageBody(new File(localUrl));
                emMessageBody.setRemoteUrl(url);
                emMessageBody.setThumbnailSecret(secret);
                emMessageBody.setThumbnailUrl(url);
                emMessageBody.setSecret(secret);
                emMessageBody.setFileName(filename);
                emMessageBody.setLocalUrl(localUrl);
                emMessage.addBody(emMessageBody);
                break;
            }
            case "audio": {
                if (isSend) {
                    emMessage = EMMessage.createSendMessage(EMMessage.Type.VOICE);
                } else {
                    emMessage = EMMessage.createReceiveMessage(EMMessage.Type.VOICE);
                }

                String url = body.getString("url");
                int length = body.getInt("length");
                String secret = body.getString("secret");
                //long file_length = body.getLong("file_length");
                String filename = body.getString("filename");
                //如果这条消息本地已存在,是不会更新本地消息的,所以不用担心localUrl 与本地不同导致重复下载
                String localUrl = PathUtil.getInstance().getVoicePath() + "/" + url.substring(url.lastIndexOf("/") + 1, url.length());

                EMVoiceMessageBody emMessageBody = new EMVoiceMessageBody(new File(localUrl), length);
                emMessageBody.setLocalUrl(localUrl);
                emMessageBody.setFileName(filename);
                emMessageBody.setSecret(secret);
                emMessageBody.setRemoteUrl(url);
                emMessage.addBody(emMessageBody);

                // 对音频数据如果根据本地是否存在设置状态
                if (new File(localUrl).exists()) {
                    emMessage.setStatus(EMMessage.Status.SUCCESS);
                } else {
                    emMessage.setStatus(EMMessage.Status.CREATE);
                    emMessage.setAttribute("lab_sync_audio", true); //标记是未加载的 同步下来的音频消息
                }
                break;
            }
        }
        if (emMessage != null) {
            emMessage.setTo(to);
            emMessage.setFrom(from);
            emMessage.setMsgTime(timestamp);
            emMessage.setMsgId(msg_id);
            emMessage.setChatType(EMMessage.ChatType.Chat);
            if (!"audio".equals(body.getString("type"))) {
                emMessage.setStatus(EMMessage.Status.SUCCESS);
            }
            emMessage.setDirection(isSend ? EMMessage.Direct.SEND : EMMessage.Direct.RECEIVE);
            emMessage.setAcked(true);
        }
        return emMessage;
    }

    private void importMessages(List<EMMessage> messages) {
        EMClient.getInstance().chatManager().importMessages(messages);
        reload(getFirstVisibleItem());


//        int allMsgCount = conversation.getAllMsgCount();
//        if (allMsgCount == 0) {
//            //本地没有消息的时候加载10条
//            conversation.loadMoreMsgFromDB("", 10);
//            Activity activity = getActivity();
//            if (activity != null) {
//                activity.runOnUiThread(new Runnable() {
//                    @Override
//                    public void run() {
//                        if (messageList != null) {
//                            messageList.refresh();
//                        }
//                    }
//                });
//            }
//            return;
//        }
//
//        List<EMMessage> currentAllMessages = conversation.getAllMessages();
//        EMMessage firstMessage = currentAllMessages.isEmpty() ? null : currentAllMessages.get(0);
//        int loadLength = -1;
//        if (firstMessage != null) {
//            String firstMessageMsgId = firstMessage.getMsgId();
//            for (int i = 0; i < messages.size(); i++) {
//                if (firstMessageMsgId.equals(messages.get(i).getMsgId())) {
//                    loadLength = i + 1;
//                    break;
//                }
//            }
//        }
//        if (loadLength == -1) {
//            //没有匹配的msgId ,加载全部
//            conversation.loadMoreMsgFromDB("", messages.size());
//        } else {
//            conversation.loadMoreMsgFromDB("", loadLength);
//        }
//
//        Activity activity = getActivity();
//        if (activity != null) {
//            activity.runOnUiThread(new Runnable() {
//                @Override
//                public void run() {
//                    if (messageList == null) {
//                        return;
//                    }
//                    try {
//                        int firstVisiblePosition = messageList.getListView().getFirstVisiblePosition();
//                        EMMessage emMessage = (EMMessage) messageList.getListView().getAdapter().getItem(firstVisiblePosition);
//                        List<EMMessage> allMessages = conversation.getAllMessages();
//                        int newPosition = firstVisiblePosition;
//                        for (int i = 0; i < allMessages.size(); ++i) {
//                            if (emMessage.getMsgId().equals(allMessages.get(i).getMsgId())) {
//                                newPosition = i;
//                                break;
//                            }
//                        }
//                        if (newPosition == firstVisiblePosition) {
//                            messageList.refresh();
//                        } else {
//                            messageList.refreshSeekTo(newPosition);
//                        }
//                    } catch (Exception e) {
//                        e.printStackTrace();
//                    }
//                }
//            });
//        }
    }
}

