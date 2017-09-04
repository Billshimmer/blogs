package com.lightappbuilder.lab4.labim;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;

import com.facebook.drawee.backends.pipeline.Fresco;
import com.facebook.drawee.backends.pipeline.PipelineDraweeControllerBuilder;
import com.facebook.drawee.interfaces.DraweeController;
import com.hyphenate.chat.EMMessage;
import com.lightappbuilder.lab4.lablibrary.rnmodules.notification.LABNotificationModule;
import com.lightappbuilder.lab4.lablibrary.utils.IntentUtils;
import com.netease.nim.uikit.extra.easeui.domain.EaseUser;
import com.netease.nim.uikit.extra.easeui.model.EaseAtMessageHelper;
import com.netease.nim.uikit.extra.easeui.model.EaseNotifier;
import com.netease.nim.uikit.extra.easeui.utils.EaseCommonUtils;

import static com.netease.nim.uikit.extra.easeui.utils.EaseUserUtils.getUserInfo;

/**
 * Created by tygzx on 17/5/24.
 */

public class IMOptionsBuilder {

    private Context context;
    private EaseNotifier.EaseNotificationInfoProvider provider;

    public IMOptionsBuilder(Context context){
        this.context=context;
    }

    public IMOptionsBuilder setEaseNotificationInfoProvider(EaseNotifier.EaseNotificationInfoProvider provider){
        this.provider=provider;
        return this;
    }

    public IMOptions build(){
        if (provider==null){
            provider=DefaultEaseNotificationInfoProvider(context);
        }
        IMOptions imOptions=new IMOptions();
        imOptions.setProvider(provider);
        return imOptions;

    }


    public EaseNotifier.EaseNotificationInfoProvider DefaultEaseNotificationInfoProvider(final Context context){
        return new EaseNotifier.EaseNotificationInfoProvider() {
            @Override
            public String getTitle(EMMessage message) {
                return null;
            }

            @Override
            public int getSmallIcon(EMMessage message) {
                return 0;
            }

            @Override
            public String getDisplayedText(EMMessage message) {
                // be used on notification bar, different text according the message type.
                String ticker = EaseCommonUtils.getMessageDigest(message, context);
                if (message.getType() == EMMessage.Type.TXT) {
                    ticker = ticker.replaceAll("\\[.{2,3}\\]", "[表情]");
                }
                EaseUser user = getUserInfo(message.getFrom());
                if (user != null) {
                    if (EaseAtMessageHelper.get().isAtMeMsg(message)) {
                        return String.format(context.getString(R.string.at_your_in_group), user.getNick());
                    }
                    return user.getNick() + ": " + ticker;
                } else {
                    if (EaseAtMessageHelper.get().isAtMeMsg(message)) {
                        return String.format(context.getString(R.string.at_your_in_group), message.getFrom());
                    }
                    return message.getFrom() + ": " + ticker;
                }
            }

            @Override
            public String getLatestText(EMMessage message, int fromUsersNum, int messageNum) {
                // here you can customize the text.
                // return fromUsersNum + "contacts send " + messageNum + "messages to you";
                String ticker = EaseCommonUtils.getMessageDigest(message, context);
                if (message.getType() == EMMessage.Type.TXT) {
                    ticker = ticker.replaceAll("\\[.{2,3}\\]", "[表情]");
                }else if (message.getType()== EMMessage.Type.VOICE){
                    ticker="[语音]";
                }else if (message.getType()== EMMessage.Type.IMAGE){
                    ticker="[图片]";
                }
                if (messageNum==1){
                    return ticker;
                }
                return null;
            }

            @Override
            public Intent getLaunchIntent(EMMessage message) {
//            	// you can set what activity you want display when user click the notification
//                Intent intent = new Intent(appContext, ChatActivity.class);
//                // open calling activity if there is call
//                if(isVideoCalling){
//                    intent = new Intent(appContext, VideoCallActivity.class);
//                }else if(isVoiceCalling){
//                    intent = new Intent(appContext, VoiceCallActivity.class);
//                }else{
//                    ChatType chatType = message.getChatType();
//                    if (chatType == ChatType.Chat) { // single chat message
//                        intent.putExtra("userId", message.getFrom());
//                        intent.putExtra("chatType", Constant.CHATTYPE_SINGLE);
//                    } else { // group chat message
//                        // message.getTo() is the group id
//                        intent.putExtra("userId", message.getTo());
//                        if(chatType == ChatType.GroupChat){
//                            intent.putExtra("chatType", Constant.CHATTYPE_GROUP);
//                        }else{
//                            intent.putExtra("chatType", Constant.CHATTYPE_CHATROOM);
//                        }
//
//                    }
//                }

                Intent intent = IntentUtils.getLaunchIntent(context);
                intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
                Bundle bundle = new Bundle();
                bundle.putString("lab_notification_type", "IM"); //标记通知类型为IM
                bundle.putString("targetImId", message.getChatType() == EMMessage.ChatType.Chat ? message.getFrom() : message.getTo());
                intent.putExtra(LABNotificationModule.NOTIFICATION_INTENT_KEY, bundle);
                return intent;
            }
        };
    }
}
