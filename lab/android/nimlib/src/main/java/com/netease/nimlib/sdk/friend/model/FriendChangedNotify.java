package com.netease.nimlib.sdk.friend.model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by dansejijie on 17/4/15.
 */


public class FriendChangedNotify implements Serializable {
    private List<Friend> updatedFriends = new ArrayList();
    private List<String> deletedFriends = new ArrayList();

    public FriendChangedNotify(List<Friend> var1, List<String> var2) {
        if(var1 != null && !var1.isEmpty()) {
            this.updatedFriends.addAll(var1);
        }

        if(var2 != null && !var2.isEmpty()) {
            this.deletedFriends.addAll(var2);
        }

    }

    public FriendChangedNotify(Friend var1, String var2) {
        if(var1 != null) {
            this.updatedFriends.add(var1);
        }

        if(var2 != null) {
            this.deletedFriends.add(var2);
        }

    }

    public List<Friend> getAddedOrUpdatedFriends() {
        return this.updatedFriends;
    }

    public List<String> getDeletedFriends() {
        return this.deletedFriends;
    }
}
