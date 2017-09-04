package com.netease.nimlib.sdk.nos.model;

import java.io.Serializable;

/**
 * Created by dansejijie on 17/4/15.
 */
public class NosThumbParam implements Serializable {
    public NosThumbParam.ThumbType thumb;
    public int width;
    public int height;

    public NosThumbParam() {
        this.thumb = NosThumbParam.ThumbType.Crop;
    }

    public static enum ThumbType implements Serializable {
        Internal,
        Crop,
        External;

        private ThumbType() {
        }
    }
}
