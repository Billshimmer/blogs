package com.netease.nimlib.sdk;

import android.content.Context;
import android.nfc.Tag;
import android.os.Handler;
import android.util.Log;

import com.hyphenate.chat.EMClient;
import com.hyphenate.chat.EMConversation;
import com.hyphenate.chat.EMMessage;
import com.netease.nimlib.sdk.auth.LoginInfo;
import com.netease.nimlib.sdk.auth.constant.LoginSyncStatus;
import com.netease.nimlib.sdk.friend.model.BlackListChangedNotify;
import com.netease.nimlib.sdk.friend.model.Friend;
import com.netease.nimlib.sdk.friend.model.FriendChangedNotify;
import com.netease.nimlib.sdk.msg.constant.MsgTypeEnum;
import com.netease.nimlib.sdk.msg.constant.SessionTypeEnum;
import com.netease.nimlib.sdk.msg.model.AttachmentProgress;
import com.netease.nimlib.sdk.msg.model.CustomNotification;
import com.netease.nimlib.sdk.msg.model.IMMessage;
import com.netease.nimlib.sdk.msg.model.QueryDirectionEnum;
import com.netease.nimlib.sdk.msg.model.RecentContact;
import com.netease.nimlib.sdk.search.model.MsgIndexRecord;
import com.netease.nimlib.sdk.team.constant.TeamFieldEnum;
import com.netease.nimlib.sdk.team.constant.TeamMemberType;
import com.netease.nimlib.sdk.team.model.Team;
import com.netease.nimlib.sdk.team.constant.TeamBeInviteModeEnum;
import com.netease.nimlib.sdk.team.constant.TeamExtensionUpdateModeEnum;
import com.netease.nimlib.sdk.team.constant.TeamInviteModeEnum;
import com.netease.nimlib.sdk.team.constant.TeamTypeEnum;
import com.netease.nimlib.sdk.team.constant.TeamUpdateModeEnum;
import com.netease.nimlib.sdk.team.constant.VerifyTypeEnum;
import com.netease.nimlib.sdk.team.model.TeamMember;
import com.netease.nimlib.sdk.uinfo.UserServiceObserve;
import com.netease.nimlib.sdk.uinfo.model.NimUserInfo;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;


/**
 * Created by dansejijie on 17/4/4.
 */

public class NIMClient {

    private static final String TAG=NIMClient.class.getSimpleName();

//    public NIMClient() {
//    }
//
//    public static void init(Context var0, LoginInfo var1, SDKOptions var2) {
//
//    }
//
//    public static Object getService(Class var0) {
//        try {
//            return var0.newInstance();
//        }catch (Exception e){
//            e.printStackTrace();
//            throw new ClassCastException("not found");
//        }
//    }
//
//    public static StatusCode getStatus() {
//        return StatusCode.CONNECTING;
//    }
//
//    public static void toggleNotification(boolean var0) {
//
//    }
//
//    public static void updateStatusBarNotificationConfig(StatusBarNotificationConfig var0) {
//
//    }
//
//    public static void updateStrings(NimStrings var0) {
//
//    }
//
//    public static String getSdkStorageDirPath() {
//
//        return Environment.getExternalStorageDirectory().getAbsolutePath();
//    }

    static NIMClient instanece;

    public NIMClient() {
    }

    public static void init(Context var0, LoginInfo var1, SDKOptions var2) {
        //b.a(var0, var1, var2);
    }

    public static NIMClient getService(Class var0) {

        if (instanece == null) {
            instanece = new NIMClient();
        }
        return instanece;
    }

    public AbortableFuture downloadAttachment(IMMessage imMessage, boolean b) {

        return new AbortableFuture() {
            @Override
            public boolean abort() {
                return false;
            }

            @Override
            public void setCallback(RequestCallback var1) {

            }
        };
    }

    public InvocationFuture queryMessageListByType(final MsgTypeEnum msgTypeEnum, final String account) {

        return new InvocationFuture() {
            @Override
            public void setCallback(RequestCallback var1) {

                try {
                    EMConversation conversation = EMClient.getInstance().chatManager().getConversation(account);
                    List<EMMessage> msgs = new ArrayList<>();
                    if (conversation != null) {
                        List<EMMessage> temp = conversation.getAllMessages();
                        if (temp != null && temp.size() > 0) {
                            for (int i = 0; i < temp.size(); i++) {
                                if (temp.get(i).getType() == MsgTypeEnum.IMMessageMsgTypeEnumConvertToEMMessageMsgTypeEnum(msgTypeEnum)) {
                                    if (temp.get(i).status() == EMMessage.Status.SUCCESS) {
                                        msgs.add(temp.get(i));
                                    }

                                }
                            }
                            var1.onSuccess(msgs);
                        } else {
                            var1.onFailed(0);
                        }
                    } else {
                        var1.onFailed(0);
                    }
                } catch (Exception e) {
                    var1.onException(e);
                }
            }
        };
    }

