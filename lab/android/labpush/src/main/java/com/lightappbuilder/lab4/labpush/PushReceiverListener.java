package com.lightappbuilder.lab4.labpush;

import android.content.Context;
import android.content.Intent;

/**
 * Created by yinhf on 2017/1/6.
 */

public interface PushReceiverListener {

    void onPushReceive(Context context, Intent data);

}
