package com.netease.nim.uikit.common.util;

import com.hyphenate.util.EMLog;
import com.hyphenate.util.PathUtil;

/**
 * Created by tygzx on 17/2/20.
 */

public class EaseImageUtils {

    public static String getImagePath(String remoteUrl)
    {
        String imageName= remoteUrl.substring(remoteUrl.lastIndexOf("/") + 1, remoteUrl.length());
        String path = PathUtil.getInstance().getImagePath()+"/"+ imageName;
        EMLog.d("msg", "image path:" + path);
        return path;

    }

    public static String getThumbnailImagePath(String thumbRemoteUrl) {
        String thumbImageName= thumbRemoteUrl.substring(thumbRemoteUrl.lastIndexOf("/") + 1, thumbRemoteUrl.length());
        String path =PathUtil.getInstance().getImagePath()+"/"+ "th"+thumbImageName;
        EMLog.d("msg", "thum image path:" + path);
        return path;
    }
}
