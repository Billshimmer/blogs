package com.lightappbuilder.lab4.labim;


import android.app.Activity;
import android.content.ContextWrapper;
import android.content.Intent;
import android.os.Bundle;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.ThemedReactContext;
import com.lightappbuilder.lab4.lablibrary.rnviews.LABRNTopView;
import com.netease.nim.uikit.extra.session.view.MessageView;
import com.netease.nim.uikit.session.constant.Extras;

/**
 * Created by vice on 2016/7/22.
 */
public class ChatView extends LABRNTopView implements LifecycleEventListener, ActivityEventListener {
    private static final String TAG = "LABIMChatView";

    private String toUserId = null;
    private String toUserAvatar = null;
    private String toUserNickName = null;
    private String myAvatar = null;
    private String myNickName = null;

    private MessageView messageView;
    private ReactApplicationContext reactApplicationContext;

    private boolean isMessageViewInited;

    public ChatView(ThemedReactContext context, ReactApplicationContext reactApplicationContext) {
        super(context);
        init(context, reactApplicationContext);
    }

    private void init(ThemedReactContext context, ReactApplicationContext reactApplicationContext) {
        this.reactApplicationContext = reactApplicationContext;
        setFitsSystemWindows(true);
        reactApplicationContext.addLifecycleEventListener(this);
        reactApplicationContext.addActivityEventListener(this);
    }

    /**
     * 设置信息
     */
    public void setOptions(ReadableMap options) {
        //TODO 字段可为空的判断 对options改变处理
        this.toUserId = options.getString("toImId");
        try {
            this.toUserAvatar = options.getString("toAvatar");
            this.toUserNickName = options.getString("toNickname");
            this.myAvatar = options.getString("myAvatar");
            this.myNickName = options.getString("myNickname");
        } catch (Exception e) {
            e.printStackTrace();
        }

        if (!isMessageViewInited && toUserId != null) {
            isMessageViewInited = true;
            // TODO 暂时只允许初始化一次

            messageView = new MessageView(((ContextWrapper) getContext()).getBaseContext());
            addView(messageView, LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT);

            Bundle args = new Bundle();
            args.putInt(Extras.EXTRA_CHAT_TYPE, Extras.CHATTYPE_SINGLE);
            args.putString(Extras.EXTRA_USER_ID, toUserId);
            args.putString(Extras.EXTRA_TO_USER_AVATAR, toUserAvatar);
            args.putString(Extras.EXTRA_TO_USER_NAME, toUserNickName);
            args.putString(Extras.EXTRA_MY_AVATAR, myAvatar);
            args.putString(Extras.EXTRA_MY_NICKNAME, myNickName);
            messageView.setArguments(args);
        }
    }

    public void onDropViewInstance() {
        reactApplicationContext.removeActivityEventListener(this);
        reactApplicationContext.removeLifecycleEventListener(this);
        if (messageView != null) {
            messageView.onDestroy();
            messageView = null;
        }
    }

    @Override
    public void onHostResume() {
        if (messageView != null) {
            messageView.onResume();
        }
    }

    @Override
    public void onHostPause() {
        if (messageView != null) {
            messageView.onPause();
        }
    }

    @Override
    public void onHostDestroy() {
        if (messageView != null) {
            messageView.onDestroy();
            messageView = null;
        }
    }

//    @Override
//    protected void onAttachedToWindow() {
//        super.onAttachedToWindow();
//    }
//
//    @Override
//    protected void onDetachedFromWindow() {
//        super.onDetachedFromWindow();
//    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        if (messageView != null) {
            messageView.onActivityResult(requestCode,resultCode,data);
        }
    }

    @Override
    public void onNewIntent(Intent intent) {

    }

//    @Override
//    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
//        Log.i(TAG, "onMeasure() called with: " + "widthMeasureSpec = [" + MeasureSpec.toString(widthMeasureSpec) + "], heightMeasureSpec = [" + MeasureSpec.toString(heightMeasureSpec) + "]");
//        super.onMeasure(widthMeasureSpec, heightMeasureSpec);
//    }
//
//    @Override
//    protected void onLayout(boolean changed, int left, int top, int right, int bottom) {
//        Log.i(TAG, "onLayout() called with: " + "changed = [" + changed + "], left = [" + left + "], top = [" + top + "], right = [" + right + "], bottom = [" + bottom + "]");
//        super.onLayout(changed, left, top, right, bottom);
//    }
//
//    @Override
//    public WindowInsets onApplyWindowInsets(WindowInsets insets) {
//        Log.i(TAG, "onApplyWindowInsets() called with: " + "insets = [" + insets + "]");
//        WindowInsets ret = super.onApplyWindowInsets(insets);
//        Log.i(TAG, "onApplyWindowInsets() called with: " + "ret = [" + ret + "]");
//        // XXX 子View 有fitsSystemWindows时的bug
//        //applyWindowInsets = true;
//        return ret;
//    }
//
//    @Override
//    public void forceLayout() {
//        Log.i(TAG, "forceLayout: xxxxxx");
//        super.forceLayout();
//    }
//
//    @Override
//    public void requestLayout() {
//        Log.i(TAG, "requestLayout: xxxxxxxxx");
//        super.requestLayout();
//    }
}
