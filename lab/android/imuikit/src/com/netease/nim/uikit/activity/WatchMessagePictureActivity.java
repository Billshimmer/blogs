
package com.netease.nim.uikit.activity;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.WindowManager;
import android.widget.Toast;

import com.hyphenate.chat.EMMessage;
import com.netease.nim.uikit.R;
import com.netease.nim.uikit.system.IMMessage;
import com.netease.nim.uikit.system.MsgStatusEnum;
import com.netease.nim.uikit.system.MsgTypeEnum;
import com.netease.nim.uikit.system.NIMClient;
import com.netease.nim.uikit.system.RequestCallback;
import com.netease.nim.uikit.widget.PhotoBrowserView;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;


/**
 * 查看聊天消息原图
 * Created by huangjun on 2015/3/6.
 */
public class WatchMessagePictureActivity extends Activity {

    private static final String INTENT_EXTRA_IMAGE_ACCOUNT = "INTENT_EXTRA_IMAGE_ACCOUNT";
    private static final String INTENT_EXTRA_IMAGE_MESSAGEID = "INTENT_EXTRA_IMAGE_MESSAGEID";
    private static final String TAG = WatchMessagePictureActivity.class.getSimpleName();
    private List<EMMessage> imageMsgList = new ArrayList<>();
    private int firstDisplayImageIndex = 0;
    private String messionId = null;
    private String firstMessageId = null;
    private PhotoBrowserView photoBrowserView;

    public static void start(Context context, IMMessage message) {
        Intent intent = new Intent();
        intent.putExtra(INTENT_EXTRA_IMAGE_ACCOUNT, message.getSessionId());
        intent.putExtra(INTENT_EXTRA_IMAGE_MESSAGEID, message.getMsgId());
        intent.setClass(context, WatchMessagePictureActivity.class);
        context.startActivity(intent);
    }
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.nim_watch_picture_activity);
        photoBrowserView = (PhotoBrowserView) findViewById(R.id.photoBrowserView);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,
                WindowManager.LayoutParams.FLAG_FULLSCREEN);
        messionId = getIntent().getExtras().getString(INTENT_EXTRA_IMAGE_ACCOUNT);
        firstMessageId = getIntent().getExtras().getString(INTENT_EXTRA_IMAGE_MESSAGEID);
        if (TextUtils.isEmpty(messionId) || TextUtils.isEmpty(firstMessageId)) {
            finish();
        }
        queryImageMessages();

    }
    private void queryImageMessages() {

        NIMClient.getService(WatchMessagePictureActivity.class).queryMessageListByType(MsgTypeEnum.image, messionId, new RequestCallback<List<EMMessage>>() {
            @Override
            public void onSuccess(List<EMMessage> var1) {

                imageMsgList.addAll(var1);
                Collections.reverse(imageMsgList);
                setDisplayIndex();
                photoBrowserView.setOptions(imageMsgList, firstDisplayImageIndex);
            }

            @Override
            public void onFailed(int var1) {
                Toast.makeText(WatchMessagePictureActivity.this, "当前无图片预览", Toast.LENGTH_SHORT).show();
                finish();
            }

            @Override
            public void onException(Throwable var1) {
                Toast.makeText(WatchMessagePictureActivity.this, "发生异常错误", Toast.LENGTH_SHORT).show();
                finish();
            }
        });
    }
    // 设置第一个选中的图片index
    private void setDisplayIndex() {
        for (int i = 0; i < imageMsgList.size(); i++) {
           if (imageMsgList.get(i).getMsgId().equals(firstMessageId)){
                firstDisplayImageIndex = i;
                break;
            }
        }
    }

}

