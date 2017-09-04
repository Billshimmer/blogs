package com.netease.nimlib.sdk.media.record;

import android.content.Context;
import android.media.AudioManager;
import android.os.Handler;
import android.os.HandlerThread;
import android.os.Looper;
import android.os.Message;
import android.text.TextUtils;
import android.util.Log;

import java.io.File;
import java.util.UUID;

/**
 * Created by dansejijie on 17/4/4.
 */

public class AudioRecorder {

    public static final int DEFAULT_MAX_AUDIO_RECORD_TIME_SECOND = 120;

    public AudioRecorder(Context var1, RecordType var2, int var3, IAudioRecordCallback var4) {
//        this.context = var1.getApplicationContext();
//        this.recordType = var2;
//        if(var3 <= 0) {
//            this.maxDuration = 120;
//        } else {
//            this.maxDuration = var3;
//        }
//
//        this.cb = var4;
//        this.audioManager = (AudioManager)var1.getSystemService("audio");
//        HandlerThread var5;
//        (var5 = new HandlerThread("audio_recorder")).start();
//        this.mHandler = new AudioRecorder.RecordHandler(var5.getLooper());
        Log.e("TAG","unhandler");
    }

    public void startRecord() {
//        this.mHandler.removeMessages(1);
//        this.mHandler.obtainMessage(1).sendToTarget();
        Log.e("TAG","unhandler");
    }

    private void onStartRecord() {
//        this.audioManager.requestAudioFocus((AudioManager.OnAudioFocusChangeListener)null, 0, 2);
//        if(this.isRecording.get()) {
//            b.m("AudioRecordManager startRecord false, as current state is isRecording");
//            this.callBackRecordState(1);
//        } else {
//            com.netease.nimlib.q.a.b var2 = com.netease.nimlib.q.a.b.c;
//            if(!(!com.netease.nimlib.q.a.a.a().b()?false:com.netease.nimlib.q.a.a.a().c() >= var2.b())) {
//                b.m("AudioRecordManager startRecord false, as has no enough space to write");
//                this.callBackRecordState(1);
//            } else {
//                int var1 = this.recordType.getOutputFormat();
//                String var4;
//                if(TextUtils.isEmpty(var4 = com.netease.nimlib.q.a.c.c(UUID.randomUUID().toString() + var1, com.netease.nimlib.q.a.b.c))) {
//                    b.m("AudioRecordManager startRecord false, as outputFilePath is empty");
//                    this.callBackRecordState(1);
//                } else {
//                    var4 = var4 + this.recordType.getFileSuffix();
//                    this.audioFile = new File(var4);
//                    this.cancelRecord.set(false);
//
//                    try {
//                        this.mAudioRecorder = new a(this.context, var4, this.maxDuration * 1000);
//                        this.mAudioRecorder.b(var1);
//                        this.networkClass = h.i(this.context);
//                        if(this.networkClass == 2) {
//                            this.mAudioRecorder.a(22050);
//                        } else if(this.networkClass == 1) {
//                            this.mAudioRecorder.a(16000);
//                        }
//
//                        this.mAudioRecorder.a(this.infoListener);
//                        if(!this.cancelRecord.get()) {
//                            this.callBackRecordState(2);
//                            if(this.mAudioRecorder.c()) {
//                                this.isRecording.set(true);
//                                this.callBackRecordState(3);
//                            }
//                        }
//                    } catch (Exception var3) {
//                        var3.printStackTrace();
//                        this.onCompleteRecord(false);
//                    }
//
//                    if(!this.isRecording.get()) {
//                        this.callBackRecordState(1);
//                    }
//
//                }
//            }
//        }
        Log.e("TAG","unhandler");
    }

    public void completeRecord(boolean var1) {
//        Message var2;
//        (var2 = this.mHandler.obtainMessage(2)).obj = Boolean.valueOf(var1);
//        var2.sendToTarget();
        Log.e("TAG","unhandler");
    }

    private void onCompleteRecord(boolean var1) {
//        if(this.isRecording.get()) {
//            this.cancelRecord.set(var1);
//            this.audioManager.abandonAudioFocus((AudioManager.OnAudioFocusChangeListener)null);
//
//            try {
//                if(this.mAudioRecorder != null) {
//                    this.mAudioRecorder.b();
//                    this.onHandleEndRecord(true, this.mAudioRecorder.d());
//                    this.mAudioRecorder = null;
//                }
//
//            } catch (Exception var2) {
//                var2.printStackTrace();
//            }
//        }
        Log.e("TAG","unhandler");
    }

    public boolean isRecording() {
        //return this.isRecording.get();
        return true;
    }

    public void handleEndRecord(boolean var1, int var2) {
//        Message var3;
//        (var3 = this.mHandler.obtainMessage(3)).obj = Boolean.valueOf(var1);
//        var3.arg1 = var2;
//        var3.sendToTarget();
        Log.e("TAG","unhandler");
    }

    private void onHandleEndRecord(boolean var1, final int var2) {
//        if(this.cancelRecord.get()) {
//            com.netease.nimlib.j.a.c.a.b(this.audioFile.getAbsolutePath());
//            this.callBackRecordState(5);
//        } else if(!var1) {
//            com.netease.nimlib.j.a.c.a.b(this.audioFile.getAbsolutePath());
//            this.callBackRecordState(1);
//        } else if(this.audioFile != null && this.audioFile.exists() && this.audioFile.length() > 0L) {
//            this.mEventHandler.post(new Runnable() {
//                public void run() {
//                    AudioRecorder.this.cb.onRecordSuccess(AudioRecorder.this.audioFile, (long)var2, AudioRecorder.this.recordType);
//                }
//            });
//        } else {
//            this.callBackRecordState(1);
//        }
//
//        this.isRecording.set(false);

        Log.e("TAG","unhandler");
    }

    private void callBackRecordState(final int var1) {
//        this.mEventHandler.post(new Runnable() {
//            public void run() {
//                switch(var1) {
//                    case 1:
//                        AudioRecorder.this.cb.onRecordFail();
//                        return;
//                    case 2:
//                        AudioRecorder.this.cb.onRecordReady();
//                        return;
//                    case 3:
//                        AudioRecorder.this.cb.onRecordStart(AudioRecorder.this.audioFile, AudioRecorder.this.recordType);
//                        return;
//                    case 5:
//                        AudioRecorder.this.cb.onRecordCancel();
//                    case 4:
//                    default:
//                }
//            }
//        });

        Log.e("TAG","unhandler");
    }

    public int getCurrentRecordMaxAmplitude() {
        //return this.mAudioRecorder != null?this.mAudioRecorder.a():0;
        Log.e("TAG","unhandler");
        return 0;
    }

    private void handleReachedMaxRecordTime(int var1) {
        Log.e("TAG","unhandler");
    }

    private class RecordHandler extends Handler {
        public RecordHandler(Looper var2) {
            super(var2);
        }

        public void handleMessage(Message var1) {
            switch(var1.what) {
                case 1:
                    AudioRecorder.this.onStartRecord();
                    return;
                case 2:
                    boolean var4 = ((Boolean)var1.obj).booleanValue();
                    AudioRecorder.this.onCompleteRecord(var4);
                    return;
                case 3:
                    boolean var2 = ((Boolean)var1.obj).booleanValue();
                    int var3 = var1.arg1;
                    AudioRecorder.this.onHandleEndRecord(var2, var3);
                default:
            }
        }
    }
}
