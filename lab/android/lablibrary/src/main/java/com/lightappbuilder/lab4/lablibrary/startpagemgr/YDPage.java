package com.lightappbuilder.lab4.lablibrary.startpagemgr;

import android.content.SharedPreferences;
import android.net.Uri;

import com.lightappbuilder.lab4.lablibrary.utils.PreferencesUtils;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.util.ArrayList;

/**
 * 引导页数据
 * Created by yinhf on 16/1/8.
 */
public class YDPage extends BasePage {

    public Uri[] imgUris;
    public int[] imgResIds;
    public int bgImgResId = -1;
    public long startTime = 0;
    public int times = 1;
    public int interval = 0;

    /** 最后一次显示时间 */
    public long lastShowTime;
    /** 已显示次数 */
    public int showCount;

    public YDPage() {

    }

    public YDPage(File packageFile) throws Exception {
        super(packageFile);
        JSONObject config = loadConfigFile(packageFile);

        startTime = config.optLong("startTime");
        times = config.optInt("times", 1);
        interval = config.optInt("interval", 0);

        ArrayList<Uri> uriList = new ArrayList<>();
        for(int i = 0;; ++i) {
            File file = new File(packageFile, Integer.toString(i));
            if(file.exists()) {
                uriList.add(Uri.fromFile(file));
            } else {
                break;
            }
        }
        if(uriList.size() == 0) {
            throw new Exception("uriList.size() == 0");
        }
        imgUris = new Uri[uriList.size()];
        imgUris = uriList.toArray(imgUris);
    }

    public JSONObject loadPref(SharedPreferences sp) {
        JSONObject json = PreferencesUtils.getJSONObject(sp, StartPageManager.PREF_KEY_YD);
        if(json != null) {
            if(json.optInt("code", -1) == this.code) {
                lastShowTime = json.optLong("lastShowTime");
                showCount = json.optInt("showCount");
            }
        }
        return json;
    }

    public void savePref(SharedPreferences sp, long lastShowTime, int showCount) {
        JSONObject jsonObject = new JSONObject();
        try {
            jsonObject.put("code", code);
            jsonObject.put("lastShowTime", lastShowTime);
            jsonObject.put("showCount", showCount);
        } catch (JSONException ignored) {
        }
        SharedPreferences.Editor editor = sp.edit();
        PreferencesUtils.putJSONObject(editor, StartPageManager.PREF_KEY_YD, jsonObject);
        editor.apply();
    }

}
