package com.netease.nimlib.sdk;

/**
 * Created by dansejijie on 17/4/9.
 */

public final class ResponseCode {
    public static final short RES_SUCCESS = 200;
    public static final short RES_EUIDPASS = 302;
    public static final short RES_ADDR_BLOCKED = 310;
    public static final short RES_IP_NOT_ALLOWED = 315;
    public static final short RES_VERSION_EXPIRED = 317;
    public static final short RES_FORBIDDEN = 403;
    public static final short RES_ENONEXIST = 404;
    public static final short RES_ETIMEOUT = 408;
    public static final short RES_EPARAM = 414;
    public static final short RES_ECONNECTION = 415;
    public static final short RES_EFREQUENTLY = 416;
    public static final short RES_EEXIST = 417;
    public static final short RES_ACCOUNT_BLOCK = 422;
    public static final short RES_DEVICE_NOT_TRUST = 431;
    public static final short RES_EUNKNOWN = 500;
    public static final short RES_TOOBUZY = 503;
    public static final short RES_OVERDUE = 508;
    public static final short RES_INVALID = 509;
    public static final short RES_TEAM_ECOUNT_LIMIT = 801;
    public static final short RES_TEAM_ENACCESS = 802;
    public static final short RES_TEAM_ENOTEXIST = 803;
    public static final short RES_TEAM_EMEMBER_NOTEXIST = 804;
    public static final short RES_TEAM_ERR_TYPE = 805;
    public static final short RES_TEAM_LIMIT = 806;
    public static final short RES_TEAM_USER_STATUS_ERR = 807;
    public static final short RES_TEAM_APPLY_SUCCESS = 808;
    public static final short RES_TEAM_ALREADY_IN = 809;
    public static final short RES_TEAM_INVITE_SUCCESS = 810;
    public static final short RES_EPACKET = 999;
    public static final short RES_EUNPACKET = 998;
    public static final short RES_IN_BLACK_LIST = 7101;
    public static final short RES_CHATROOM_IM_LINK_EXCEPTION = 13001;
    public static final short RES_CHATROOM_STATUS_EXCEPTION = 13002;
    public static final short RES_CHATROOM_BLACKLIST = 13003;
    public static final short RES_CHATROOM_MUTED = 13004;
    public static final short RES_CHATROOM_ROOM_MUTED = 13006;
    public static final short RES_UNKNOWN = -1;
    public static final short RES_EXCEPTION = 1000;
    public static final short RES_OFFLINE = 1;
    public static final short RES_UNSUPPORT = 2;
    public static final short RES_REGISTER_PUSH_SDK_FAILED = 3;

    public ResponseCode() {
    }
}