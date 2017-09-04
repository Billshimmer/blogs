package com.netease.nim.uikit.viewholder;

import android.app.Activity;
import android.graphics.Color;
import android.graphics.drawable.AnimationDrawable;
import android.text.TextUtils;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;
import com.hyphenate.chat.EMFileMessageBody;
import com.hyphenate.chat.EMVoiceMessageBody;
import com.netease.nim.uikit.R;
import com.netease.nim.uikit.common.ui.recyclerview.adapter.BaseMultiItemFetchLoadAdapter;
import com.netease.nim.uikit.common.util.sys.ScreenUtil;
import com.netease.nim.uikit.audio.AudioPlayerManager;
import com.netease.nim.uikit.system.MsgDirectionEnum;
import com.netease.nim.uikit.system.MsgStatusEnum;

/**
 * Created by zhoujianghua on 2015/8/5.
 */
public class MsgViewHolderAudio extends MsgViewHolderBase {

    public static int MAX_AUDIO_TIME_SECOND = 120;
    public static final int CLICK_TO_PLAY_AUDIO_DELAY = 500;

    private TextView durationLabel;
    private View containerView;
    private View unreadIndicator;
    private ImageView animationView;

    public MsgViewHolderAudio(BaseMultiItemFetchLoadAdapter adapter) {
        super(adapter);
    }


    @Override
    protected int getContentResId() {
        return R.layout.nim_message_item_audio;
    }

    @Override
    protected void inflateContentView() {
        durationLabel = findViewById(R.id.message_item_audio_duration);
        containerView = findViewById(R.id.message_item_audio_container);
        unreadIndicator = findViewById(R.id.message_item_audio_unread_indicator);
        animationView = findViewById(R.id.message_item_audio_playing_animation);

    }

    @Override
    protected void bindContentView() {
        layoutByDirection();

//        if (message.getDirect()== MsgDirectionEnum.In){
//            setMessageReceiveCallback();
//        }else {
//            setMessageSendCallback();
//        }

        controlPlaying();
    }

    @Override
    protected void onItemClick() {

        if (message.getDirect() == MsgDirectionEnum.In && ((EMVoiceMessageBody)message.getAttachment()).downloadStatus() != EMFileMessageBody.EMDownloadStatus.SUCCESSED) {
            return;
        }


        if (message.isUnread()) {
            // 将未读标识去掉,更新数据库
            unreadIndicator.setVisibility(View.GONE);
            message.setUnRead(false);
        }
        AudioPlayerManager.getInstance(context).setAudioPlayerListener(audioPlayerListener);
        AudioPlayerManager.getInstance(context).playVoice(((EMVoiceMessageBody)message.getAttachment()).getLocalUrl());
        ((Activity)context).runOnUiThread(new Runnable() {
            @Override
            public void run() {
                play();
            }
        });
        /*if (audioControl != null) {

            audioControl.startPlayAudioDelay(CLICK_TO_PLAY_AUDIO_DELAY, message, onPlayListener);
            audioControl.setPlayNext(true, adapter, message);
        }*/
    }

    private void layoutByDirection() {
        if (isReceivedMessage()) {
            setGravity(animationView, Gravity.LEFT | Gravity.CENTER_VERTICAL);
            setGravity(durationLabel, Gravity.RIGHT | Gravity.CENTER_VERTICAL);

            containerView.setBackgroundResource(android.R.color.transparent);
            containerView.setPadding(ScreenUtil.dip2px(15),ScreenUtil.dip2px(8), ScreenUtil.dip2px(10), ScreenUtil.dip2px(8));
            animationView.setBackgroundResource(R.drawable.nim_audio_animation_list_left);
            durationLabel.setTextColor(Color.BLACK);

        } else {
            setGravity(animationView, Gravity.RIGHT | Gravity.CENTER_VERTICAL);
            setGravity(durationLabel, Gravity.LEFT | Gravity.CENTER_VERTICAL);
            unreadIndicator.setVisibility(View.GONE);

            containerView.setBackgroundResource(android.R.color.transparent);
            containerView.setPadding(ScreenUtil.dip2px(10),ScreenUtil.dip2px(8), ScreenUtil.dip2px(15), ScreenUtil.dip2px(8));
            animationView.setBackgroundResource(R.drawable.nim_audio_animation_list_right);
            durationLabel.setTextColor(Color.WHITE);
        }
    }

    @Override
    protected void setStatus() {
        //super.setStatus();

        EMVoiceMessageBody attachment = (EMVoiceMessageBody) message.getAttachment();
        MsgStatusEnum status = message.getStatus();
        // alert button
        if (TextUtils.isEmpty(attachment.getLocalUrl())) {
            if (attachment.downloadStatus() == EMFileMessageBody.EMDownloadStatus.FAILED || status == MsgStatusEnum.fail) {
                alertButton.setVisibility(View.VISIBLE);
            } else {
                alertButton.setVisibility(View.GONE);
            }
        }

        // progress bar indicator
        if (status == MsgStatusEnum.sending || attachment.downloadStatus()== EMFileMessageBody.EMDownloadStatus.DOWNLOADING) {
            progressBar.setVisibility(View.VISIBLE);
        } else {
            progressBar.setVisibility(View.GONE);
        }

        // unread indicator
        if (isReceivedMessage() && attachment.downloadStatus()== EMFileMessageBody.EMDownloadStatus.SUCCESSED  && message.isUnread()) {
            unreadIndicator.setVisibility(View.VISIBLE);
        } else {
            unreadIndicator.setVisibility(View.GONE);
        }

    }

