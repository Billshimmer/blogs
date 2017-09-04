package com.lightappbuilder.lab4.labsocial;

import android.app.Activity;
import android.content.Intent;
import android.text.TextUtils;

import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.lightappbuilder.lab4.lablibrary.utils.L;
import com.lightappbuilder.lab4.lablibrary.utils.RNArgumentsUtils;
import com.lightappbuilder.lab4.lablibrary.utils.RNCallbackUtils;
import com.umeng.socialize.ShareAction;
import com.umeng.socialize.UMAuthListener;
import com.umeng.socialize.UMShareAPI;
import com.umeng.socialize.UMShareListener;
import com.umeng.socialize.bean.SHARE_MEDIA;
import com.umeng.socialize.media.UMImage;
import com.umeng.socialize.media.UMWeb;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Created by vice on 2016/8/9.
 */
public class LABSocialModule extends ReactContextBaseJavaModule {
    private static final String TAG = "LABSocialModule";

    private UMShareAPI mShareAPI = null;

    private ReactApplicationContext sRAC;

    public LABSocialModule(ReactApplicationContext reactContext) {
        super(reactContext);

        sRAC=reactContext;

        mShareAPI = UMShareAPI.get(reactContext);

        reactContext.addActivityEventListener(new BaseActivityEventListener() {
            @Override
            public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
                mShareAPI.onActivityResult(requestCode, resultCode, data);
            }
        });

    }


    @Override
    public String getName() {
        return "LABSocialModule";
    }


    /**
     * 第三方登录
     */
    @ReactMethod
    public void login(final ReadableMap options, final Callback callback) {
        final String platform = options.hasKey("platform") ? options.getString("platform") : null;
        final boolean getPlatformInfo = options.hasKey("getPlatformInfo") && options.getBoolean("getPlatformInfo");
        final SHARE_MEDIA shareMedia = stringToShareMedia(platform);
        if (shareMedia == null) {
            callback.invoke(RNArgumentsUtils.createMap("error", "未指定平台"));
            return;
        }

        final Activity activity = getCurrentActivity();
        if (activity == null) {
            RNCallbackUtils.callbackUnknownError(callback);
            return;
        }

        activity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                if (getPlatformInfo) {
                    mShareAPI.getPlatformInfo(activity, shareMedia, new UMAuthListener() {

                        @Override
                        public void onStart(SHARE_MEDIA share_media) {

                        }

                        @Override
                        public void onComplete(SHARE_MEDIA share_media, int i, final Map<String, String> data) {
                            if (data != null) {
                                //Log.i(TAG, "getPlatformInfo onComplete:data: " + data);
                                WritableMap resultMap = RNArgumentsUtils.fromSimpleMap(data);
                                resultMap.putString("platform", platform);
                                if (!data.containsKey("nickname")) {
                                    resultMap.putString("nickname", data.get("screen_name"));
                                }
                                if (!data.containsKey("avatarUrl")) {
                                    resultMap.putString("avatarUrl", data.get("profile_image_url"));
                                }
                                callback.invoke(null, resultMap);
                            } else {
                                callback.invoke(RNArgumentsUtils.createMap("error", "授权失败"));
                            }
                        }

                        @Override
                        public void onError(SHARE_MEDIA share_media, int i, Throwable throwable) {
                            callback.invoke(RNArgumentsUtils.createMap("error", "授权失败"));
                        }

                        @Override
                        public void onCancel(SHARE_MEDIA share_media, int i) {
                            RNCallbackUtils.callbackCancel(callback);
                        }
                    });
                } else {
                    mShareAPI.doOauthVerify(activity, shareMedia, new UMAuthListener() {
                        @Override
                        public void onStart(SHARE_MEDIA share_media) {

                        }

                        @Override
                        public void onComplete(SHARE_MEDIA share_media, int action, final Map<String, String> authData) {
                            //Log.i(TAG, "onComplete: shareMedia:" + shareMedia + " authData:" + authData);
                            WritableMap resultMap = RNArgumentsUtils.fromSimpleMap(authData);
                            resultMap.putString("platform", platform);
                            callback.invoke(null, resultMap);
                        }

                        @Override
                        public void onError(SHARE_MEDIA share_media, int action, Throwable throwable) {
                            callback.invoke(RNArgumentsUtils.createMap("error", "授权失败"));
                        }

                        @Override
                        public void onCancel(SHARE_MEDIA share_media, int action) {
                            RNCallbackUtils.callbackCancel(callback);
                        }
                    });
                }
            }
        });
    }

    /**
     * 弹出分享界面分享
     */
    @ReactMethod
    public void share(final ReadableMap options, final Callback callback) {

        final Activity activity = getCurrentActivity();
        if (activity == null) {
            RNCallbackUtils.callbackUnknownError(callback);
            return;
        }
        final ShareAction shareAction = new ShareAction(activity);
        SHARE_MEDIA[] displayList = null;
        boolean openShareBoard = false;

        UMWeb web=null;
        UMImage umImage=null;
        String title=" ";
        String content=" ";
        try {
            ReadableMap informations = options.getMap("informations");
            if (informations.hasKey("title")) {
                title=informations.getString("title");//为空为null都可以
            }
            if (informations.hasKey("content")) {
                content=informations.getString("content");//为空为null都可以
            }
            if (informations.hasKey("imageUrl")) {
                umImage=new UMImage(getReactApplicationContext(), informations.getString("imageUrl"));//为空 为null都不会报异常，但新浪里必须有url
            }
            if (informations.hasKey("url")) {
                web=new UMWeb(informations.getString("url"));
            }

            if (!TextUtils.isEmpty(title)){
                web.setTitle(title);
            }

            web.setDescription(content);
//            if (!TextUtils.isEmpty(content)){
//                web.setDescription(content);
//            }
            if (umImage!=null){
                web.setThumb(umImage);
            }

            shareAction.withMedia(web);

            if (options.hasKey("platform")) {
                SHARE_MEDIA shareMedia = stringToShareMedia(options.getString("platform"));
                if (shareMedia != null) {
                    shareAction.setPlatform(shareMedia);
                } else {
                    callback.invoke(RNArgumentsUtils.createMap("error2", "不支持的平台"));
                    return;
                }
            } else {
                ReadableArray platforms = options.getArray("platforms");
                List<SHARE_MEDIA> temp = new ArrayList<>();
                for (int i = 0; i < platforms.size(); ++i) {
                    SHARE_MEDIA shareMedia = stringToShareMedia(platforms.getString(i));
                    if (shareMedia != null) {
                        temp.add(shareMedia);
                    }
                }
                displayList = temp.toArray(new SHARE_MEDIA[temp.size()]);
                shareAction.setDisplayList(displayList);
                openShareBoard = true;

            }
        } catch (Exception e) {
            L.e(TAG, "share", e);
            callback.invoke(RNArgumentsUtils.createMap("error1", "参数配置不正确"));
            return;
        }


        shareAction.setCallback(new UMShareListener() {
            @Override
            public void onStart(SHARE_MEDIA share_media) {

            }

            @Override
            public void onResult(SHARE_MEDIA share_media) {
                callback.invoke(null, null);
            }

            @Override
            public void onError(SHARE_MEDIA share_media, Throwable t) {
                callback.invoke(RNArgumentsUtils.createMap("share-error", "分享失败"));
            }

            @Override
            public void onCancel(SHARE_MEDIA share_media) {
                RNCallbackUtils.callbackCancel(callback);
            }
        });

        if (openShareBoard) {

//            shareAction.setShareboardclickCallback(new ShareBoardlistener() {
//                @Override
//                public void onclick(SnsPlatform snsPlatform, SHARE_MEDIA share_media) {
//                    WritableMap map= Arguments.createMap();
//                    map.putString("platform",shareMediaToString(share_media));
//                    sRAC.getJSModule(RCTNativeAppEventEmitter.class).emit("LAB_SOCIAL_CLICKED",map);
//                }
//            });

            activity.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    shareAction.open();
                }
            });
        } else {
            activity.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    shareAction.share();
                }
            });
        }
    }

    private static SHARE_MEDIA stringToShareMedia(String str) {
        switch (str) {
            case "wb":
                return SHARE_MEDIA.SINA;
            case "qq":
                return SHARE_MEDIA.QQ;
            case "qzone":
                return SHARE_MEDIA.QZONE;
            case "wx":
                return SHARE_MEDIA.WEIXIN;
            case "wx_fav":
                return SHARE_MEDIA.WEIXIN_FAVORITE;
            case "wx_circle":
                return SHARE_MEDIA.WEIXIN_CIRCLE;
            case "sms":
                return SHARE_MEDIA.SMS;
            default:
                return null;
        }
    }

    private static String shareMediaToString(SHARE_MEDIA share_media) {

        if (share_media.toString().equals("SINA")){
            return "wb";
        }else if (share_media.toString().equals("QQ")){
            return "qq";
        }else if (share_media.toString().equals("QZONE")){
            return "qzon";
        }else if (share_media.toString().equals("WEIXIN")){
            return "wx";
        }else if (share_media.toString().equals("WEIXIN_FAVORITE")){
            return "wx_fav";
        }else if (share_media.toString().equals("WEIXIN_CIRCLE")){
            return "wx_circle";
        }else if (share_media.toString().equals("SMS")){
            return "sms";
        }else {
            return "";
        }
    }

}
