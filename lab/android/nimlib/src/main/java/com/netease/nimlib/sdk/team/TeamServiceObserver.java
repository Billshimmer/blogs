package com.netease.nimlib.sdk.team;

import com.netease.nimlib.sdk.Observer;
import com.netease.nimlib.sdk.team.model.*;

import java.util.List;

/**
 * Created by dansejijie on 17/4/15.
 */

public interface TeamServiceObserver {
    void observeTeamUpdate(Observer<List<com.netease.nimlib.sdk.team.model.Team>> var1, boolean var2);

    void observeTeamRemove(Observer<com.netease.nimlib.sdk.team.model.Team> var1, boolean var2);

    void observeMemberUpdate(Observer<List<TeamMember>> var1, boolean var2);

    void observeMemberRemove(Observer<TeamMember> var1, boolean var2);
}