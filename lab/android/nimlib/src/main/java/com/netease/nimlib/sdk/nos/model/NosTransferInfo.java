//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by Fernflower decompiler)
//

package com.netease.nimlib.sdk.nos.model;

import com.netease.nimlib.sdk.nos.constant.NosTransferStatus;
import java.io.Serializable;

public class NosTransferInfo implements Serializable {
    protected NosTransferInfo.TransferType transferType;
    protected String path;
    protected long size;
    protected String md5;
    protected String url;
    protected String extension;
    protected NosTransferStatus status;

    public NosTransferInfo() {
        this.status = NosTransferStatus.def;
    }

    public String getPath() {
        return this.path;
    }

    public void setPath(String var1) {
        this.path = var1;
    }

    public long getSize() {
        return this.size;
    }

    public void setSize(long var1) {
        this.size = var1;
    }

    public String getMd5() {
        return this.md5;
    }

    public void setMd5(String var1) {
        this.md5 = var1;
    }

    public String getUrl() {
        return this.url;
    }

    public void setUrl(String var1) {
        this.url = var1;
    }

    public String getExtension() {
        return this.extension;
    }

    public void setExtension(String var1) {
        this.extension = var1;
    }

    public NosTransferStatus getStatus() {
        return this.status;
    }

    public void setStatus(NosTransferStatus var1) {
        this.status = var1;
    }

    public NosTransferInfo.TransferType getTransferType() {
        return this.transferType;
    }

    public void setTransferType(NosTransferInfo.TransferType var1) {
        this.transferType = var1;
    }

    public String getKey() {
        return this.transferType == NosTransferInfo.TransferType.UPLOAD?this.getPath():this.getUrl();
    }

    public static enum TransferType {
        UPLOAD,
        DOWNLOAD;

        private TransferType() {
        }
    }
}
