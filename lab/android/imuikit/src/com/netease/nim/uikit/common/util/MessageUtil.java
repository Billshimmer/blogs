package com.netease.nim.uikit.common.util;

import android.app.Activity;
import android.content.Context;
import android.text.TextUtils;
import android.util.Log;

import com.facebook.react.common.network.OkHttpCallUtil;
import com.facebook.react.modules.network.OkHttpClientProvider;
import com.hyphenate.chat.EMClient;
import com.hyphenate.chat.EMImageMessageBody;
import com.hyphenate.chat.EMMessage;
import com.hyphenate.chat.EMTextMessageBody;
import com.hyphenate.chat.EMVoiceMessageBody;
import com.hyphenate.util.PathUtil;
import com.lightappbuilder.lab4.lablibrary.utils.L;

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
 * Created by tygzx on 17/2/20.
 */

public class MessageUtil {

    private static final String TAG=MessageUtil.class.getSimpleName();

    /**
     * 异步
     * @param me
     * @param toUser
     * @param context
     */
    public static void importMessage(final String me, final String toUser,final Context context){
        if (!TextUtils.isEmpty(IMConfig.chatRecordUrl)) {
            final Request request = new Request.Builder().url(IMConfig.chatRecordUrl + "&chat_uid=" + toUser).tag(context).build();
            OkHttpClientProvider.getOkHttpClient().newCall(request).enqueue(new Callback() {
                @Override
                public void onFailure(Call call, IOException e) {
                    Log.e(TAG, "onFailure: 获取聊天记录失败", e);
                }

                @Override
                public void onResponse(Call call, Response response) throws IOException {
                    String result = response.body().string();
                    try {
                        onLoadRecords(result,me,toUser);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            });

        }
    }

    private static void onLoadRecords(String json,String me, String toUser) throws Exception {
        L.i(TAG, "onLoadRecords json:", json);

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
            EMMessage emMessage = createMessage(messageJson,me,toUser);
            if (emMessage == null) {
                continue;
            }
            messages.add(emMessage);
        }

        if (!messages.isEmpty()) {

        }
    }

    private static EMMessage createMessage(JSONObject messageJson,String me, String toUser) throws JSONException {
        long timestamp = messageJson.getLong("timestamp");
        String msg_id = messageJson.getString("msg_id");
        String from = messageJson.getString("from");
        String to = messageJson.getString("to");

        boolean isSend;
        if (from.equals(toUser)) {
            isSend = false;
        } else if (from.equals(me)) {
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

    public static void cancelImportMessage(Context context){
        OkHttpCallUtil.cancelTag(OkHttpClientProvider.getOkHttpClient(), context);
    }


}
