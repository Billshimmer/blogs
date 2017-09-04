package com.netease.nim.uikit.common.http;

import android.content.Context;

import com.netease.nim.uikit.system.IMMessage;

import java.util.List;

/**
 * Created by tygzx on 17/2/27.
 */

public interface MessageRemoteLoader {

    void loadFromRemote(Context context,String toId,MessageRemoteLoaderListener listener);
}
