package com.lightappbuilder.lab4.labmap.dynamicmap;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Created by yinhf on 2015/10/12.
 */
public class BlockData {
    private static final String TAG = "BlockData";

    public static BlockData empty(int id) {
        return new BlockData(id, Collections.EMPTY_LIST);
    }

    public int id;
    public List<PointData> points;

    private BlockData(int id, List<PointData> points) {
        this.id = id;
        this.points = points;
    }

    public BlockData(int id) {
        this.id = id;
        this.points = new ArrayList<>();
    }

    public int count() {
        return points.size();
    }

    public boolean isEmpty() {
        return points.isEmpty();
    }

    @Override
    public String toString() {
        return "BlockData{" +
                "id=" + id +
                "count=" + count() +
                '}';
    }
}
