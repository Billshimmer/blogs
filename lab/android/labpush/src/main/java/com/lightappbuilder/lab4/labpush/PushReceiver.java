package com.lightappbuilder.lab4.labpush;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

/**
 * Created by yinhf on 16/7/15.
 */
public class PushReceiver extends BroadcastReceiver {

    @Override
    public void onReceive(Context context, Intent data) {
        LABPushModule.onPushReceive(context, data);
    }
}
