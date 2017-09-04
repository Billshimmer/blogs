package com.lightappbuilder.lab4.lablibrary;

import android.net.Uri;

import java.util.Map;

/**
 * Created by yinhf on 16/8/15.
 * 配合RN Linking,处理通过uri打开程序
 */
public class LABLinkingHelper {
    private static final String TAG = "LABLinkingHelper";

    public static final String LAB_SCHEME = "lab4";
    public static final String LAB_AUTHORITY = "lightappbuilder.com";

    /** im模块的uri path */
    public static final String PATH_IM = "/im";

    public static Uri createLABUri(String path, Map<String, String> params) {
        Uri.Builder builder = new Uri.Builder()
                .scheme(LAB_SCHEME)
                .authority(LAB_AUTHORITY)
                .path(path);
        if (params != null) {
            for (Map.Entry<String, String> entry : params.entrySet()) {
                builder.appendQueryParameter(entry.getKey(), entry.getValue());
            }
        }

        return builder.build();
    }

    public static Uri.Builder newLABUriBuilder() {
        return new Uri.Builder()
                .scheme(LAB_SCHEME)
                .authority(LAB_AUTHORITY);
    }
}