    public void observeMsgStatus(Observer<IMMessage> imMessageObserver, boolean b) {

    }

    public void sendCustomNotification(CustomNotification config) {

    }

    public void observeLoginSyncDataStatus(Observer<LoginSyncStatus>statusObserver, boolean b){

    }

    public AbortableFuture transVoiceToText(String url, String path, long duration) {

        return new AbortableFuture() {
            @Override
            public boolean abort() {
                return false;
            }

            @Override
            public void setCallback(RequestCallback var1) {

            }
        };

    }

    public void observeCustomNotification(Observer<CustomNotification> customNotification, boolean b) {
    }


    public void sendMessage(IMMessage imMessage, boolean b) {

        EMClient.getInstance().chatManager().sendMessage(imMessage.getEMMessage());
    }

    public void setChattingAccount(String sessionId, SessionTypeEnum sessionTypeEnum) {

    }

    public void deleteChattingHistory(IMMessage imMessage) {
        //// TODO: 17/4/10
        EMClient.getInstance().chatManager().getConversation(imMessage.getEMMessage().getUserName()).removeMessage(imMessage.getUuid());
    }

    public void sendMessageReceipt(String account, IMMessage imMessage) {

    }

    public void updateIMMessageStatus(IMMessage imMessage) {
        EMClient.getInstance().chatManager().updateMessage(imMessage.getEMMessage());
    }

    public void saveMessageToLocalEx(IMMessage imMessage,boolean b,long time){

    }
    private InvocationFuture queryMessageListExInvocationFuture;
    private RequestCallback queryRequestCallback;

    public InvocationFuture queryMessageListEx(final IMMessage anchor, QueryDirectionEnum direction, final int count, boolean b) {

        return new InvocationFuture() {
            @Override
            public void setCallback(final RequestCallback var1) {

                Handler handler = new Handler();
                handler.post(new Runnable() {
                    @Override
                    public void run() {
                        String userName = anchor.getUserName();
                        EMConversation conversation = EMClient.getInstance().chatManager().getConversation(userName);

                        if (conversation == null) {
                            var1.onSuccess(new ArrayList<EMMessage>());
                            Log.e(TAG,"获取会话为空，请查看是否是因为第一次与朋友聊天为空，还是获取异常，本次处理当中第一次与朋友聊天");
                        } else {

                            conversation.markAllMessagesAsRead();
                            List<EMMessage> messages = conversation.loadMoreMsgFromDB(anchor.getUuid(), count);

                            List<IMMessage> messages1 = new ArrayList<>();
                            if (messages != null) {
                                for (int i = 0; i < messages.size(); i++) {
                                    messages1.add(new IMMessage(messages.get(i)));
                                }
                                var1.onSuccess(messages1);
                            } else {
                                var1.onSuccess(messages1);
                            }
                        }
                    }
                });
            }

        };
    }

    public InvocationFuture pullMessageHistory(IMMessage anchor, int count, boolean b) {

        return new InvocationFuture() {
            @Override
            public void setCallback(RequestCallback var1) {
                var1.onFailed(0);
            }
        };
    }

    public InvocationFuture revokeMessage(IMMessage imMessage) {
        return new InvocationFuture() {
            @Override
            public void setCallback(RequestCallback var1) {
                var1.onFailed(0);
            }
        };
    }


//    private EMMessageListener msgListener = new EMMessageListener() {
//
//        @Override
//        public void onMessageReceived(List<EMMessage> messages) {
//            //收到消息
//        }
//
//        @Override
//        public void onCmdMessageReceived(List<EMMessage> messages) {
//            //收到透传消息
//        }
//
//        @Override
//        public void onMessageRead(List<EMMessage> messages) {
//            //收到已读回执
//        }
//
//        @Override
//        public void onMessageDelivered(List<EMMessage> message) {
//            //收到已送达回执
//        }
//
//        @Override
//        public void onMessageChanged(EMMessage message, Object change) {
//            //消息状态变动
//        }
//    };
//
//    public void registerObserver(boolean register){
//        if (register){
//            EMClient.getInstance().chatManager().addMessageListener(msgListener);
//
//        }else {
//            EMClient.getInstance().chatManager().removeMessageListener(msgListener);
//        }
//    }


    public static void getService() {

        //return b.a(var0);
    }


//    public static StatusCode getStatus() {
//        return d.e();
//    }

    public static void toggleNotification(boolean var0) {

    }

    public static void updateStatusBarNotificationConfig(StatusBarNotificationConfig var0) {

    }

    public static void updateStrings(NimStrings var0) {
//        b.a(var0);
    }

    public static String getSdkStorageDirPath() {
        return " ";
    }

