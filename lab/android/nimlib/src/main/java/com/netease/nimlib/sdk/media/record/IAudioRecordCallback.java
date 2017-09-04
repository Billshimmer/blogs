package com.netease.nimlib.sdk.media.record;

import java.io.File;

/**
 * Created by dansejijie on 17/4/4.
 */
public interface IAudioRecordCallback {
    void onRecordReady();

    void onRecordStart(File var1, RecordType var2);

    void onRecordSuccess(File var1, long var2, RecordType var4);

    void onRecordFail();

    void onRecordCancel();

    void onRecordReachedMaxTime(int var1);
}