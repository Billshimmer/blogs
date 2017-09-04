package com.netease.nimlib.sdk.msg.attachment;

import android.util.Log;

import com.hyphenate.chat.EMFileMessageBody;
import com.hyphenate.chat.EMImageMessageBody;
import com.hyphenate.chat.EMMessage;
import com.hyphenate.chat.EMMessageBody;
import com.hyphenate.util.PathUtil;
import com.netease.nimlib.sdk.msg.constant.MsgDirectionEnum;
import com.netease.nimlib.sdk.msg.model.IMMessage;

/**
 * Created by dansejijie on 17/4/4.
 */

public class ImageAttachment extends FileAttachment{
    private int width;
    private int height;
    private static final String KEY_WIDTH = "w";
    private static final String KEY_HEIGHT = "h";

    public ImageAttachment(IMMessage imMessage){
        super(imMessage);
    }

    public String getPath(){
        if (imMessage.getDirect()== MsgDirectionEnum.Out){
            return ((EMImageMessageBody)emMessageBody).getLocalUrl();
        }else {
            return ((EMImageMessageBody)emMessageBody).getRemoteUrl();
        }

    }

    public String getThumbPath(){

        if (imMessage.getDirect()==MsgDirectionEnum.Out){
            String thumbImageName =((EMImageMessageBody)emMessageBody).getLocalUrl().substring(((EMImageMessageBody)emMessageBody).getLocalUrl().lastIndexOf("/") + 1, ((EMImageMessageBody)emMessageBody).getLocalUrl().length());
            String thumbPath = PathUtil.getInstance().getImagePath() + "/" + "th" + thumbImageName;
            return thumbPath;
        }else {
            if (((EMImageMessageBody)emMessageBody).thumbnailDownloadStatus()== EMFileMessageBody.EMDownloadStatus.SUCCESSED){
                return ((EMImageMessageBody)emMessageBody).thumbnailLocalPath();
            }else if (((EMImageMessageBody)emMessageBody).thumbnailDownloadStatus()== EMFileMessageBody.EMDownloadStatus.FAILED){
                return null;
            }
            return null;
        }
    }

    public int getWidth() {
        Log.e("TAG","unhandler");
        return 100;
    }

    public void setWidth(int var1) {
        Log.e("TAG","unhandler");
        this.width = var1;
    }

    public int getHeight() {
        Log.e("TAG","unhandler");
        return 100;
    }

    public void setHeight(int var1) {
        Log.e("TAG","unhandler");
        this.height = var1;
    }

    public boolean isHdImage() {
        Log.e("TAG","unhandler");
        return false;
    }
}
