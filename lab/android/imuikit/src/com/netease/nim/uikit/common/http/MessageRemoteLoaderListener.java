package com.netease.nim.uikit.common.http;

import com.netease.nim.uikit.system.IMMessage;

import java.io.IOException;
import java.util.List;

import okhttp3.Call;
import okhttp3.Response;
import okhttp3.ResponseBody;

/**
 * Created by tygzx on 17/2/27.
 */

public interface MessageRemoteLoaderListener {

    void onFailure();

    void onSuccessed(List<IMMessage>messages);
}
