package com.netease.nim.uikit.system;

import java.io.Serializable;

/**
 * Created by tygzx on 17/1/10.
 */

public interface Team extends Serializable {
    String getId();

    String getName();

    String getIcon();

    //TeamTypeEnum getType();

    String getAnnouncement();

    String getIntroduce();

    String getCreator();

    int getMemberCount();

    int getMemberLimit();

    //VerifyTypeEnum getVerifyType();

    long getCreateTime();

    boolean isMyTeam();

    void setExtension(String var1);

    String getExtension();

    String getExtServer();

    boolean mute();

    /*TeamInviteModeEnum getTeamInviteMode();

    TeamBeInviteModeEnum getTeamBeInviteMode();

    TeamUpdateModeEnum getTeamUpdateMode();

    TeamExtensionUpdateModeEnum getTeamExtensionUpdateMode();*/

    boolean isAllMute();
}