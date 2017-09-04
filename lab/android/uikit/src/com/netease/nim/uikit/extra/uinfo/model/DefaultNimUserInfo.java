package com.netease.nim.uikit.extra.uinfo.model;

import com.netease.nimlib.sdk.uinfo.constant.GenderEnum;
import com.netease.nimlib.sdk.uinfo.model.NimUserInfo;

import org.w3c.dom.Text;

import java.util.Map;

/**
 * Created by dansejijie on 17/4/16.
 */

public class DefaultNimUserInfo implements NimUserInfo {


    private String account;

    private String avatar;

    private String nick;

    private String letter;

    public DefaultNimUserInfo(String account){
        this.account=account;
    }

    public DefaultNimUserInfo(String account, String avatar){
        this.account=account;
        this.avatar=avatar;
    }

    public DefaultNimUserInfo(String account, String avatar,String nick){
        this.account=account;
        this.avatar=avatar;
        this.nick=nick;
    }

    @Override
    public String getSignature() {
        return null;
    }

    @Override
    public GenderEnum getGenderEnum() {
        return null;
    }

    @Override
    public String getEmail() {
        return null;
    }

    @Override
    public String getBirthday() {
        return null;
    }

    @Override
    public String getMobile() {
        return null;
    }

    @Override
    public String getExtension() {
        return null;
    }

    @Override
    public Map<String, Object> getExtensionMap() {
        return null;
    }

    @Override
    public String getAccount() {
        return account;
    }

    @Override
    public String getName() {
        return null;
    }

    @Override
    public String getAvatar() {
        return avatar;
    }

    public String getNick(){
        return nick;
    }

    public void setNick(String nick){
        this.nick=nick;
        if (!nick.isEmpty()){
            letter=nick.substring(0,1);
        }
    }

    public void setAvatar(String avatar){
        this.avatar=avatar;
    }

    public void setInitialLetter(String letter){
        this.letter=letter;
    }

    public String getInitialLetter(){
        return this.letter;
    }
}
