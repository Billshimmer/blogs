package com.lightappbuilder.lab4.labmap.dynamicmap;

import com.baidu.mapapi.model.LatLng;
import com.baidu.mapapi.model.LatLngBounds;

import java.util.ArrayList;
import java.util.List;

/**
 * 当前显示区域
 * Created by yinhf on 2015/10/12.
 */
public class VisibleBounds {

    public static final float MIN_SCALE = 0;

    private final float blockSize;
    private final float blockScale;

    private LatLngBounds bounds;

    private int minLngId;
    private int maxLngId = -1;
    private int minLatId;
    private int maxLatId = -1;

    public VisibleBounds(float blockSize, float blockScale) {
        this.blockSize = blockSize;
        this.blockScale = blockScale;
    }

    /**
     * 更新可视区域
     *
     * @param bounds 地图bounds
     * @return true 区域所包含的block改变 false未改变
     */
    public boolean update(LatLngBounds bounds) {
        this.bounds = bounds;
        LatLng ne = bounds.northeast;
        LatLng sw = bounds.southwest;
        int minLngId = ((int) (sw.longitude * blockScale)) & 0xffff;
        int minLatId = ((int) (sw.latitude * blockScale)) & 0xffff;
        int maxLngId = ((int) (ne.longitude * blockScale)) & 0xffff;
        int maxLatId = ((int) (ne.latitude * blockScale)) & 0xffff;
        if (minLngId == this.minLngId && minLatId == this.minLatId && maxLngId == this.maxLngId && maxLatId == this.maxLatId) {
            return false;
        }
        synchronized (this) {
            this.minLngId = minLngId;
            this.minLatId = minLatId;
            this.maxLngId = maxLngId;
            this.maxLatId = maxLatId;
        }
        return true;
    }

    /**
     * 检查blockId 是否在当前显示区域内
     */
    public boolean contains(int blockId) {
        int lngId = blockId >>> 16;
        int latId = blockId & 0xffff;
        synchronized (this) {
            return lngId >= minLngId && lngId <= maxLngId && latId >= minLatId && latId <= maxLatId;
        }
    }

    /**
     * 获取当前显示区域的block ids
     */
    public void getVisibleIds(List<Integer> ids) {
        synchronized (this) {
            int x, y;
            for (x = minLngId; x <= maxLngId; ++x) {
                for (y = minLatId; y <= maxLatId; ++y) {
                    ids.add((x << 16) | y);
                }
            }
        }
    }

    public BlockBounds getBlockBounds() {
        synchronized (this) {
            return new BlockBounds(minLngId, maxLngId, minLatId, maxLatId, blockSize);
        }
    }

    public LatLngBounds getBounds() {
        return bounds;
    }

    public void reset() {
        synchronized (this) {
            minLngId = minLatId = 0;
            maxLngId = maxLatId = -1;
        }
        bounds = null;
    }

    @Override
    public String toString() {
        return "VisibleBounds{" +
                "bounds=" + bounds +
                ", minLngId=" + minLngId +
                ", maxLngId=" + maxLngId +
                ", minLatId=" + minLatId +
                ", maxLatId=" + maxLatId +
                '}';
    }
}
