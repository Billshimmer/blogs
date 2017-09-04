package com.netease.nimlib.sdk.auth;

import android.os.Parcel;
import android.os.Parcelable;
import android.text.TextUtils;

import java.io.Serializable;

/**
 * Created by dansejijie on 17/4/8.
 */
public class LoginInfo implements Parcelable, Serializable {
    private String account;
    private String token;
    private String appKey;
    public static final Creator<LoginInfo> CREATOR = new Creator() {
        public final LoginInfo createFromParcel(Parcel var1) {
            return new LoginInfo(var1);
        }

        public final LoginInfo[] newArray(int var1) {
            return new LoginInfo[var1];
        }
    };

    public LoginInfo(String var1, String var2) {
        this.account = var1 == null?null:var1.toLowerCase();
        this.token = var2;
    }

    public LoginInfo(String var1, String var2, String var3) {
        this(var1, var2);
        this.appKey = var3;
    }

    protected LoginInfo(Parcel var1) {
        this.account = var1.readString();
        this.token = var1.readString();
        this.appKey = var1.readString();
    }

    public String getAccount() {
        return this.account;
    }

    public String getToken() {
        return this.token;
    }

    public String getAppKey() {
        return this.appKey;
    }

    public boolean valid() {
        return !TextUtils.isEmpty(this.account) && !TextUtils.isEmpty(this.token);
    }

    public int describeContents() {
        return 0;
    }

    public void writeToParcel(Parcel var1, int var2) {
        var1.writeString(this.account);
        var1.writeString(this.token);
        var1.writeString(this.appKey);
    }
}
