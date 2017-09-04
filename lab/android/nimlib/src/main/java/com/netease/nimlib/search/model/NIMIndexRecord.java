package com.netease.nimlib.search.model;

/**
 * Created by dansejijie on 17/4/4.
 */

public class NIMIndexRecord {
    public static final long TYPE_MSG = 65536L;
    public long type;
    public long subtype;
    public long dataid;
    public String id;
    public long time;
    public String content;
    public int count;
    public Object doc;

    public NIMIndexRecord() {
    }

    public String toString() {
        return this.toBriefString() + " content " + this.content;
    }

    public String toBriefString() {
        return "type " + this.type + " subtype " + this.subtype + " dataid " + this.dataid + " id " + this.id + " time " + this.time + " count " + this.count;
    }
}