    class a implements AbortableFuture<String> {
        @Override
        public boolean abort() {
            return false;
        }

        @Override
        public void setCallback(RequestCallback var1) {

        }
    }



    public List<Friend> getFriends(){
        return new ArrayList<>();
    }

    public List<String> getFriendAccounts(){
        return new ArrayList<>();
    }

    public List<String>getBlackList(){
        return new ArrayList<>();
    }

    public void observeFriendChangedNotify(Observer<FriendChangedNotify> observer, boolean b){

    }

    public void observeBlackListChangedNotify(Observer<BlackListChangedNotify>observer,boolean b){

    }

    public boolean isInBlackList(String account){
        return true;
    }

    public void deleteRecentContact2(String account,SessionTypeEnum sessionTypeEnum){

    }

    public boolean isMyFriend(String account){
        return true;
    }



    public Team queryTeamBlock(String account){
        return new Team() {
            @Override
            public String getId() {
                return null;
            }

            @Override
            public String getName() {
                return null;
            }

            @Override
            public String getIcon() {
                return null;
            }

            @Override
            public TeamTypeEnum getType() {
                return null;
            }

            @Override
            public String getAnnouncement() {
                return null;
            }

            @Override
            public String getIntroduce() {
                return null;
            }

            @Override
            public String getCreator() {
                return null;
            }

            @Override
            public int getMemberCount() {
                return 0;
            }

            @Override
            public int getMemberLimit() {
                return 0;
            }

            @Override
            public VerifyTypeEnum getVerifyType() {
                return null;
            }

            @Override
            public long getCreateTime() {
                return 0;
            }

            @Override
            public boolean isMyTeam() {
                return false;
            }

            @Override
            public void setExtension(String var1) {

            }

            @Override
            public String getExtension() {
                return null;
            }

            @Override
            public String getExtServer() {
                return null;
            }

            @Override
            public boolean mute() {
                return false;
            }

            @Override
            public TeamInviteModeEnum getTeamInviteMode() {
                return null;
            }

            @Override
            public TeamBeInviteModeEnum getTeamBeInviteMode() {
                return null;
            }

            @Override
            public TeamUpdateModeEnum getTeamUpdateMode() {
                return null;
            }

            @Override
            public TeamExtensionUpdateModeEnum getTeamExtensionUpdateMode() {
                return null;
            }

            @Override
            public boolean isAllMute() {
                return false;
            }
        };
    }


    public void observeUserInfoUpdate(Observer<List<NimUserInfo>>observer, boolean b){

    }

    public InvocationFuture fetchUserInfo(List<String> account){
        return new InvocationFuture() {
            @Override
            public void setCallback(RequestCallback var1) {

            }
        };
    }

    public List<NimUserInfo>getAllUserInfo(){
        return new ArrayList<>();
    }



    public InvocationFuture queryTeam(String teamId){
        return new InvocationFuture() {
            @Override
            public void setCallback(RequestCallback var1) {

            }
        };
    }



    public void observeTeamUpdate(Observer<List<Team>>observer,boolean b){

    }

    public void observeTeamRemove(Observer<Team>observer,boolean b){

    }

    public void observeMemberUpdate(Observer<List<TeamMember>>observer,boolean b){

    }

    public void observeMemberRemove(Observer<TeamMember>observer,boolean b){

    }

    public List<Team> queryTeamListBlock(){
        return new ArrayList<>();
    }

    public InvocationFuture queryMemberList(String teamId){
        return new InvocationFuture() {
            @Override
            public void setCallback(RequestCallback var1) {

            }
        };
    }

    public InvocationFuture queryTeamMember(String teamId,String account){
        return new InvocationFuture() {
            @Override
            public void setCallback(RequestCallback var1) {

            }
        };
    }

    public TeamMember queryTeamMemberBlock(String teamId,String account){
        return new TeamMember() {
            @Override
            public String getTid() {
                return null;
            }

            @Override
            public String getAccount() {
                return null;
            }

            @Override
            public TeamMemberType getType() {
                return null;
            }

            @Override
            public String getTeamNick() {
                return null;
            }

            @Override
            public boolean isInTeam() {
                return false;
            }

            @Override
            public Map<String, Object> getExtension() {
                return null;
            }

            @Override
            public boolean isMute() {
                return false;
            }

            @Override
            public long getJoinTime() {
                return 0;
            }
        };
    }


    public List<MsgIndexRecord>searchSessionNextPageBlock(String query,SessionTypeEnum sessionTypeEnum,String sessionId,MsgIndexRecord msgIndexRecord,int count){
        return new ArrayList<>();
    }

    public List<MsgIndexRecord>searchSessionBlock(String query,SessionTypeEnum sessionTypeEnum,String sessionId){
        return new ArrayList<>();
    }

