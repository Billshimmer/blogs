package com.lightappbuilder.lab4.labaudio;

import android.content.res.AssetFileDescriptor;
import android.content.res.AssetManager;
import android.media.AudioManager;
import android.media.MediaPlayer;
import android.os.CountDownTimer;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.widget.Toast;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.io.IOException;

/**
 * Created by tygzx on 16/12/20.
 */

public class AudioPlayerManager extends ReactContextBaseJavaModule implements MediaPlayer.OnCompletionListener,MediaPlayer.OnErrorListener{

    private static final String NAME="AudioPlayerManager";

    private MediaPlayer mMediaPlayer;
    private ReactContext mContext;
    private boolean isPause=false;
    private boolean isPrepared=false;
    private boolean isFailed=false;

    String audiopath=null;
    Handler mHandler=new Handler(Looper.getMainLooper());
    int audioDuration=0;
    int time=0;

    @Override
    public String getName() {
        return NAME;
    }
    public AudioPlayerManager(ReactApplicationContext reactContext) {
        super(reactContext);
        mContext=reactContext;
    }

    @ReactMethod
    public void prepareWithPath(String filePath, final Promise promise){
        //filePath="file:///android_asset/alarm.mp3";
        //filePath=filePath+"333";
        time=0;
        if(mMediaPlayer == null) {
            mMediaPlayer = new MediaPlayer();
            mMediaPlayer.setOnErrorListener(this);
            mMediaPlayer.setOnCompletionListener(this);
        }else {
            mMediaPlayer.reset();
            isPrepared=false;
        }
        try {
            if (filePath.startsWith("file:///android_asset")){
                int index=filePath.lastIndexOf('/')+1;
                AssetManager assetManager=getCurrentActivity().getAssets();
                AssetFileDescriptor fileDescriptor=assetManager.openFd(filePath.substring(index));
                mMediaPlayer.setDataSource(fileDescriptor.getFileDescriptor(),fileDescriptor.getStartOffset(),fileDescriptor.getLength());
            }else{
                mMediaPlayer.setDataSource(filePath);
            }
            mMediaPlayer.setAudioStreamType(AudioManager.STREAM_MUSIC);
            mMediaPlayer.prepare();
            int duration=mMediaPlayer.getDuration();
            WritableMap writableMap=getParam(duration);
            promise.resolve(writableMap);
            isPause=true;
            isPrepared=true;
            audiopath=filePath;
            isFailed=false;
        } catch (IOException e) {
            e.printStackTrace();
            promise.reject(e);
            isFailed=true;
            //Toast.makeText(mContext,"播放失败:"+e.getMessage(),Toast.LENGTH_SHORT).show();
        }
    }

    @ReactMethod
    public void prepareWithUrl(String urlPath,Promise promise){
        prepareWithPath(urlPath,promise);
    }

    @ReactMethod
    public void startPlaying(){

        if (isFailed){
            Toast.makeText(mContext,"初始化失败",Toast.LENGTH_SHORT).show();
            return;
        }

        if (mMediaPlayer!=null&&isPrepared){
           mMediaPlayer.start();
            isPrepared=false;
            isPause=false;
            mHandler.post(new Runnable() {
                @Override
                public void run() {
                    if (mMediaPlayer!=null){
                        if (mMediaPlayer.isPlaying()){
                            int position=mMediaPlayer.getCurrentPosition();
                            //Log.i("AudioPlayerManager","position:"+position);
                            //playProgress(position/1000);
                            playProgress(time);
                            time+=1;
                            mHandler.postDelayed(this,1000);
                        }

                    }
                }
            });
        }
    }
    @ReactMethod
    public void pause(){
        if(mMediaPlayer != null && mMediaPlayer.isPlaying()) { //正在播放的时候
            mMediaPlayer.pause();
            isPause = true;
            isPrepared=true;
        }
    }

    @ReactMethod
    public void stopPlaying(){

        /*if(mMediaPlayer != null) {
            mMediaPlayer.release();
            mMediaPlayer = null;
            isPause=false;
            isPrepared=false;
        }*/
        if(mMediaPlayer != null && mMediaPlayer.isPlaying()) { //正在播放的时候,跟ios对应
            mMediaPlayer.pause();
            isPause = true;
            isPrepared=true;
        }
    }


    public void playerDidFinish(){
        WritableMap writableMap=Arguments.createMap();
        writableMap.putString("notification","completion");
        mContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("LAB_AUDIO_playerDidFinish",writableMap);

    }
    public void playProgress(int time){

        WritableMap writableMap= Arguments.createMap();
        int second = time % 60;
        int minute = time / 60;
        String fixSecond = second < 10 ? ("0" + second) : second + "";
        String fixMinute = minute < 10 ? ("0" + minute) : minute + "";
        String t = fixMinute + ":" + fixSecond;
        writableMap.putString("formattedCurrentTime",t);
        mContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("LAB_AUDIO_playProgress",writableMap);
    }

    @Override
    public void onCompletion(MediaPlayer mp) {
        try{
            isPrepared=true;
            time=0;
            playerDidFinish();
        }catch (Exception e){e.printStackTrace();}

    }

    private WritableMap getParam(int d){
        WritableMap writableMap=Arguments.createMap();
        int duration=d/1000;
        audioDuration=d/1000;
        int second = duration % 60;
        int minute = duration / 60;
        String fixSecond = second < 10 ? ("0" + second) : second + "";
        String fixMinute = minute < 10 ? ("0" + minute) : minute + "";
        String formattedDuration= fixMinute + ":" + fixSecond;
        writableMap.putString("formattedDuration",formattedDuration);
        writableMap.putInt("duration",mMediaPlayer.getDuration()/1000);
        writableMap.putString("location",audiopath);
        writableMap.putInt("currentTime",0);
        writableMap.putString("formattedCurrentTime","00:00");
        return writableMap;
    }

    @Override
    public boolean onError(MediaPlayer mp, int what, int extra) {
        mMediaPlayer.reset();
        isFailed=true;
        time=0;
        //Toast.makeText(mContext,"发生未知错误",Toast.LENGTH_SHORT).show();
        return false;
    }
}
