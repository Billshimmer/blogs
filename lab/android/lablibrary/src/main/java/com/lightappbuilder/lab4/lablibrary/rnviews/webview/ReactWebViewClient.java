package com.lightappbuilder.lab4.lablibrary.rnviews.webview;

import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Build;
import android.support.annotation.RequiresApi;
import android.util.Log;
import android.webkit.WebResourceRequest;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import com.facebook.common.logging.FLog;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.common.ReactConstants;
import com.facebook.react.views.webview.events.TopLoadingErrorEvent;
import com.facebook.react.views.webview.events.TopLoadingFinishEvent;
import com.facebook.react.views.webview.events.TopLoadingStartEvent;
import com.lightappbuilder.lab4.lablibrary.rnviews.webview.events.LoadRequestEvent;

import static com.lightappbuilder.lab4.lablibrary.rnviews.webview.ReactWebViewManager.dispatchEvent;

/**
 * Created by yinhf on 16/10/11.
 */

public class ReactWebViewClient extends WebViewClient {

    private boolean mLastLoadFailed = false;

    @Override
    public void onPageFinished(WebView webView, String url) {
        super.onPageFinished(webView, url);

        if (!mLastLoadFailed) {
            ReactWebView reactWebView = (ReactWebView) webView;
            reactWebView.callInjectedJavaScript();
            reactWebView.linkBridge();
            emitFinishEvent((ReactWebView) webView, url);
        }
    }

    @Override
    public void onPageStarted(WebView webView, String url, Bitmap favicon) {
        super.onPageStarted(webView, url, favicon);
        mLastLoadFailed = false;

        dispatchEvent(
                webView,
                new TopLoadingStartEvent(
                        ((ReactWebView) webView).getWrapperViewId(),
                        createWebViewEvent((ReactWebView) webView, url)));
    }

    @Override
    public boolean shouldOverrideUrlLoading(WebView view, String url) {
        return shouldOverrideUrlLoading((ReactWebView) view, url, null, null, null);
    }

    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    @Override
    public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
        return shouldOverrideUrlLoading((ReactWebView) view, request.getUrl().toString(), request.getMethod(), request.isForMainFrame(), request.hasGesture());
    }

    private boolean shouldOverrideUrlLoading(ReactWebView view, String url, String method, Boolean isForMainFrame, Boolean hasGesture) {
//        Log.i("ReactWebViewClient", "shouldOverrideUrlLoading: url:" + url + " method:" + method + " isForMainFrame:" + isForMainFrame + " hasGesture:" + hasGesture);
        if (url.startsWith("http://") || url.startsWith("https://")) {
            if (view.sendLoadRequest) {
                this.sendLoadRequest(view, url, method, isForMainFrame, hasGesture);
                return true;
            }
            return false;
        } else if (url.startsWith("file://")) {
            return false;
        } else {
            try {
                Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                view.getContext().startActivity(intent);
            } catch (ActivityNotFoundException e) {
                FLog.w(ReactConstants.TAG, "activity not found to handle uri scheme for: " + url, e);
            }
            return true;
        }
    }

    private void sendLoadRequest(ReactWebView view, String url, String method, Boolean isForMainFrame, Boolean hasGesture) {
        WritableMap event = Arguments.createMap();
        event.putString("url", url);
        event.putString("method", method);
        if (isForMainFrame != null) {
            event.putBoolean("isForMainFrame", isForMainFrame);
        }
        if (hasGesture != null) {
            event.putBoolean("hasGesture", hasGesture);
        }
        LoadRequestEvent loadRequestEvent = new LoadRequestEvent(view.getWrapperViewId(), event);
        ReactWebViewManager.dispatchEvent(view, loadRequestEvent);
    }

    @Override
    public void onReceivedError(
            WebView webView,
            int errorCode,
            String description,
            String failingUrl) {
        super.onReceivedError(webView, errorCode, description, failingUrl);
        mLastLoadFailed = true;

        // In case of an error JS side expect to get a finish event first, and then get an error event
        // Android WebView does it in the opposite way, so we need to simulate that behavior
        emitFinishEvent((ReactWebView) webView, failingUrl);

        WritableMap eventData = createWebViewEvent((ReactWebView) webView, failingUrl);
        eventData.putDouble("code", errorCode);
        eventData.putString("description", description);

        dispatchEvent(
                webView,
                new TopLoadingErrorEvent(((ReactWebView) webView).getWrapperViewId(), eventData));
    }

    @Override
    public void doUpdateVisitedHistory(WebView webView, String url, boolean isReload) {
        super.doUpdateVisitedHistory(webView, url, isReload);

        dispatchEvent(
                webView,
                new TopLoadingStartEvent(
                        ((ReactWebView) webView).getWrapperViewId(),
                        createWebViewEvent((ReactWebView) webView, url)));
    }

    private void emitFinishEvent(ReactWebView webView, String url) {
        WritableMap event = createWebViewEvent(webView, url);
        //LAB 扩展内容高度数据
//            ReactWebView reactWebView = (ReactWebView) webView;
//            int contentHeight = reactWebView.computeVerticalScrollRange();
//            if (contentHeight <= 0) {
//                contentHeight = reactWebView.getContentHeight();
//                if (contentHeight <= 0) {
//                    contentHeight = reactWebView.getHeight();
//                }
//            }
//            event.putInt("contentHeight", DisplayUtils.px2dp(contentHeight));
//            Log.i(TAG, "emitFinishEvent: contentHeight:" + contentHeight + " reactWebView.computeVerticalScrollRange()=" + reactWebView.computeVerticalScrollRange());

        dispatchEvent(
                webView,
                new TopLoadingFinishEvent(
                        webView.getWrapperViewId(),
                        event));
    }

    private WritableMap createWebViewEvent(ReactWebView webView, String url) {
        WritableMap event = Arguments.createMap();
        event.putDouble("target", webView.getWrapperViewId());
        // Don't use webView.getUrl() here, the URL isn't updated to the new value yet in callbacks
        // like onPageFinished
        event.putString("url", url);
        event.putBoolean("loading", !mLastLoadFailed && webView.getProgress() != 100);
        event.putString("title", webView.getTitle());
        event.putBoolean("canGoBack", webView.canGoBack());
        event.putBoolean("canGoForward", webView.canGoForward());

        return event;
    }
}
