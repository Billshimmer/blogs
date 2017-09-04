package com.netease.nimlib.sdk.team;

import com.netease.nimlib.sdk.team.constant.TeamBeInviteModeEnum;
import com.netease.nimlib.sdk.team.constant.TeamExtensionUpdateModeEnum;
import com.netease.nimlib.sdk.team.constant.TeamInviteModeEnum;
import com.netease.nimlib.sdk.team.constant.TeamTypeEnum;
import com.netease.nimlib.sdk.team.constant.TeamUpdateModeEnum;
import com.netease.nimlib.sdk.team.constant.VerifyTypeEnum;

import java.io.Serializable;

public interface Team extends Serializable {
    String getId();

    String getName();

    String getIcon();

    TeamTypeEnum getType();

    String getAnnouncement();

    String getIntroduce();

    String getCreator();

    int getMemberCount();

    int getMemberLimit();

    VerifyTypeEnum getVerifyType();

    long getCreateTime();

    boolean isMyTeam();

    void setExtension(String var1);

    String getExtension();

    String getExtServer();

    boolean mute();

    TeamInviteModeEnum getTeamInviteMode();

    TeamBeInviteModeEnum getTeamBeInviteMode();

    TeamUpdateModeEnum getTeamUpdateMode();

    TeamExtensionUpdateModeEnum getTeamExtensionUpdateMode();

    boolean isAllMute();
}