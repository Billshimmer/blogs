package com.netease.nimlib.sdk.team.constant;

import java.io.Serializable;

/**
 * Created by dansejijie on 17/4/15.
 */

public enum TeamFieldEnum {
    undefined(-1, (Class)null),
    Name(3, String.class),
    ICON(20, String.class),
    Introduce(14, String.class),
    Announcement(15, String.class),
    Extension(18, String.class),
    Ext_Server(19, String.class),
    VerifyType(16, VerifyTypeEnum.class),
    InviteMode(22, TeamInviteModeEnum.class),
    BeInviteMode(21, TeamBeInviteModeEnum.class),
    TeamUpdateMode(23, TeamUpdateModeEnum.class),
    TeamExtensionUpdateMode(24, TeamExtensionUpdateModeEnum.class),
    AllMute(100, TeamAllMuteModeEnum.class);

    private int value;
    private Class<? extends Serializable> fieldType;

    private TeamFieldEnum(int var3, Class<? extends Serializable> var4) {
        this.value = var3;
        this.fieldType = var4;
    }

    public static TeamFieldEnum typeOfValue(int var0) {
        TeamFieldEnum[] var1;
        int var2 = (var1 = values()).length;

        for(int var3 = 0; var3 < var2; ++var3) {
            TeamFieldEnum var4;
            if((var4 = var1[var3]).value == var0) {
                return var4;
            }
        }

        return undefined;
    }

    public final int getValue() {
        return this.value;
    }

    public final Class<? extends Serializable> getFieldType() {
        return this.fieldType;
    }
}
