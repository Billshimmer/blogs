package com.netease.nimlib.sdk.team.model;

import com.netease.nimlib.sdk.team.constant.TeamMemberType;

import java.io.Serializable;
import java.util.Map;

/**
 * Created by dansejijie on 17/4/4.
 */

public interface TeamMember extends Serializable {
    String getTid();

    String getAccount();

    TeamMemberType getType();

    String getTeamNick();

    boolean isInTeam();

    Map<String, Object> getExtension();

    boolean isMute();

    long getJoinTime();
}
