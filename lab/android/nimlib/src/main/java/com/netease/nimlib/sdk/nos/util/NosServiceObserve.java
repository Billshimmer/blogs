package com.netease.nimlib.sdk.nos.util;

import com.netease.nimlib.sdk.Observer;
import com.netease.nimlib.sdk.nos.model.NosTransferInfo;
import com.netease.nimlib.sdk.nos.model.NosTransferProgress;

/**
 * Created by dansejijie on 17/4/15.
 */

public interface NosServiceObserve {
    void observeNosTransferStatus(Observer<NosTransferInfo> var1, boolean var2);

    void observeNosTransferProgress(Observer<NosTransferProgress> var1, boolean var2);
}
