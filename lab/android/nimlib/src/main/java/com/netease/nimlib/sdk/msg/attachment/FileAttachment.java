package com.netease.nimlib.sdk.msg.attachment;

import android.text.TextUtils;
import android.util.Log;

import com.hyphenate.chat.EMFileMessageBody;
import com.hyphenate.chat.EMMessageBody;
import com.netease.nimlib.sdk.msg.model.IMMessage;

import org.json.JSONObject;

import java.io.File;

/**
 * Created by dansejijie on 17/4/4.
 */

public class FileAttachment extends MsgAttachment {

    public FileAttachment(IMMessage imMessage) {
        super(imMessage);
    }

    protected String path;
    protected long size;
    protected String md5;
    protected String url;
    protected String displayName;
    protected String extension;
    private static final String KEY_PATH = "path";
    private static final String KEY_NAME = "name";
    private static final String KEY_SIZE = "size";
    private static final String KEY_MD5 = "md5";
    private static final String KEY_URL = "url";
    private static final String KEY_EXT = "ext";


    public String getPath() {

        String var1 = this.getPathForSave();
        return (new File(var1)).exists()?var1:null;
    }

    public String getPathForSave() {
        return ((EMFileMessageBody)emMessageBody).getLocalUrl();
    }

    public String getThumbPath() {
        String var1 = this.getThumbPathForSave();
        return (new File(var1)).exists()?var1:null;
    }

    public String getThumbPathForSave() {
        return ((EMFileMessageBody)emMessageBody).getLocalUrl();
    }

    public void setPath(String var1) {
        ((EMFileMessageBody)emMessageBody).setLocalUrl(var1);
    }

    public long getSize() {
        Log.e("TAG","unhandlr");
        return 0;
    }

    public void setSize(long var1) {
        Log.e("TAG","unhandler");
        this.size = var1;
    }

    public String getMd5() {
        Log.e("TAG","unhandler");
        return this.md5;
    }

    public void setMd5(String var1) {
        Log.e("TAG","unhandler");
        this.md5 = var1;
    }

    public String getUrl() {
        return ((EMFileMessageBody)emMessageBody).getRemoteUrl();
    }

    public void setUrl(String var1) {
        ((EMFileMessageBody)emMessageBody).setRemoteUrl(var1);
    }

    public String getExtension() {
        Log.e("TAG","unhandler");
        return this.extension;
    }

    public void setExtension(String var1) {
        Log.e("TAG","unhandler");
        this.extension = var1;
    }

    public String getFileName() {
        return  ((EMFileMessageBody)emMessageBody).displayName();
    }

    public String getDisplayName() {
        return ((EMFileMessageBody)emMessageBody).displayName();
    }

    public void setDisplayName(String var1) {
        ((EMFileMessageBody)emMessageBody).setFileName(var1);
    }

//    protected b storageType() {
//        return b.b;
//    }

    protected void save(JSONObject var1) {
    }

    protected void load(JSONObject var1) {
    }

//    public String toJson(boolean var1) {
//        JSONObject var2 = new JSONObject();
//
//        try {
//            if(!var1 && !TextUtils.isEmpty(this.path)) {
//                var2.put("path", this.path);
//            }
//
//            if(!TextUtils.isEmpty(this.md5)) {
//                var2.put("md5", this.md5);
//            }
//
//            if(!TextUtils.isEmpty(this.displayName)) {
//                var2.put("name", this.displayName);
//            }
//
//            var2.put("url", this.url);
//            var2.put("size", this.size);
//            if(!TextUtils.isEmpty(this.extension)) {
//                var2.put("ext", this.extension);
//            }
//
//            this.save(var2);
//        } catch (Exception var3) {
//            var3.printStackTrace();
//        }
//
//        return var2.toString();
//    }
//
//    private void fromJson(String var1) {
//        JSONObject var2 = d.a(var1);
//        this.path = d.e(var2, "path");
//        this.md5 = d.e(var2, "md5");
//        this.url = d.e(var2, "url");
//        this.displayName = d.e(var2, "name");
//        this.size = d.b(var2, "size");
//        this.extension = d.e(var2, "ext");
//        this.load(var2);
//    }
}