    public List<MsgIndexRecord>searchAllSessionBlock(String query,int count){
        return new ArrayList<>();
    }

    public InvocationFuture updateTeam(String teamId, TeamFieldEnum teamFieldEnum,String text){
        return new InvocationFuture() {
            @Override
            public void setCallback(RequestCallback var1) {

            }
        };
    }

    public InvocationFuture muteTeam(String teamId,boolean checked){
        return new InvocationFuture() {
            @Override
            public void setCallback(RequestCallback var1) {

            }
        };
    }

    public InvocationFuture removeMember(String teamId,String account){
        return new InvocationFuture() {
            @Override
            public void setCallback(RequestCallback var1) {

            }
        };
    }

    public InvocationFuture addMembers(String teamId,List<String>selected){
        return new InvocationFuture() {
            @Override
            public void setCallback(RequestCallback var1) {

            }
        };
    }

    public InvocationFuture quitTeam(String temaId){
        return new InvocationFuture() {
            @Override
            public void setCallback(RequestCallback var1) {

            }
        };
    }

    public InvocationFuture muteTeamMember(String teamId,String account,boolean b){
        return new InvocationFuture() {
            @Override
            public void setCallback(RequestCallback var1) {

            }
        };
    }

    public InvocationFuture updateMemberNick(String teamId,String account,String name){
        return new InvocationFuture() {
            @Override
            public void setCallback(RequestCallback var1) {

            }
        };
    }

    public InvocationFuture addManagers(String teamId,List<String>account){
        return new InvocationFuture() {
            @Override
            public void setCallback(RequestCallback var1) {

            }
        };
    }

    public InvocationFuture removeManagers(String teamId,List<String>account){
        return new InvocationFuture() {
            @Override
            public void setCallback(RequestCallback var1) {

            }
        };
    }

    public InvocationFuture transferTeam(String teamId,String account,boolean b){
        return new InvocationFuture() {
            @Override
            public void setCallback(RequestCallback var1) {

            }
        };
    }

    public void observeAttachmentProgress(Observer<AttachmentProgress>observer,boolean b){

    }

    public InvocationFuture dismissTeam(String teamId){
        return new InvocationFuture() {
            @Override
            public void setCallback(RequestCallback var1) {

            }
        };
    }

    public InvocationFuture updateTeam(String teamId,TeamFieldEnum teamFieldEnum, VerifyTypeEnum verifyTypeEnum){
        return new InvocationFuture() {
            @Override
            public void setCallback(RequestCallback var1) {

            }
        };
    }

    public InvocationFuture updateTeam(String teamId, TeamFieldEnum teamFieldEnum, TeamInviteModeEnum type){
        return new InvocationFuture() {
            @Override
            public void setCallback(RequestCallback var1) {

            }
        };
    }

    public InvocationFuture updateTeam(String teamId, TeamFieldEnum teamFieldEnum,TeamUpdateModeEnum type){
        return new InvocationFuture() {
            @Override
            public void setCallback(RequestCallback var1) {

            }
        };
    }

    public InvocationFuture updateTeam(String teamId, TeamFieldEnum teamFieldEnum,TeamBeInviteModeEnum type){
        return new InvocationFuture() {
            @Override
            public void setCallback(RequestCallback var1) {

            }
        };
    }

    public AbortableFuture<String> upload(File file,String type){
        return new AbortableFuture<String>() {
            @Override
            public boolean abort() {
                return false;
            }

            @Override
            public void setCallback(RequestCallback var1) {

            }
        };
    }

    public InvocationFuture queryMessageListByType(MsgTypeEnum msgTypeEnum,IMMessage imMessage,int i){
        return new InvocationFuture() {
            @Override
            public void setCallback(RequestCallback var1) {

            }
        };
    }

    public void deleteRecentContact(RecentContact recentContact){

    }

    public void clearChattingHistory(String id,SessionTypeEnum sessionTypeEnum){

    }

    public void updateRecent(RecentContact recentContact){

    }

    public List<IMMessage> queryMessageListByUuidBlock(List<String> uuid){
        return new ArrayList<>();
    }

    public InvocationFuture deleteRoamingRecentContact(String id,SessionTypeEnum type){
        return new InvocationFuture() {
            @Override
            public void setCallback(RequestCallback var1) {

            }
        };
    }

    public InvocationFuture queryRecentContacts(){
        return new InvocationFuture() {
            @Override
            public void setCallback(RequestCallback var1) {

            }
        };
    }

    public int getTotalUnreadCount(){
        return 0;
    }

    public AbortableFuture<LoginInfo>login(LoginInfo loginInfo){
        return new AbortableFuture<LoginInfo>() {
            @Override
            public boolean abort() {
                return false;
            }

            @Override
            public void setCallback(RequestCallback var1) {

            }
        };
    }
}
