package com.netease.nimlib.sdk.friend.model;

import java.io.Serializable;
import java.util.Map;

/**
 * Created by dansejijie on 17/4/15.
 */


public interface Friend extends Serializable {
    String getAccount();

    String getAlias();

    Map<String, Object> getExtension();
}
