package com.netease.nimlib.sdk.team.model;

import com.hyphenate.chat.EMMessageBody;
import com.netease.nimlib.sdk.msg.attachment.NotificationAttachment;
import com.netease.nimlib.sdk.msg.model.IMMessage;
import com.netease.nimlib.sdk.team.constant.TeamBeInviteModeEnum;
import com.netease.nimlib.sdk.team.constant.TeamExtensionUpdateModeEnum;
import com.netease.nimlib.sdk.team.constant.TeamFieldEnum;
import com.netease.nimlib.sdk.team.constant.TeamInviteModeEnum;
import com.netease.nimlib.sdk.team.constant.TeamUpdateModeEnum;
import com.netease.nimlib.sdk.team.constant.VerifyTypeEnum;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by dansejijie on 17/4/15.
 */

public class UpdateTeamAttachment extends NotificationAttachment {
    private HashMap<TeamFieldEnum, Object> updatedFields = new HashMap(1);

    public UpdateTeamAttachment(IMMessage imMessage) {
        super(imMessage);
    }

    public final void parse(JSONObject var1) {
//        if((var1 = d.f(var1, "tinfo")) != null) {
//            TeamFieldEnum[] var2;
//            int var3 = (var2 = TeamFieldEnum.values()).length;
//
//            for(int var4 = 0; var4 < var3; ++var4) {
//                TeamFieldEnum var5;
//                String var6 = String.valueOf((var5 = var2[var4]).getValue());
//                if(var1.has(var6)) {
//                    Object var7 = null;
//                    if(var5.getFieldType() == String.class) {
//                        var7 = d.e(var1, var6);
//                    } else if(var5.getFieldType() == VerifyTypeEnum.class) {
//                        var7 = VerifyTypeEnum.typeOfValue(d.a(var1, var6));
//                    } else if(var5.getFieldType() == TeamBeInviteModeEnum.class) {
//                        var7 = TeamBeInviteModeEnum.typeOfValue(d.a(var1, var6));
//                    } else if(var5.getFieldType() == TeamInviteModeEnum.class) {
//                        var7 = TeamInviteModeEnum.typeOfValue(d.a(var1, var6));
//                    } else if(var5.getFieldType() == TeamUpdateModeEnum.class) {
//                        var7 = TeamUpdateModeEnum.typeOfValue(d.a(var1, var6));
//                    } else if(var5.getFieldType() == TeamExtensionUpdateModeEnum.class) {
//                        var7 = TeamExtensionUpdateModeEnum.typeOfValue(d.a(var1, var6));
//                    } else if(var5.getFieldType() == Integer.class) {
//                        var7 = Integer.valueOf(d.a(var1, var6));
//                    } else if(var5.getFieldType() == TeamAllMuteModeEnum.class) {
//                        var7 = TeamAllMuteModeEnum.typeOfValue(d.a(var1, var6));
//                    }
//
//                    this.updatedFields.put(var5, var7);
//                }
//            }
//
//        }
    }

    public Object getValue() {
        return this.updatedFields.size() > 0?((Map.Entry)this.updatedFields.entrySet().iterator().next()).getValue():null;
    }

    public TeamFieldEnum getField() {
        return this.updatedFields.size() > 0?(TeamFieldEnum)((Map.Entry)this.updatedFields.entrySet().iterator().next()).getKey():null;
    }

    public Map<TeamFieldEnum, Object> getUpdatedFields() {
        return this.updatedFields;
    }
}