/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 * <p>
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

package com.lightappbuilder.lab4.lablibrary.rnviews.webview;

import android.os.Build;
import android.view.View;
import android.view.ViewGroup.LayoutParams;
import android.webkit.GeolocationPermissions;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.common.build.ReactBuildConfig;
import com.facebook.react.uimanager.BaseViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.facebook.react.views.webview.WebViewConfig;
import com.lightappbuilder.lab4.lablibrary.Config;
import com.lightappbuilder.lab4.lablibrary.rnviews.DynamicSizeShadowNode;
import com.lightappbuilder.lab4.lablibrary.rnviews.DynamicSizeShadowNodeBridge;
import com.lightappbuilder.lab4.lablibrary.rnviews.DynamicSizeWrapperView;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

import javax.annotation.Nullable;

/**
 * Manages instances of {@link WebView}
 * <p>
 * Can accept following commands:
 * - GO_BACK
 * - GO_FORWARD
 * - RELOAD
 * <p>
 * {@link WebView} instances could emit following direct events:
 * - topLoadingFinish
 * - topLoadingStart
 * - topLoadingError
 * <p>
 * Each event will carry the following properties:
 * - target - view's react tag
 * - url - url set for the webview
 * - loading - whether webview is in a loading state
 * - title - title of the current page
 * - canGoBack - boolean, whether there is anything on a history stack to go back
 * - canGoForward - boolean, whether it is possible to request GO_FORWARD command
 */
public class ReactWebViewManager extends BaseViewManager<DynamicSizeWrapperView, DynamicSizeShadowNode> {
    private static final String TAG = "ReactWebViewManager";

    private static final String REACT_CLASS = "LABWebView";

    private static final String HTML_ENCODING = "UTF-8";
    private static final String HTML_MIME_TYPE = "text/html; charset=utf-8";
    static final String BRIDGE_NAME = "__REACT_WEB_VIEW_BRIDGE";
    private static final String HTTP_METHOD_POST = "POST";

    public static final int COMMAND_GO_BACK = 1;
    public static final int COMMAND_GO_FORWARD = 2;
    public static final int COMMAND_RELOAD = 3;
    public static final int COMMAND_STOP_LOADING = 4;
    public static final int COMMAND_POST_MESSAGE = 5;

    // Use `webView.loadUrl("about:blank")` to reliably reset the view
    // state and release page resources (including any running JavaScript).
    private static final String BLANK_URL = "about:blank";

    private WebViewConfig mWebViewConfig;

    public ReactWebViewManager() {
        mWebViewConfig = new WebViewConfig() {
            public void configWebView(WebView webView) {
            }
        };
    }

    public ReactWebViewManager(WebViewConfig webViewConfig) {
        mWebViewConfig = webViewConfig;
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected DynamicSizeWrapperView createViewInstance(ThemedReactContext reactContext) {
        ReactWebView webView = new ReactWebView(reactContext);

        //LAB 修改
        webView.setOverScrollMode(View.OVER_SCROLL_NEVER);
        //webView.setBackgroundColor(0);

        webView.setWebChromeClient(new LABWebChromeClient(reactContext));
        reactContext.addLifecycleEventListener(webView);
        mWebViewConfig.configWebView(webView);
        webView.getSettings().setBuiltInZoomControls(true);
        webView.getSettings().setDisplayZoomControls(false);

        // Fixes broken full-screen modals/galleries due to body height being 0.
        webView.setLayoutParams(
                new LayoutParams(LayoutParams.MATCH_PARENT,
                        LayoutParams.MATCH_PARENT));

        if (ReactBuildConfig.DEBUG && Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            WebView.setWebContentsDebuggingEnabled(true);
        }

        WebSettings webSettings = webView.getSettings();
        webSettings.setUserAgentString(webSettings.getUserAgentString() + " " + Config.userAgent());
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            // http://www.jianshu.com/p/ff55a923f648
            webSettings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        }

        DynamicSizeWrapperView view = new DynamicSizeWrapperView(reactContext);
        view.addView(webView, view.getFitContentLayoutParams(false, false));
        view.setSizeBridge(new DynamicSizeShadowNodeBridge(reactContext, view));
        return view;
    }

