package com.lightappbuilder.lab4.lablibrary.utils;

import android.content.SharedPreferences;

import org.json.JSONException;
import org.json.JSONObject;

public class PreferencesUtils {

    public static JSONObject getJSONObject(SharedPreferences sp, String key) {
        String str = sp.getString(key, null);
        if(str == null) {
            return null;
        }
        try {
            return new JSONObject(str);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return null;
    }

    public static void putJSONObject(SharedPreferences.Editor editor, String key, JSONObject jsonObject) {
        if(jsonObject == null) {
            editor.remove(key);
        } else {
            editor.putString(key, jsonObject.toString());
        }
    }
}
