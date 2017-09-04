//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by Fernflower decompiler)
//

package com.netease.nimlib.sdk.team;

import com.netease.nimlib.sdk.InvocationFuture;
import com.netease.nimlib.sdk.team.constant.TeamFieldEnum;
import com.netease.nimlib.sdk.team.constant.TeamTypeEnum;
import com.netease.nimlib.sdk.team.model.Team;
import com.netease.nimlib.sdk.team.model.TeamMember;
import java.io.Serializable;
import java.util.List;
import java.util.Map;

public interface TeamService {
    InvocationFuture<Team> createTeam(Map<TeamFieldEnum, Serializable> var1, TeamTypeEnum var2, String var3, List<String> var4);

    InvocationFuture<Void> addMembers(String var1, List<String> var2);

    InvocationFuture<Void> removeMember(String var1, String var2);

    InvocationFuture<Void> removeMembers(String var1, List<String> var2);

    InvocationFuture<Void> updateName(String var1, String var2);

    InvocationFuture<Void> updateTeam(String var1, TeamFieldEnum var2, Serializable var3);

    InvocationFuture<Void> updateTeamFields(String var1, Map<TeamFieldEnum, Serializable> var2);

    InvocationFuture<Void> dismissTeam(String var1);

    InvocationFuture<Void> quitTeam(String var1);

    InvocationFuture<Team> queryTeam(String var1);

    Team queryTeamBlock(String var1);

    InvocationFuture<Team> searchTeam(String var1);

    InvocationFuture<List<Team>> queryTeamList();

    List<Team> queryTeamListBlock();

    InvocationFuture<List<Team>> queryTeamListById(List<String> var1);

    List<Team> queryTeamListByIdBlock(List<String> var1);

    InvocationFuture<List<Team>> queryTeamListByType(TeamTypeEnum var1);

    List<Team> queryTeamListByTypeBlock(TeamTypeEnum var1);

    int queryTeamCountBlock();

    int queryTeamCountByTypeBlock(TeamTypeEnum var1);

    InvocationFuture<Team> applyJoinTeam(String var1, String var2);

    InvocationFuture<Void> passApply(String var1, String var2);

    InvocationFuture<Void> rejectApply(String var1, String var2, String var3);

    InvocationFuture<List<TeamMember>> addManagers(String var1, List<String> var2);

    InvocationFuture<List<TeamMember>> removeManagers(String var1, List<String> var2);

    InvocationFuture<List<TeamMember>> transferTeam(String var1, String var2, boolean var3);

    InvocationFuture<Void> acceptInvite(String var1, String var2);

    InvocationFuture<Void> declineInvite(String var1, String var2, String var3);

    InvocationFuture<List<TeamMember>> queryMemberList(String var1);

    InvocationFuture<TeamMember> queryTeamMember(String var1, String var2);

    TeamMember queryTeamMemberBlock(String var1, String var2);

    List<TeamMember> queryMutedTeamMembers(String var1);

    InvocationFuture<Void> updateMyTeamNick(String var1, String var2);

    InvocationFuture<Void> updateMemberNick(String var1, String var2, String var3);

    InvocationFuture<Void> updateMyMemberExtension(String var1, Map<String, Object> var2);

    InvocationFuture<Void> muteTeam(String var1, boolean var2);

    InvocationFuture<Void> muteTeamMember(String var1, String var2, boolean var3);
}
