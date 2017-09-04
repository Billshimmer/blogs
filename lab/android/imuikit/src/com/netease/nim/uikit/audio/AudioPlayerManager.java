package com.netease.nim.uikit.audio;

import android.content.Context;
import android.content.res.AssetFileDescriptor;
import android.content.res.AssetManager;
import android.media.AudioManager;
import android.media.MediaPlayer;
import android.os.Handler;
import android.os.Looper;
import java.io.IOException;

/**
 * Created by tygzx on 16/12/20.
 */

public class AudioPlayerManager implements MediaPlayer.OnCompletionListener, MediaPlayer.OnErrorListener {


    private MediaPlayer mMediaPlayer;
    private static Context mContext;
    private static AudioPlayerManager instance;
    String audioPath="";

    private AudioPlayerManager(Context context) {
        mContext = context;
    }

    public synchronized static AudioPlayerManager getInstance(Context context) {
        if (instance == null) {
            synchronized (AudioPlayerManager.class) {
                if (instance == null) {
                    instance = new AudioPlayerManager(context);
                }
            }
        }
        return instance;
    }

    int time = 0;
    private Runnable progressRecorderRunnable = new Runnable() {
        @Override
        public void run() {
            if (audioPlayerListener != null) {
                audioPlayerListener.onPlaying(time);
                time++;
                progresshandler.postDelayed(this,1000);
            }
        }
    };

    Handler progresshandler = new Handler(Looper.getMainLooper());

    public void playVoice(String filePath) {

        progresshandler.removeCallbacks(progressRecorderRunnable);

        if (mMediaPlayer == null) {
            mMediaPlayer = new MediaPlayer();
            mMediaPlayer.setOnErrorListener(this);
            mMediaPlayer.setOnCompletionListener(this);
        } else {
            mMediaPlayer.reset();
            progresshandler.removeCallbacks(progressRecorderRunnable);
            time=0;
        }
        try {
            if (filePath.startsWith("file:///android_asset")) {
                int index = filePath.lastIndexOf('/') + 1;
                AssetManager assetManager = mContext.getAssets();
                AssetFileDescriptor fileDescriptor = assetManager.openFd(filePath.substring(index));
                mMediaPlayer.setDataSource(fileDescriptor.getFileDescriptor(), fileDescriptor.getStartOffset(), fileDescriptor.getLength());
            } else {
                mMediaPlayer.setDataSource(filePath);
            }
            mMediaPlayer.setAudioStreamType(AudioManager.STREAM_MUSIC);
            mMediaPlayer.prepare();
            mMediaPlayer.start();
            audioPath=filePath;
            progresshandler.postDelayed(progressRecorderRunnable, 1000);

        } catch (IOException e) {
            e.printStackTrace();
            audioPath="";

        }
    }

    public boolean isPlaying(String filePath){
        if (filePath.equals(audioPath)){
            if (mMediaPlayer!=null&&mMediaPlayer.isPlaying()){
                return true;
            }
        }
        return false;
    }

    private AudioPlayerListener audioPlayerListener = null;

    public void setAudioPlayerListener(AudioPlayerListener listener) {

        if (audioPlayerListener!=null){
            audioPlayerListener.onChangeListener();
        }
        this.audioPlayerListener = listener;
    }
    public AudioPlayerListener getAudioPlayerListener(){
        return this.audioPlayerListener;
    }

    public interface AudioPlayerListener {

        void onPlaying(int duration);
        void onCompletion();
        void onChangeListener();
    }


    @Override
    public void onCompletion(MediaPlayer mp) {
        try {
            if (audioPlayerListener!=null){
                audioPlayerListener.onCompletion();
            }
            progresshandler.removeCallbacks(progressRecorderRunnable);
            time = 0;
        } catch (Exception e) {
            e.printStackTrace();
        }

    }


    @Override
    public boolean onError(MediaPlayer mp, int what, int extra) {
        mMediaPlayer.reset();
        progresshandler.removeCallbacks(progressRecorderRunnable);
        time = 0;
        return false;
    }
}
