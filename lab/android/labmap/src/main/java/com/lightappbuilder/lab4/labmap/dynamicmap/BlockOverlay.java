package com.lightappbuilder.lab4.labmap.dynamicmap;

import com.baidu.mapapi.map.BaiduMap;
import com.baidu.mapapi.map.Marker;
import com.baidu.mapapi.map.MarkerOptions;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by yinhf on 2016/12/26.
 */

public class BlockOverlay {
    private static final String TAG = "BlockOverlay";

    public Layer layer;
    public int id;
    private List<Marker> markers;

    public BlockOverlay(Layer layer, int id) {
        this.layer = layer;
        this.id = id;
    }

    public void addToMap(List<MarkerOptions> mopList) {
        if (mopList.isEmpty()) {
            return;
        }
        ArrayList<Marker> markers = new ArrayList<>();
        BaiduMap map = layer.getMap();
        for(int i = 0, len = mopList.size(); i < len; ++i) {
            markers.add((Marker) map.addOverlay(mopList.get(i)));
        }
        this.markers = markers;
    }

    public void removeFromMap() {
        if(markers != null) {
            for(Marker marker : markers) {
                marker.remove();
            }
            markers = null;
        }
    }

    public int count() {
        return markers == null ? 0 : markers.size();
    }

    public boolean isEmpty() {
        return count() == 0;
    }
}
