//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by Fernflower decompiler)
//

package com.netease.nimlib.sdk.msg.constant;

public enum NotificationType {
    undefined(-1),
    InviteMember(0),
    KickMember(1),
    LeaveTeam(2),
    UpdateTeam(3),
    DismissTeam(4),
    PassTeamApply(5),
    TransferOwner(6),
    AddTeamManager(7),
    RemoveTeamManager(8),
    AcceptInvite(9),
    MuteTeamMember(10),
    ChatRoomMemberIn(301),
    ChatRoomMemberExit(302),
    ChatRoomMemberBlackAdd(303),
    ChatRoomMemberBlackRemove(304),
    ChatRoomMemberMuteAdd(305),
    ChatRoomMemberMuteRemove(306),
    ChatRoomManagerAdd(307),
    ChatRoomManagerRemove(308),
    ChatRoomCommonAdd(309),
    ChatRoomCommonRemove(310),
    ChatRoomClose(311),
    ChatRoomInfoUpdated(312),
    ChatRoomMemberKicked(313),
    ChatRoomMemberTempMuteAdd(314),
    ChatRoomMemberTempMuteRemove(315),
    ChatRoomMyRoomRoleUpdated(316),
    ChatRoomQueueChange(317),
    ChatRoomRoomMuted(318),
    ChatRoomRoomDeMuted(319),
    AVChatMissedCall(10),
    AVChatRecord(11);

    private int value;

    private NotificationType(int var3) {
        this.value = var3;
    }

    public final int getValue() {
        return this.value;
    }

    public static NotificationType typeOfValue(int var0) {
        NotificationType[] var1;
        int var2 = (var1 = values()).length;

        for(int var3 = 0; var3 < var2; ++var3) {
            NotificationType var4;
            if((var4 = var1[var3]).getValue() == var0) {
                return var4;
            }
        }

        return undefined;
    }
}
