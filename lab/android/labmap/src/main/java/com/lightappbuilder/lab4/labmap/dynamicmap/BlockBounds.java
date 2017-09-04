package com.lightappbuilder.lab4.labmap.dynamicmap;

/**
 * Created by yinhf on 2016/12/28.
 */
public class BlockBounds {

    public final int minLngId;
    public final int maxLngId;
    public final int minLatId;
    public final int maxLatId;
    public final float blockSize;

    public BlockBounds(int minLngId, int maxLngId, int minLatId, int maxLatId, float blockSize) {
        this.minLngId = minLngId;
        this.maxLngId = maxLngId;
        this.minLatId = minLatId;
        this.maxLatId = maxLatId;
        this.blockSize = blockSize;
    }

    public double minLng() {
        return minLngId * blockSize;
    }

    public double minLat() {
        return minLatId * blockSize;
    }

    public double maxLng() {
        return maxLngId * blockSize + blockSize;
    }

    public double maxLat() {
        return maxLatId * blockSize + blockSize;
    }

    public boolean contains(BlockBounds bounds) {
        return bounds.minLngId >= minLngId && bounds.minLatId >= minLatId && bounds.maxLngId <= maxLngId && bounds.maxLatId <= maxLatId;
    }

    @Override
    public String toString() {
        return "BlockBounds{" +
                "minLngId=" + minLngId +
                ", maxLngId=" + maxLngId +
                ", minLatId=" + minLatId +
                ", maxLatId=" + maxLatId +
                '}';
    }
}
