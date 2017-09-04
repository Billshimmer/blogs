package com.netease.nimlib.sdk.friend.model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by dansejijie on 17/4/15.
 */

public class BlackListChangedNotify implements Serializable {
    private List<String> addedAccounts = new ArrayList();
    private List<String> removedAccounts = new ArrayList();

    public BlackListChangedNotify(List<String> var1, List<String> var2) {
        if(var1 != null && !var1.isEmpty()) {
            this.addedAccounts.addAll(var1);
        }

        if(var2 != null && !var2.isEmpty()) {
            this.removedAccounts.addAll(var2);
        }

    }

    public BlackListChangedNotify(String var1, String var2) {
        if(var1 != null) {
            this.addedAccounts.add(var1);
        }

        if(var2 != null) {
            this.removedAccounts.add(var2);
        }

    }

    public List<String> getAddedAccounts() {
        return this.addedAccounts;
    }

    public List<String> getRemovedAccounts() {
        return this.removedAccounts;
    }
}
