package com.netease.nimlib.sdk.friend;

import com.netease.nimlib.sdk.Observer;
import com.netease.nimlib.sdk.friend.model.BlackListChangedNotify;
import com.netease.nimlib.sdk.friend.model.FriendChangedNotify;
import com.netease.nimlib.sdk.friend.model.MuteListChangedNotify;

/**
 * Created by dansejijie on 17/4/15.
 */

public interface FriendServiceObserve {
    void observeFriendChangedNotify(Observer<FriendChangedNotify> var1, boolean var2);

    void observeBlackListChangedNotify(Observer<BlackListChangedNotify> var1, boolean var2);

    void observeMuteListChangedNotify(Observer<MuteListChangedNotify> var1, boolean var2);
}
