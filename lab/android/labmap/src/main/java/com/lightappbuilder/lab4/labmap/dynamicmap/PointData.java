package com.lightappbuilder.lab4.labmap.dynamicmap;

import com.baidu.mapapi.model.LatLng;

import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by yinhf on 2015/10/14.
 */
public class PointData {

    public final LatLng position;
    public final JSONObject data;

    public PointData(JSONObject jsonObject) throws JSONException {
        position = new LatLng(jsonObject.getDouble("y"), jsonObject.getDouble("x"));
        data = jsonObject;
    }
}
