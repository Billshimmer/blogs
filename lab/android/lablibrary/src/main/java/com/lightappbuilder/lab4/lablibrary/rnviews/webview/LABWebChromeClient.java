package com.lightappbuilder.lab4.lablibrary.rnviews.webview;

import android.annotation.TargetApi;
import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.webkit.GeolocationPermissions;
import android.webkit.JsPromptResult;
import android.webkit.JsResult;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebView;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.ReactContext;
import com.lightappbuilder.lab4.lablibrary.Config;
import com.lightappbuilder.lab4.lablibrary.utils.L;

import java.util.Arrays;

/**
 * Created by yhf on 2015/6/12.
 */
public class LABWebChromeClient extends WebChromeClient {
    private static final String TAG = "LABWebChromeClient";

    private static final int FILE_CHOOSER_REQUEST_CODE = 20000;

    private ReactContext reactContext;
    private boolean isDestroyed;
    private LABDialogsHelper dialogsHelper;
    private ValueCallback<?> lastValueCallback;

    public LABWebChromeClient(ReactContext reactContext) {
        this.dialogsHelper = new LABDialogsHelper(reactContext);
        this.reactContext = reactContext;
    }

    public void onDestroy() {
        isDestroyed = true;
        dialogsHelper.onDestroy();
        if(lastValueCallback != null) {
            L.w(TAG, "onDestroy lastValueCallback != null");
            lastValueCallback.onReceiveValue(null);
            lastValueCallback = null;
        }
    }

    @Override
    public void onGeolocationPermissionsShowPrompt(String origin, GeolocationPermissions.Callback callback) {
        callback.invoke(origin, true, false);
    }

    @Override
    public boolean onJsAlert(WebView view, String url, String message, JsResult result) {
        dialogsHelper.showAlert(message, result);
        return true;
    }

    @Override
    public boolean onJsConfirm(WebView view, String url, String message, JsResult result) {
        dialogsHelper.showConfirm(message, result);
        return true;
    }

    @Override
    public boolean onJsPrompt(WebView view, String origin, String message, String defaultValue, JsPromptResult result) {
        dialogsHelper.showPrompt(message, defaultValue, result);
        return true;
    }

    public void openFileChooser(ValueCallback<Uri> uploadMsg) {
        L.i(TAG, "openFileChooser() called with uploadMsg = ", uploadMsg);
        this.openFileChooser(uploadMsg, "*/*");
    }

    public void openFileChooser(ValueCallback<Uri> uploadMsg, String acceptType) {
        L.i(TAG, "openFileChooser() called with uploadMsg = ", uploadMsg, ", acceptType = ", acceptType);
        this.openFileChooser(uploadMsg, acceptType, null);
    }

    public void openFileChooser(final ValueCallback<Uri> uploadMsg, String acceptType, String capture) {
        L.i(TAG, "openFileChooser() called with uploadMsg = ", uploadMsg, ", acceptType = ", acceptType, ", capture = ", capture);
        lastValueCallback = uploadMsg;
        Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        intent.setType("image/*");// TODO: 2015/7/23 暂时设为image

        reactContext.startActivityForResult(intent, FILE_CHOOSER_REQUEST_CODE, null);
        reactContext.addActivityEventListener(new ActivityEventListener() {
            @Override
            public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
                if(requestCode == FILE_CHOOSER_REQUEST_CODE) {
                    reactContext.removeActivityEventListener(this);
                    Uri result = data == null || resultCode != Activity.RESULT_OK ? null : data.getData();
                    L.i(TAG, "Receive file chooser Uri: ", result);
                    uploadMsg.onReceiveValue(result);
                    lastValueCallback = null;
                }
            }

            @Override
            public void onNewIntent(Intent intent) {

            }
        });
    }

    @TargetApi(Build.VERSION_CODES.LOLLIPOP)
    public boolean onShowFileChooser(WebView webView, final ValueCallback<Uri[]> filePathCallback, FileChooserParams fileChooserParams) {
        if(Config.DEBUG) {
            L.i(TAG, "onShowFileChooser() fileChooserParams{ AcceptTypes: ", Arrays.toString(fileChooserParams.getAcceptTypes()),
                    " FilenameHint: ", fileChooserParams.getFilenameHint(),
                    " Mode: ", fileChooserParams.getMode(),
                    " Title: ", fileChooserParams.getTitle(),
                    " isCaptureEnabled: ", fileChooserParams.isCaptureEnabled());
        }
        lastValueCallback = filePathCallback;
        Intent intent = fileChooserParams.createIntent();
        try {
            reactContext.startActivityForResult(intent, FILE_CHOOSER_REQUEST_CODE, null);
            reactContext.addActivityEventListener(new ActivityEventListener() {
                @Override
                public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
                    if(requestCode == FILE_CHOOSER_REQUEST_CODE) {
                        reactContext.removeActivityEventListener(this);
                        Uri[] result = FileChooserParams.parseResult(resultCode, data);
                        L.i(TAG, "Receive file chooser Uri: ", Arrays.toString(result));
                        filePathCallback.onReceiveValue(result);
                        lastValueCallback = null;
                    }
                }

                @Override
                public void onNewIntent(Intent intent) {

                }
            });
        } catch (ActivityNotFoundException e) {
            L.w(TAG, "No activity found to handle file chooser intent.", e);
            filePathCallback.onReceiveValue(null);
            lastValueCallback = null;
        }
        return true;
    }
}