    @ReactProp(name = "javaScriptEnabled")
    public void setJavaScriptEnabled(DynamicSizeWrapperView view, boolean enabled) {
        ((ReactWebView) view.getWrappedChild()).getSettings().setJavaScriptEnabled(enabled);
    }

    @ReactProp(name = "scalesPageToFit")
    public void setScalesPageToFit(DynamicSizeWrapperView view, boolean enabled) {
        ((ReactWebView) view.getWrappedChild()).getSettings().setUseWideViewPort(!enabled);
    }

    @ReactProp(name = "domStorageEnabled")
    public void setDomStorageEnabled(DynamicSizeWrapperView view, boolean enabled) {
        ((ReactWebView) view.getWrappedChild()).getSettings().setDomStorageEnabled(enabled);
    }


    @ReactProp(name = "userAgent")
    public void setUserAgent(DynamicSizeWrapperView view, @Nullable String userAgent) {
        if (userAgent != null) {
            // TODO(8496850): Fix incorrect behavior when property is unset (uA == null)
            ((ReactWebView) view.getWrappedChild()).getSettings().setUserAgentString(userAgent);
        }
    }

    @ReactProp(name = "mediaPlaybackRequiresUserAction")
    public void setMediaPlaybackRequiresUserAction(DynamicSizeWrapperView view, boolean requires) {
        ((ReactWebView) view.getWrappedChild()).getSettings().setMediaPlaybackRequiresUserGesture(requires);
    }

    @ReactProp(name = "allowUniversalAccessFromFileURLs")
    public void setAllowUniversalAccessFromFileURLs(WebView view, boolean allow) {
        view.getSettings().setAllowUniversalAccessFromFileURLs(allow);
    }

    @ReactProp(name = "injectedJavaScript")
    public void setInjectedJavaScript(DynamicSizeWrapperView view, @Nullable String injectedJavaScript) {
        ((ReactWebView) view.getWrappedChild()).setInjectedJavaScript(injectedJavaScript);
    }

    @ReactProp(name = "source")
    public void setSource(DynamicSizeWrapperView wrapperView, @Nullable ReadableMap source) {
        ReactWebView view = (ReactWebView) wrapperView.getWrappedChild();
        if (source != null) {
            if (source.hasKey("html")) {
                String html = source.getString("html");
                if (source.hasKey("baseUrl")) {
                    view.loadDataWithBaseURL(
                            source.getString("baseUrl"), html, HTML_MIME_TYPE, HTML_ENCODING, null);
                } else {
                    view.loadData(html, HTML_MIME_TYPE, HTML_ENCODING);
                }
                return;
            }
            if (source.hasKey("uri")) {
                String url = source.getString("uri");
                String previousUrl = view.getUrl();
                if (previousUrl != null && previousUrl.equals(url)) {
                    return;
                }
                if (source.hasKey("method")) {
                    String method = source.getString("method");
                    if (method.equals(HTTP_METHOD_POST)) {
                        byte[] postData = null;
                        if (source.hasKey("body")) {
                            String body = source.getString("body");
                            try {
                                postData = body.getBytes("UTF-8");
                            } catch (UnsupportedEncodingException e) {
                                postData = body.getBytes();
                            }
                        }
                        if (postData == null) {
                            postData = new byte[0];
                        }
                        view.postUrl(url, postData);
                        return;
                    }
                }
                HashMap<String, String> headerMap = new HashMap<>();
                if (source.hasKey("headers")) {
                    ReadableMap headers = source.getMap("headers");
                    ReadableMapKeySetIterator iter = headers.keySetIterator();
                    while (iter.hasNextKey()) {
                        String key = iter.nextKey();
                        if ("user-agent".equals(key.toLowerCase(Locale.ENGLISH))) {
                            if (view.getSettings() != null) {
                                view.getSettings().setUserAgentString(headers.getString(key));
                            }
                        } else {
                            headerMap.put(key, headers.getString(key));
                        }
                    }
                }
                view.loadUrl(url, headerMap);
                return;
            }
        }
        view.loadUrl(BLANK_URL);
    }

