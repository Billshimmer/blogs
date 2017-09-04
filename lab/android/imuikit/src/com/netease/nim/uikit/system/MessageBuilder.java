package com.netease.nim.uikit.system;

import com.hyphenate.chat.EMImageMessageBody;
import com.hyphenate.chat.EMMessage;
import com.hyphenate.chat.EMTextMessageBody;
import com.hyphenate.chat.EMVoiceMessageBody;
import com.hyphenate.util.PathUtil;
import com.netease.nim.uikit.common.util.EaseImageUtils;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;

/**
 * Created by zhengqiang on 2016/12/31.
 */

public class MessageBuilder {

    public static IMMessage createForwardMessage(IMMessage message, String sessionId, SessionTypeEnum sessionTypeEnum){
        IMMessage msg=new IMMessage( EMMessage.createSendMessage(message.getType().getValue()));
        if (message.getMsgType()== MsgTypeEnum.text){
            EMTextMessageBody messageBody=new EMTextMessageBody(message.getContent());
            msg.addBody(messageBody);
        }
        return msg;
    }
    public static IMMessage createEmptyMessage(String account,SessionTypeEnum sessionTypeEnum,int i){
        //IMMessage message= new IMMessage( EMMessage.createTxtSendMessage("",account));
        EMMessage msg=EMMessage.createTxtSendMessage("aa",account);
        return new IMMessage(msg);
    }

    public static IMMessage createAudioMessage(String account, SessionTypeEnum sessionTypeEnum, File audioPath, long audioLength){
        return new IMMessage( EMMessage.createVoiceSendMessage(audioPath.getAbsolutePath(),(int)audioLength,account));
    }
    public static IMMessage createTextMessage(String account,SessionTypeEnum sessionTypeEnum,String txt){
        return new IMMessage(EMMessage.createTxtSendMessage(txt,account));
    }
    public static IMMessage createImageMessage(String account,SessionTypeEnum sessionTypeEnum,File file,String fileName){
        return new IMMessage( EMMessage.createImageSendMessage(file.getAbsolutePath(),true,account));
    }
    public static IMMessage createVideoMessage(String account, SessionTypeEnum sessionTypeEnum, File file, long duration, int width, int height, String md5){
        return new IMMessage( EMMessage.createVideoSendMessage(file.getAbsolutePath(),null,(int)duration,account));
    }
    public static IMMessage createLocationMessage(String account, SessionTypeEnum sessionTypeEnum,double latitude,double longitude,String address){
        return new IMMessage( EMMessage.createLocationSendMessage(latitude,longitude,address,account));
    }


}