    /*private void refreshStatus() {// 消息状态
        EMVoiceMessageBody attachment = (EMVoiceMessageBody) message.getAttachment();
        MsgStatusEnum status = message.getStatus();
        // alert button
        if (TextUtils.isEmpty(attachment.getLocalUrl())) {
            if (attachment.downloadStatus() == EMFileMessageBody.EMDownloadStatus.FAILED || status == MsgStatusEnum.fail) {
                alertButton.setVisibility(View.VISIBLE);
            } else {
                alertButton.setVisibility(View.GONE);
            }
        }

        // progress bar indicator
        if (status == MsgStatusEnum.sending || attachment.downloadStatus()== EMFileMessageBody.EMDownloadStatus.DOWNLOADING) {
            progressBar.setVisibility(View.VISIBLE);
        } else {
            progressBar.setVisibility(View.GONE);
        }

        progressBar.setVisibility(View.GONE);
        unreadIndicator.setVisibility(View.GONE);

        // unread indicator
        if (isReceivedMessage() && attachment.downloadStatus()== EMFileMessageBody.EMDownloadStatus.SUCCESSED  && message.isUnread()) {
            unreadIndicator.setVisibility(View.VISIBLE);
        } else {
            unreadIndicator.setVisibility(View.GONE);
        }
    }*/

    private void controlPlaying() {
        final EMVoiceMessageBody msgAttachment = (EMVoiceMessageBody) message.getAttachment();
        long duration = msgAttachment.getLength();
        setAudioBubbleWidth(duration);

        if (!AudioPlayerManager.getInstance(context).isPlaying(msgAttachment.getLocalUrl())) {
            updateTime(duration);
            stop();
        } else {
            play();
        }
    }

    public static int getAudioMaxEdge() {
        return (int) (0.6 * ScreenUtil.screenMin);
    }

    public static int getAudioMinEdge() {
        return (int) (0.1875 * ScreenUtil.screenMin);
    }

    private void setAudioBubbleWidth(long seconds) {


        int currentBubbleWidth = calculateBubbleWidth(seconds, MAX_AUDIO_TIME_SECOND);
        ViewGroup.LayoutParams layoutParams = containerView.getLayoutParams();
        layoutParams.width = currentBubbleWidth;
        containerView.setLayoutParams(layoutParams);
    }

    private int calculateBubbleWidth(long seconds, int MAX_TIME) {
        int maxAudioBubbleWidth = getAudioMaxEdge();
        int minAudioBubbleWidth = getAudioMinEdge();

        int currentBubbleWidth;
        if (seconds <= 0) {
            currentBubbleWidth = minAudioBubbleWidth;
        } else if (seconds > 0 && seconds <= MAX_TIME) {
            currentBubbleWidth = (int) ((maxAudioBubbleWidth - minAudioBubbleWidth) * (2.0 / Math.PI)
                    * Math.atan(seconds / 10.0) + minAudioBubbleWidth);
        } else {
            currentBubbleWidth = maxAudioBubbleWidth;
        }

        if (currentBubbleWidth < minAudioBubbleWidth) {
            currentBubbleWidth = minAudioBubbleWidth;
        } else if (currentBubbleWidth > maxAudioBubbleWidth) {
            currentBubbleWidth = maxAudioBubbleWidth;
        }

        return currentBubbleWidth;
    }

    private void updateTime(long seconds) {

        if (seconds >= 0) {
            durationLabel.setText(seconds + "\"");
        } else {
            durationLabel.setText("");
        }
    }

    private AudioPlayerManager.AudioPlayerListener audioPlayerListener=new AudioPlayerManager.AudioPlayerListener() {
        @Override
        public void onPlaying(int duration) {
            final long position=duration;
            if (position >((EMVoiceMessageBody) message.getAttachment()).getLength()) {
                return;
            }
            ((Activity)context).runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    updateTime(position);
                }
            });

        }

        @Override
        public void onCompletion() {
            ((Activity)context).runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    updateTime(((EMVoiceMessageBody) message.getAttachment()).getLength());
                    stop();
                }
            });

        }

        @Override
        public void onChangeListener() {
            ((Activity)context).runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    updateTime(((EMVoiceMessageBody) message.getAttachment()).getLength());
                    stop();
                }
            });
        }
    };


    private void play() {
        if (animationView.getBackground() instanceof AnimationDrawable) {
            AnimationDrawable animation = (AnimationDrawable) animationView.getBackground();
            animation.start();
        }
    }

    private void stop() {
        if (animationView.getBackground() instanceof AnimationDrawable) {
            AnimationDrawable animation = (AnimationDrawable) animationView.getBackground();
            animation.stop();
            animation.selectDrawable(2);
        }
    }

    @Override
    protected int leftBackground() {
        return R.drawable.ease_chatfrom_bg;
    }

    @Override
    protected int rightBackground() {
        return R.drawable.ease_chatto_bg;
    }
}
