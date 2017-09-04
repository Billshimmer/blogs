package com.lightappbuilder.lab4.lablibrary.startpagemgr;

import android.content.SharedPreferences;
import android.net.Uri;

import com.lightappbuilder.lab4.lablibrary.utils.PreferencesUtils;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;

/**
 * 广告页数据
 * Created by yinhf on 16/1/8.
 */
public class GGPage extends BasePage {

    public Uri imgUri;
    public int imgResId;
    public boolean disable;
    public int duration = 3000;
    public boolean showSkipBtn;
    public int skipBtnPosition = 1;
    public int interval = 0;

    /** 最后一次显示时间 */
    public long lastShowTime;

    public static GGPage disable() {
        GGPage page = new GGPage();
        page.disable = true;
        page.disableUpdate = true;
        return page;
    }

    public GGPage() {

    }

    public GGPage(File packageFile) throws Exception {
        super(packageFile);
        JSONObject config = loadConfigFile(packageFile);
        disable = config.optBoolean("disable");
        if(disable) {
            return;
        }
        File imgFile = new File(packageFile, "0");
        if(!imgFile.isFile()) {
            throw new Exception("!imgFile.isFile()");
        }
        imgUri = Uri.fromFile(imgFile);
        duration = config.optInt("duration", 3000);
        showSkipBtn = config.optBoolean("showSkipBtn", false);
        skipBtnPosition = config.optInt("skipBtnPosition", 1);
        interval = config.optInt("interval", 0);
    }

    public JSONObject loadPref(SharedPreferences sp) {
        JSONObject json = PreferencesUtils.getJSONObject(sp, StartPageManager.PREF_KEY_GG);
        if(json != null) {
            if(json.optInt("code", -1) == this.code) {
                lastShowTime = json.optLong("lastShowTime");
            }
        }
        return json;
    }

    public void savePref(SharedPreferences sp, long lastShowTime) {
        JSONObject jsonObject = new JSONObject();
        try {
            jsonObject.put("code", code);
            jsonObject.put("lastShowTime", lastShowTime);
        } catch (JSONException ignored) {
        }
        SharedPreferences.Editor editor = sp.edit();
        PreferencesUtils.putJSONObject(editor, StartPageManager.PREF_KEY_GG, jsonObject);
        editor.apply();
    }
}
