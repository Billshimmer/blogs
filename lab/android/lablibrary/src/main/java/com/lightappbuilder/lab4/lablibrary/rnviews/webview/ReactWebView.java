package com.lightappbuilder.lab4.lablibrary.rnviews.webview;

import android.os.Build;
import android.text.TextUtils;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebView;

import com.facebook.common.logging.FLog;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.common.ReactConstants;
import com.facebook.react.common.build.ReactBuildConfig;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.views.webview.events.TopMessageEvent;
import com.lightappbuilder.lab4.lablibrary.rnviews.DynamicSizeWrapperView;

import javax.annotation.Nullable;

import static com.lightappbuilder.lab4.lablibrary.rnviews.webview.ReactWebViewManager.BRIDGE_NAME;
import static com.lightappbuilder.lab4.lablibrary.rnviews.webview.ReactWebViewManager.dispatchEvent;

/**
 * Subclass of {@link WebView} that implements {@link LifecycleEventListener} interface in order
 * to call {@link WebView#destroy} on activty destroy event and also to clear the client
 */
public class ReactWebView extends WebView implements LifecycleEventListener {
    private @Nullable
    String injectedJS;
    private boolean messagingEnabled = false;

    boolean externalOpenUrl;
    boolean sendLoadRequest;
    LABWebChromeClient webChromeClient;

    private class ReactWebViewBridge {
        ReactWebView mContext;

        ReactWebViewBridge(ReactWebView c) {
            mContext = c;
        }

        @JavascriptInterface
        public void postMessage(String message) {
            mContext.onMessage(message);
        }
    }

    /**
     * WebView must be created with an context of the current activity
     *
     * Activity Context is required for creation of dialogs internally by WebView
     * Reactive Native needed for access to ReactNative internal system functionality
     *
     */
    public ReactWebView(ThemedReactContext reactContext) {
        super(reactContext);
    }

    @Override
    public void onHostResume() {
        // do nothing
    }

    @Override
    public void onHostPause() {
        // do nothing
    }

    @Override
    public void onHostDestroy() {
        cleanupCallbacksAndDestroy();
    }

    public void setInjectedJavaScript(@Nullable String js) {
        injectedJS = js;
    }

    public void setMessagingEnabled(boolean enabled) {
        if (messagingEnabled == enabled) {
            return;
        }

        messagingEnabled = enabled;
        if (enabled) {
            addJavascriptInterface(new ReactWebViewBridge(this), BRIDGE_NAME);
            linkBridge();
        } else {
            removeJavascriptInterface(BRIDGE_NAME);
        }
    }

    public void callInjectedJavaScript() {
        if (getSettings().getJavaScriptEnabled() &&
                injectedJS != null &&
                !TextUtils.isEmpty(injectedJS)) {
            loadUrl("javascript:(function() {\n" + injectedJS + ";\n})();");
        }
    }

    public void linkBridge() {
        if (messagingEnabled) {
            if (ReactBuildConfig.DEBUG && Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
                // See isNative in lodash
                String testPostMessageNative = "String(window.postMessage) === String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage')";
                evaluateJavascript(testPostMessageNative, new ValueCallback<String>() {
                    @Override
                    public void onReceiveValue(String value) {
                        if (value.equals("true")) {
                            FLog.w(ReactConstants.TAG, "Setting onMessage on a WebView overrides existing values of window.postMessage, but a previous value was defined");
                        }
                    }
                });
            }

            loadUrl("javascript:(" +
                    "window.originalPostMessage = window.postMessage," +
                    "window.postMessage = function(data) {" +
                    BRIDGE_NAME + ".postMessage(String(data));" +
                    "}" +
                    ")");
        }
    }

    public void onMessage(String message) {
        dispatchEvent(this, new TopMessageEvent(this.getId(), message));
    }

    void cleanupCallbacksAndDestroy() {
        if (webChromeClient != null) {
            webChromeClient.onDestroy();
            webChromeClient = null;
        }
        setWebViewClient(null);
        destroy();
    }

    @Override
    public int computeVerticalScrollRange() {
        return super.computeVerticalScrollRange();
    }

//    @Override
//    protected void onSizeChanged(int w, int h, int ow, int oh) {
//        super.onSizeChanged(w, h, ow, oh);
//    }


    @Override
    public void setWebChromeClient(WebChromeClient client) {
        super.setWebChromeClient(client);
        webChromeClient = (LABWebChromeClient) client;
    }

    public DynamicSizeWrapperView getWrapperView() {
        return (DynamicSizeWrapperView) getParent();
    }

    public int getWrapperViewId() {
        return getWrapperView().getId();
    }
}
