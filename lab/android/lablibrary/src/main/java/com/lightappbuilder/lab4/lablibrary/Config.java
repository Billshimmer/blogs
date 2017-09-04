package com.lightappbuilder.lab4.lablibrary;

import android.text.TextUtils;
import android.util.Log;

import com.lightappbuilder.lab4.lablibrary.utils.AppContextUtils;
import com.lightappbuilder.lab4.lablibrary.utils.AppUtils;

import org.apache.commons.io.IOUtils;
import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by yinhf on 16/7/13.
 */
public class Config {
    private static final String TAG = "Config";

    public static boolean DEBUG = true;
    private static volatile JSONObject configJson;
    private static String userAgent;

    public static void init() {
        if (configJson != null) {
            return;
        }
        synchronized (Config.class) {
            if (configJson != null) {
                return;
            }
            try {
                String configStr = IOUtils.toString(AppContextUtils.get().getAssets().open("config.android.json"));
                configJson = new JSONObject(configStr);
                if (DEBUG) {
                    Log.i(TAG, "init config:" + configStr);
                }
            } catch (Exception e) {
                Log.e(TAG, "init", e);
                configJson = new JSONObject();
            }
            if (!configJson.has("extra")) {
                try {
                    configJson.put("extra", new JSONObject());
                } catch (JSONException ignored) {
                }
            }
        }
    }

    public static String getBaseUrl() {
        init();
        return configJson.optString("baseUrl");
    }

    public static JSONObject getExtra() {
        init();
        return configJson.optJSONObject("extra");
    }

    public static JSONObject getConfigJson() {
        init();
        return configJson;
    }

    public static String userAgent() {
        if (userAgent == null) {
            init();
            String version = configJson.optString("version");
            if (TextUtils.isEmpty(version)) {
                version = AppUtils.getVersionName(AppContextUtils.get());
            }
            userAgent = "LAB_DEV_Android LABAPP/" + version;
        }
        return userAgent;
    }
}
