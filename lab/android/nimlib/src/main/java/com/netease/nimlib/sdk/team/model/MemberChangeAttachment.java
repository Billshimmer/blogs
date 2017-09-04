package com.netease.nimlib.sdk.team.model;

import android.util.Log;

import com.hyphenate.chat.EMMessageBody;
import com.netease.nimlib.sdk.msg.attachment.NotificationAttachment;
import com.netease.nimlib.sdk.msg.model.IMMessage;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Map;

/**
 * Created by dansejijie on 17/4/15.
 */


public class MemberChangeAttachment extends NotificationAttachment {
    private static final String TAG_ACCOUNTS = "ids";
    private static final String TAG_ACCOUNT = "id";
    protected static final String TAG_ATTACH = "attach";
    private ArrayList<String> targets;
    protected Map<String, Object> extension;

    public MemberChangeAttachment(IMMessage imMessage) {
        super(imMessage);
    }

    public ArrayList<String> getTargets() {
        return this.targets;
    }

    public Map<String, Object> getExtension() {
        return this.extension;
    }

    public void parse(JSONObject var1) {
//        if(var1.has("ids")) {
//            JSONArray var2 = d.g(var1, "ids");
//            this.targets = new ArrayList(var2.length());
//
//            for(int var3 = 0; var3 < var2.length(); ++var3) {
//                this.targets.add(d.a(var2, var3));
//            }
//        } else if(var1.has("id")) {
//            this.targets = new ArrayList(1);
//            this.targets.add(d.e(var1, "id"));
//        }
//
//        if(var1.has("attach")) {
//            this.extension = i.c(d.e(var1, "attach"));
//        }
//
//    }
        Log.e("TAG","unhandler");
    }
}