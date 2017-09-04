package com.lightappbuilder.lab4.labaudio;

import android.app.Dialog;
import android.content.res.Resources;
import android.media.AudioRecord;
import android.media.MediaPlayer;
import android.media.MediaRecorder;
import android.os.Environment;
import android.os.Handler;
import android.os.Looper;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.PopupWindow;
import android.widget.TextView;
import android.widget.Toast;

import com.czt.mp3recorder.MP3Recorder;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.soloader.ExtractFromZipSoSource;

import java.io.File;
import java.io.IOException;

/**
 * Created by tygzx on 16/12/20.
 */

public class AudioRecorderManager extends ReactContextBaseJavaModule {

    private static final String NAME = "AudioRecorderManager";

    @Override
    public String getName() {
        return NAME;
    }

    public AudioRecorderManager(ReactApplicationContext reactContext) {
        super(reactContext);
        mContext = reactContext;
    }

    //录音所需变量
    //private  AudioRecord mMediaRecorder;
    private MP3Recorder mp3Recorder;
    private File mRecordDir = new File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_MUSIC), "录音文件");
    private boolean isRecording = false, isPrepared = false;
    boolean showRecordingDialog = true;
    private TextView mLable;
    private WaveView mWaveView;
    private PopupWindow mPopupWindow;
    private Handler handler=new  Handler(Looper.getMainLooper());
    private UpdateDialogViewRunnable updateDialogViewRunnable =new UpdateDialogViewRunnable();

    private String mCurrentFilePath;
    private ReactContext mContext;
    private static final String TAG = AudioRecorderManager.class.getSimpleName();
    private static final int DIALOG_WIDTH=140;
    private static final int DIALOG_HEIGHT=160;

    @ReactMethod
    public void showRecorderView(boolean b) {
        showRecordingDialog = b;
    }

    @ReactMethod
    public void prepareRecordingAtPath(String filename, Promise promise) {

        handler.removeCallbacks(updateDialogViewRunnable);
        time=0;
        milliseconds=0;

        filename = toMp3(filename);
        if (isRecording) {
            Toast.makeText(mContext, "正在录音，请取消", Toast.LENGTH_SHORT).show();
            return;
        }

        try {
            isPrepared = false;
            if (!mRecordDir.exists()) {
                mRecordDir.mkdirs();
            }

            File file = new File(mRecordDir, filename);

            mCurrentFilePath = file.getAbsolutePath();
            mp3Recorder = new MP3Recorder(file.getAbsoluteFile());
            //设置输出文件
            /*mMediaRecorder.setOutputFile(file.getAbsolutePath());
            mMediaRecorder.setAudioSamplingRate(8000);
            //设置MediaRecorder的音频源为麦克风
            mMediaRecorder.setAudioSource(MediaRecorder.AudioSource.MIC);
            //设置音频的格式
            mMediaRecorder.setOutputFormat(MediaRecorder.OutputFormat.AAC_ADTS);
            //设置音频的编码为amr
            mMediaRecorder.setAudioEncoder(MediaRecorder.AudioEncoder.AAC);
            //MediaRecorder.OutputFormat.
            //准备录音
            mMediaRecorder.prepare();*/
            //开始录音

            //准备结束
            isPrepared = true;

            promise.resolve(mCurrentFilePath);


        } catch (Exception e) {
            e.printStackTrace();
            promise.reject(e);
        }
    }

    @ReactMethod
    public void startRecording() {

        if (mp3Recorder != null && isPrepared) {

            try {
                mp3Recorder.start();
            } catch (Exception e) {
                e.printStackTrace();
            }

            isRecording = true;
            isPrepared = false;
            if (showRecordingDialog) {
                showRecordingDialog();
            }

            /*new Thread(new Runnable() {  //countDownTimer不支持在子线程调用
                @Override
                public void run() {
                    while (isRecording) {
                        try {
                            Thread.sleep(1000);
                        } catch (Exception e) {
                        }
                        time += 1;
                        if (mPopupWindow != null && showRecordingDialog) {
                            updateDialogTime(time);
                            recordProgress(time);
                        }
                    }
                    time = 0;
                }
            }).start();
            updateRecordVoice();//启动线程每隔一段时间获取当前声音响度*/
            handler.postDelayed(updateDialogViewRunnable,250);

        }
    }

    /**
     * 获得音量等级
     *
     * @return
     */
    private int getVoiceLevel(int maxLevel) {
        int level = 7;
        if (isRecording && mp3Recorder != null) {
            try {
                level = (maxLevel * mp3Recorder.getVolume()) / mp3Recorder.getMaxVolume() + 1;
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return level;
    }

    private int milliseconds=0;
    private int time = 0;

    private class UpdateDialogViewRunnable implements Runnable{
        @Override
        public void run() {
            int voulum=getVoiceLevel(7);
            if (mPopupWindow != null && showRecordingDialog) {
                updateDialogVoice(voulum);
            }
            if (milliseconds%1000==0){
                if (mPopupWindow != null && showRecordingDialog) {
                    updateDialogTime(time);
                    recordProgress(time);
                }
                time+=1;
            }
            milliseconds+=250;

            handler.postDelayed(this,250);
        }
    }

/*    private void updateRecordVoice() {
        new Thread(new Runnable() {
            @Override
            public void run() {
                while (isRecording && mp3Recorder != null) {
                    try {
                        Thread.sleep(250);
                    } catch (Exception e) {
                    }
                    final int level = getVoiceLevel(7);
                    if (mPopupWindow != null && showRecordingDialog) {
                        updateDialogVoice(level);
                    }
                }
            }
        }).start();
    }*/

    @ReactMethod
    public void finishRecording(Promise promise) {

        handler.removeCallbacks(updateDialogViewRunnable);
        time=0;
        milliseconds=0;
        isRecording = false;
        isPrepared = false;
        if (mPopupWindow != null) {
            dimissDialog();
        }

        if (mp3Recorder != null) {
            mp3Recorder.stop();
            mp3Recorder = null;
        }
        promise.resolve(mCurrentFilePath);


    }


    private void showRecordingDialog() {

        if (getCurrentActivity() != null) {

            getCurrentActivity().runOnUiThread(new Runnable() {
                @Override
                public void run() {

                    DisplayMetrics displayMetrics = Resources.getSystem().getDisplayMetrics();
                    int width = (int) (DIALOG_WIDTH * displayMetrics.density + 0.5f);
                    int height = (int) (DIALOG_HEIGHT * displayMetrics.density + 0.5f);
                    View dectorView = getCurrentActivity().getWindow().getDecorView();
                    mPopupWindow = new PopupWindow(getCurrentActivity());
                    mPopupWindow.setWidth(width);
                    mPopupWindow.setHeight(height);
                    LayoutInflater inflater = LayoutInflater.from(getCurrentActivity());
                    View view = inflater.inflate(R.layout.dialog_record, null);
                    mLable = (TextView) view.findViewById(R.id.recod_time);
                    mWaveView = (WaveView) view.findViewById(R.id.recod_waveView);
                    mPopupWindow.setContentView(view);
                    mPopupWindow.setOutsideTouchable(true);
                    mPopupWindow.showAtLocation(dectorView, Gravity.CENTER, 0, 0);
                }
            });
        }
    }

    /**
     * 显示取消的对话框
     */
    private void dimissDialog() {

        if (getCurrentActivity() != null) {
            getCurrentActivity().runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    if (mPopupWindow != null) {
                        mPopupWindow.dismiss();
                        mPopupWindow = null;
                    }
                }
            });
        }
    }

    private void updateDialogTime(final int time) {

        if (getCurrentActivity() != null) {
            getCurrentActivity().runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    if (mPopupWindow != null && mPopupWindow.isShowing()) {
                        int second = time % 60;
                        int minute = time / 60;
                        String fixSecond = second < 10 ? ("0" + second) : second + "";
                        String fixMinute = minute < 10 ? ("0" + minute) : minute + "";
                        String t = fixMinute + ":" + fixSecond;
                        mLable.setText(t);
                    }
                }
            });
        }


    }

    private void updateDialogVoice(final int level) {

        if (getCurrentActivity() != null) {
            getCurrentActivity().runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    if (mPopupWindow != null && mPopupWindow.isShowing()) {
                        mWaveView.updateBarHeight(level);
                    }
                }
            });
        }

    }

    public void recordProgress(int time) {

        WritableMap writableMap = Arguments.createMap();
        writableMap.putInt("currentTime", time);
        mContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("LAB_AUDIO_recordProgress", writableMap);
    }

    private String toMp3(String filePath) {
        int index = filePath.lastIndexOf('.') + 1;
        return filePath.substring(0, index) + "mp3";

    }
}
