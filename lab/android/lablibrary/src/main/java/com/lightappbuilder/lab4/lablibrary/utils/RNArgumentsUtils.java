package com.lightappbuilder.lab4.lablibrary.utils;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;

import java.util.Map;

/**
 * Created by yinhf on 16/8/10.
 */
public class RNArgumentsUtils {
    private static final String TAG = "RNArgumentsUtils";

    public static WritableMap createMap(String code, String message, WritableMap data, Throwable error) {
        WritableMap map = Arguments.createMap();
        map.putString("code", code);
        if (error != null) {
            map.putString("message", message == null ? error.getMessage() : message);
        } else {
            map.putString("message", message);
            map.putMap("data", data);
        }
        return map;
    }

    public static WritableMap createMap(String code, String message) {
        return createMap(code, message, null, null);
    }

    public static WritableMap createMap(String code, Throwable error) {
        return createMap(code, null, null, error);
    }

    public static WritableMap createMap(String code, String message, WritableMap data) {
        return createMap(code, message, data, null);
    }

    /**
     * 将简单的map<String, String> 转为WritableMap
     */
    public static WritableMap fromSimpleMap(Map<String, String> map) {
        WritableMap result = Arguments.createMap();
        for (Map.Entry<String, String> entry : map.entrySet()) {
            result.putString(entry.getKey(), entry.getValue());
        }
        return result;
    }
}