    @ReactProp(name = "onContentSizeChange")
    public void setOnContentSizeChange(WebView view, boolean sendContentSizeChangeEvents) {
        // TODO 官方给的onContentSizeChange 实现方式不行
    }

    @ReactProp(name = "fitContentHeight")
    public void setFitContentHeight(DynamicSizeWrapperView view, boolean fitContentHeight) {
        view.setFitContent(false, fitContentHeight);
    }

    @ReactProp(name = "externalOpenUrl")
    public void setExternalOpenUrl(DynamicSizeWrapperView view, boolean externalOpenUrl) {
        ((ReactWebView) view.getWrappedChild()).externalOpenUrl = externalOpenUrl;
    }

    @ReactProp(name = "sendLoadRequest")
    public void setSendLoadRequest(DynamicSizeWrapperView view, boolean sendLoadRequest) {
        ((ReactWebView) view.getWrappedChild()).sendLoadRequest = sendLoadRequest;
    }

    @Override
    protected void addEventEmitters(ThemedReactContext reactContext, DynamicSizeWrapperView view) {
        // Do not register default touch emitter and let WebView implementation handle touches
        ((ReactWebView) view.getWrappedChild()).setWebViewClient(new ReactWebViewClient());
    }

    @Override
    public
    @Nullable
    Map<String, Integer> getCommandsMap() {
        return MapBuilder.of(
                "goBack", COMMAND_GO_BACK,
                "goForward", COMMAND_GO_FORWARD,
                "reload", COMMAND_RELOAD,
                "stopLoading", COMMAND_STOP_LOADING,
                "postMessage", COMMAND_POST_MESSAGE);
    }

    @Override
    public void receiveCommand(DynamicSizeWrapperView view, int commandId, @Nullable ReadableArray args) {
        ReactWebView root = ((ReactWebView) view.getWrappedChild());
        switch (commandId) {
            case COMMAND_GO_BACK:
                root.goBack();
                break;
            case COMMAND_GO_FORWARD:
                root.goForward();
                break;
            case COMMAND_RELOAD:
                root.reload();
                break;
            case COMMAND_STOP_LOADING:
                root.stopLoading();
                break;
            case COMMAND_POST_MESSAGE:
                try {
                    JSONObject eventInitDict = new JSONObject();
                    eventInitDict.put("data", args.getString(0));
                    root.loadUrl("javascript:(document.dispatchEvent(new MessageEvent('message', " + eventInitDict.toString() + ")))");
                } catch (JSONException e) {
                    throw new RuntimeException(e);
                }
                break;
        }
    }

    @Nullable
    @Override
    public Map getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.builder().put("onLoadRequest", MapBuilder.of("registrationName", "onLoadRequest")).build();
    }

    @Override
    public void onDropViewInstance(DynamicSizeWrapperView view) {
        super.onDropViewInstance(view);
        ReactWebView webView = ((ReactWebView) view.getWrappedChild());
        ((ThemedReactContext) webView.getContext()).removeLifecycleEventListener((ReactWebView) webView);
        ((ReactWebView) webView).cleanupCallbacksAndDestroy();
    }

    @Override
    public void updateExtraData(DynamicSizeWrapperView root, Object extraData) {

    }

    @Override
    public DynamicSizeShadowNode createShadowNodeInstance() {
        return new DynamicSizeShadowNode();
    }

    @Override
    public Class<? extends DynamicSizeShadowNode> getShadowNodeClass() {
        return DynamicSizeShadowNode.class;
    }

    static void dispatchEvent(WebView webView, Event event) {
        ReactContext reactContext = (ReactContext) webView.getContext();
        EventDispatcher eventDispatcher =
                reactContext.getNativeModule(UIManagerModule.class).getEventDispatcher();
        eventDispatcher.dispatchEvent(event);
    }
}
