package com.netease.nimlib.sdk.friend.model;

import com.netease.nimlib.sdk.team.model.Team;

import java.io.Serializable;
import java.util.Map;

/**
 * Created by dansejijie on 17/4/15.
 */


public class TeamInviteNotify implements Serializable {
    private Team team;
    private Map<String, Object> extension;

    public TeamInviteNotify(Team var1, Map<String, Object> var2) {
        this.team = var1;
        this.extension = var2;
    }

    public Map<String, Object> getExtension() {
        return this.extension;
    }

    public Team getTeam() {
        return this.team;
    }
}
