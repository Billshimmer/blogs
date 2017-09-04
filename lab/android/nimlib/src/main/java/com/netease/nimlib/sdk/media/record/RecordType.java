package com.netease.nimlib.sdk.media.record;

/**
 * Created by dansejijie on 17/4/4.
 */

public enum RecordType {
    AMR(2, ".amr"),
    AAC(1, ".aac");

    private int outputFormat;
    private String suffix;

    private RecordType(int var3, String var4) {
        this.outputFormat = var3;
        this.suffix = var4;
    }

    public final int getOutputFormat() {
        return this.outputFormat;
    }

    public final String getFileSuffix() {
        return this.suffix;
    }
}
