package com.netease.nimlib.sdk.nos;

import com.netease.nimlib.sdk.AbortableFuture;
import com.netease.nimlib.sdk.nos.model.NosThumbParam;

import java.io.File;

/**
 * Created by dansejijie on 17/4/15.
 */

public interface NosService {
    AbortableFuture<String> upload(File var1, String var2);

    AbortableFuture<Void> download(String var1, NosThumbParam var2, String var3);
}