package com.lightappbuilder.lab4.labim;

import com.netease.nim.uikit.extra.easeui.model.EaseNotifier;

/**
 * Created by tygzx on 17/4/13.
 */

public class IMOptions {

    public IMOptions(){

    }

    private EaseNotifier.EaseNotificationInfoProvider provider;

    public void setProvider(EaseNotifier.EaseNotificationInfoProvider provider) {
        this.provider = provider;
    }

    public EaseNotifier.EaseNotificationInfoProvider getProvider() {

        return provider;
    }
}
