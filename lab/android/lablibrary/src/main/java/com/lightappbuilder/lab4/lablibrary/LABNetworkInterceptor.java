package com.lightappbuilder.lab4.lablibrary;

import android.content.Context;

import com.lightappbuilder.lab4.lablibrary.utils.AppUtils;

import java.io.IOException;

import okhttp3.Interceptor;
import okhttp3.Request;
import okhttp3.Response;

/**
 * Created by yinhf on 2016/11/18.
 */

public class LABNetworkInterceptor implements Interceptor {

    private String userAgent;

    public LABNetworkInterceptor(Context context) {
        userAgent = "LABNative/" + AppUtils.getVersionName(context);
    }

    @Override
    public Response intercept(Chain chain) throws IOException {
        Request userRequest = chain.request();
        Request.Builder requestBuilder = userRequest.newBuilder();
        //设置lab User-Agent
        String ua = userRequest.header("User-Agent");
        if (ua == null) {
            ua = userAgent;
        } else {
            ua = ua + " " + userAgent;
        }
        requestBuilder.header("User-Agent", ua);

        return chain.proceed(requestBuilder.build());
    }
}
