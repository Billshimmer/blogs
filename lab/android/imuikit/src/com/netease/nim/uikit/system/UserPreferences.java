package com.netease.nim.uikit.system;

import android.content.Context;
import android.content.SharedPreferences;
import com.netease.nim.uikit.constant.Extras;

/**
 * Created by hzxuwen on 2015/10/21.
 */
public class UserPreferences {

    private final static String KEY_CHARER = "KEY_CHATER";


    public static void saveImId(String sessionId){
        SharedPreferences.Editor editor = getSharedPreferences().edit();
        editor.putString(Extras.EXTRA_TOIMID,sessionId);
        editor.apply();
    }
    public static String getImId(){
        return getSharedPreferences().getString(Extras.EXTRA_TOIMID,null);
    }
    public static void saveToNickname(String toNickName){
        SharedPreferences.Editor editor = getSharedPreferences().edit();
        editor.putString(Extras.EXTRA_TONICKNAME,toNickName);
        editor.apply();
    }
    public static String getToNickname(){
        return getSharedPreferences().getString(Extras.EXTRA_TONICKNAME,null);
    }
    public static void savemyNickname(String myNickName){
        SharedPreferences.Editor editor = getSharedPreferences().edit();
        editor.putString(Extras.EXTRA_MYNICKNAME,myNickName);
        editor.apply();
    }
    public static String getMyNickname(){
        return getSharedPreferences().getString(Extras.EXTRA_MYNICKNAME,null);
    }
    public static void saveMyAvatar(String myAvatar){
        SharedPreferences.Editor editor = getSharedPreferences().edit();
        editor.putString(Extras.EXTRA_MYAVATOR,myAvatar);
        editor.apply();
    }
    public static String getmyAvatar(){
        return getSharedPreferences().getString(Extras.EXTRA_MYAVATOR,null);
    }
    public static void saveToAvatar(String toAvatar){
        SharedPreferences.Editor editor = getSharedPreferences().edit();
        editor.putString(Extras.EXTRA_TOAVATOR,toAvatar);
        editor.apply();
    }
    public static String getToAvatar(){
        return getSharedPreferences().getString(Extras.EXTRA_TOAVATOR,null);
    }

    static SharedPreferences getSharedPreferences() {
        return NimUIKit.getContext().getSharedPreferences("KEY_CHARER" , Context.MODE_PRIVATE);
    }
}
