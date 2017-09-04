package com.netease.nimlib.sdk.team.model;

import com.hyphenate.chat.EMMessageBody;
import com.netease.nimlib.sdk.msg.model.IMMessage;

import org.json.JSONObject;

/**
 * Created by dansejijie on 17/4/15.
 */
public class MuteMemberAttachment extends MemberChangeAttachment {
    private static final String TAG_MUTE = "mute";
    private boolean mute;

    public MuteMemberAttachment(IMMessage body) {
        super(body);
    }

    public void parse(JSONObject var1) {
        super.parse(var1);
//        if(var1.has("mute")) {
//            this.mute = d.a(var1, "mute") == 1;
//        }

    }

    public boolean isMute() {
        return this.mute;
    }
}
