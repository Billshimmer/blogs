/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "LABWebView.h"

#import <UIKit/UIKit.h>

#import <React/RCTAutoInsetsProtocol.h>
#import <React/RCTConvert.h>
#import <React/RCTEventDispatcher.h>
#import <React/RCTLog.h>
#import <React/RCTUtils.h>
#import <React/RCTView.h>
#import <React/UIView+React.h>
#import <React/RCTEventEmitter.h>

NSString *const LABJSNavigationScheme = @"react-js-navigation";
NSString *const LABJSPostMessageHost = @"postMessage";

@interface LABWebView () <UIWebViewDelegate, RCTAutoInsetsProtocol>

@property (nonatomic, copy) RCTDirectEventBlock onLoadingStart;
@property (nonatomic, copy) RCTDirectEventBlock onLoadingFinish;
@property (nonatomic, copy) RCTDirectEventBlock onLoadingError;
@property (nonatomic, copy) RCTDirectEventBlock onShouldStartLoadWithRequest;
@property (nonatomic, copy) RCTDirectEventBlock onMessage;
@property (nonatomic, copy) RCTDirectEventBlock onContentHeightChange;

@end

@implementation LABWebView
{
  UIWebView *_webView;
  NSString *_injectedJavaScript;
  CGFloat height;
  CGFloat screenWidth;
  NSString *_webViewNavigationType;
}

- (void)dealloc
{
  [_webView.scrollView removeObserver:self forKeyPath:@"contentSize"];
  _webView.delegate = nil;
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if ((self = [super initWithFrame:frame])) {
    super.backgroundColor = [UIColor clearColor];
    _automaticallyAdjustContentInsets = YES;
    _contentInset = UIEdgeInsetsZero;
    _webView = [[UIWebView alloc] initWithFrame:self.bounds];
    _webView.backgroundColor = [UIColor clearColor];
    _webView.delegate = self;
    self.backgroundColor = [UIColor clearColor];
    [self addSubview:_webView];
    [_webView.scrollView addObserver:self forKeyPath:@"contentSize" options:NSKeyValueObservingOptionNew context:nil];
    screenWidth = [UIScreen mainScreen].bounds.size.width;
  }
  return self;
}

RCT_NOT_IMPLEMENTED(- (instancetype)initWithCoder:(NSCoder *)aDecoder)

- (void)goForward
{
  [_webView goForward];
}

- (void)goBack
{
  [_webView goBack];
}

- (void)reload
{
  NSURLRequest *request = [RCTConvert NSURLRequest:self.source];
  if (request.URL && !_webView.request.URL.absoluteString.length) {
    [_webView loadRequest:request];
  }
  else {
    [_webView reload];
  }
}

- (void)stopLoading
{
  [_webView stopLoading];
}

- (void)postMessage:(NSString *)message
{
  NSDictionary *eventInitDict = @{
    @"data": message,
  };
  NSString *source = [NSString
    stringWithFormat:@"document.dispatchEvent(new MessageEvent('message', %@));",
    RCTJSONStringify(eventInitDict, NULL)
  ];
  [_webView stringByEvaluatingJavaScriptFromString:source];
}

- (void)injectJavaScript:(NSString *)script
{
  [_webView stringByEvaluatingJavaScriptFromString:script];
}

- (void)setSource:(NSDictionary *)source
{
  if (![_source isEqualToDictionary:source]) {
    _source = [source copy];

    // Check for a static html source first
    NSString *html = [RCTConvert NSString:source[@"html"]];
    if (html) {
      NSURL *baseURL = [RCTConvert NSURL:source[@"baseUrl"]];
      if (!baseURL) {
        baseURL = [NSURL URLWithString:@"about:blank"];
      }
      [_webView loadHTMLString:html baseURL:baseURL];
      return;
    }

    NSURLRequest *request = [RCTConvert NSURLRequest:source];
    // Because of the way React works, as pages redirect, we actually end up
    // passing the redirect urls back here, so we ignore them if trying to load
    // the same url. We'll expose a call to 'reload' to allow a user to load
    // the existing page.
    if ([request.URL isEqual:_webView.request.URL]) {
      return;
    }
    if (!request.URL) {
      // Clear the webview
      [_webView loadHTMLString:@"" baseURL:nil];
      return;
    }
    [_webView loadRequest:request];
  }
}

- (void)layoutSubviews
{
  [super layoutSubviews];
  _webView.frame = self.bounds;
}

- (void)setContentInset:(UIEdgeInsets)contentInset
{
  _contentInset = contentInset;
  [RCTView autoAdjustInsetsForView:self
                    withScrollView:_webView.scrollView
                      updateOffset:NO];
}

- (void)setScalesPageToFit:(BOOL)scalesPageToFit
{
  if (_webView.scalesPageToFit != scalesPageToFit) {
    _webView.scalesPageToFit = scalesPageToFit;
    [_webView reload];
  }
}

- (BOOL)scalesPageToFit
{
  return _webView.scalesPageToFit;
}

- (void)setBackgroundColor:(UIColor *)backgroundColor
{
  CGFloat alpha = CGColorGetAlpha(backgroundColor.CGColor);
  self.opaque = _webView.opaque = (alpha == 1.0);
  _webView.backgroundColor = backgroundColor;
}

- (UIColor *)backgroundColor
{
  return _webView.backgroundColor;
}

- (NSMutableDictionary<NSString *, id> *)baseEvent
{
  NSMutableDictionary<NSString *, id> *event = [[NSMutableDictionary alloc] initWithDictionary:@{
    @"url": _webView.request.URL.absoluteString ?: @"",
    @"loading" : @(_webView.loading),
    @"title": [_webView stringByEvaluatingJavaScriptFromString:@"document.title"],
    @"canGoBack": @(_webView.canGoBack),
    @"canGoForward" : @(_webView.canGoForward),
  }];

  return event;
}

- (void)refreshContentInset
{
  [RCTView autoAdjustInsetsForView:self
                    withScrollView:_webView.scrollView
                      updateOffset:YES];
}

#pragma mark - UIWebViewDelegate methods

- (BOOL)webView:(__unused UIWebView *)webView shouldStartLoadWithRequest:(NSURLRequest *)request navigationType:(UIWebViewNavigationType)navigationType {
  if (_externalOpenUrl) {
    NSURL *requestURL =[request URL];
    if (([[requestURL scheme] isEqualToString: @"http"] || [[requestURL scheme] isEqualToString: @"https"] || [[requestURL scheme] isEqualToString: @"mailto" ]) && (navigationType == UIWebViewNavigationTypeLinkClicked)) {
      return ![[UIApplication sharedApplication] openURL:requestURL];
    }
  }
  BOOL isJSNavigation = [request.URL.scheme isEqualToString:LABJSNavigationScheme];
  NSURLRequest* originalRequest = [RCTConvert NSURLRequest:self.source];
  if (![request.URL.absoluteString isEqualToString:originalRequest.URL.absoluteString] && self.sendLoadRequest) {
    NSString* url = request.URL.absoluteString;
    NSString* method = request.HTTPMethod;
    BOOL isFrame = ![[[request URL] absoluteString] isEqualToString:[[request mainDocumentURL] absoluteString]];
    NSMutableDictionary* values = [NSMutableDictionary dictionaryWithCapacity:4];
    [values setObject:url forKey:@"url"];
    [values setObject:method forKey:@"method"];
    [values setObject:@(isFrame) forKey:@"isForMainFrame"];
    [values setObject:@(isJSNavigation) forKey:@"isForMainFrame"];
    if (self.onLoadRequest) {
      self.onLoadRequest(values);
    }
  }
  
  static NSDictionary<NSNumber *, NSString *> *navigationTypes;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    navigationTypes = @{
      @(UIWebViewNavigationTypeLinkClicked): @"click",
      @(UIWebViewNavigationTypeFormSubmitted): @"formsubmit",
      @(UIWebViewNavigationTypeBackForward): @"backforward",
      @(UIWebViewNavigationTypeReload): @"reload",
      @(UIWebViewNavigationTypeFormResubmitted): @"formresubmit",
      @(UIWebViewNavigationTypeOther): @"other",
    };
  });

  // skip this for the JS Navigation handler
  if (!isJSNavigation && _onShouldStartLoadWithRequest) {
    NSMutableDictionary<NSString *, id> *event = [self baseEvent];
    [event addEntriesFromDictionary: @{
      @"url": (request.URL).absoluteString,
      @"navigationType": navigationTypes[@(navigationType)]
    }];
	_webViewNavigationType = navigationTypes[@(navigationType)];
    if (![self.delegate webView:self shouldStartLoadForRequest:event withCallback:_onShouldStartLoadWithRequest]) {
      return NO;
    }
  }
  
  if (isJSNavigation && [request.URL.host isEqualToString:LABJSPostMessageHost]) {
    NSString *data = request.URL.query;
    data = [data stringByReplacingOccurrencesOfString:@"+" withString:@" "];
    data = [data stringByReplacingPercentEscapesUsingEncoding:NSUTF8StringEncoding];

    NSMutableDictionary<NSString *, id> *event = [self baseEvent];
    [event addEntriesFromDictionary: @{ @"data": data}];
    _onMessage(event);
  }

  // JS Navigation handler
  return !isJSNavigation;
}

- (void)webViewDidStartLoad:(UIWebView *)webView {
  if (_onLoadingStart) {
    // TODO
//    NSMutableDictionary<NSString *, id> *event = [self baseEvent];
//    [event addEntriesFromDictionary:@{
//                                      @"url": webView.request.URL.absoluteString,
//                                      @"navigationType": _webViewNavigationType
//                                      }];
    _onLoadingStart([self baseEvent]);
  }
}

- (void)webView:(__unused UIWebView *)webView didFailLoadWithError:(NSError *)error
{
  if (_onLoadingError) {
    if ([error.domain isEqualToString:NSURLErrorDomain] && error.code == NSURLErrorCancelled) {
      // NSURLErrorCancelled is reported when a page has a redirect OR if you load
      // a new URL in the WebView before the previous one came back. We can just
      // ignore these since they aren't real errors.
      // http://stackoverflow.com/questions/1024748/how-do-i-fix-nsurlerrordomain-error-999-in-iphone-3-0-os
      return;
    }

    NSMutableDictionary<NSString *, id> *event = [self baseEvent];
    [event addEntriesFromDictionary:@{
      @"domain": error.domain,
      @"code": @(error.code),
      @"description": error.localizedDescription,
    }];
    _onLoadingError(event);
  }
}

- (void)webViewDidFinishLoad:(UIWebView *)webView
{
  
  NSMutableDictionary<NSString *, id> *event = [self baseEvent];
  
  if (_messagingEnabled) {
    #if RCT_DEV
    // See isNative in lodash
    NSString *testPostMessageNative = @"String(window.postMessage) === String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage')";
    BOOL postMessageIsNative = [
      [webView stringByEvaluatingJavaScriptFromString:testPostMessageNative]
      isEqualToString:@"true"
    ];
    if (!postMessageIsNative) {
      RCTLogError(@"Setting onMessage on a WebView overrides existing values of window.postMessage, but a previous value was defined");
    }
    #endif
    NSString *source = [NSString stringWithFormat:
      @"window.originalPostMessage = window.postMessage;"
      "window.postMessage = function(data) {"
        "window.location = '%@://%@?' + encodeURIComponent(String(data));"
      "};", RCTJSNavigationScheme, LABJSPostMessageHost
    ];
    [webView stringByEvaluatingJavaScriptFromString:source];
  }
//  网页的 readyState 属性也可以返回当前加载状态，共有5种
//  uninitialized : 还没开始加载
//  loading : 加载中
//  loaded : 加载完成
//  interactive : 结束渲染，用户已经可以与网页进行交互。但内嵌资源还在加载中
//  complete : 完全加载完成
//  NSString *readyState = [webView stringByEvaluatingJavaScriptFromString:@"document.readyState"];
//  NSLog(@"readyStatus is %@", readyState);
//  BOOL isLoaded = [readyState isEqualToString:@"loaded"] || [readyState isEqualToString:@"interactive"] || [readyState isEqualToString:@"complete"];
  if (_injectedJavaScript != nil && !webView.isLoading) {
    
      NSString *jsEvaluationValue = [webView stringByEvaluatingJavaScriptFromString:_injectedJavaScript];
      event[@"jsEvaluationValue"] = jsEvaluationValue;
      
      _onLoadingFinish(event);
    
  }
  // we only need the final 'finishLoad' call so only fire the event when we're actually done loading.
  // XXX 修改 为什么url为about:blank 就不回调_onLoadingFinish
  else if (_onLoadingFinish && !webView.loading/* && ![webView.request.URL.absoluteString isEqualToString:@"about:blank"]*/) {
      _onLoadingFinish([self baseEvent]);
  }

}

// LAB ex

- (void)setFitContentHeight:(BOOL)fitContentHeight
{
  _fitContentHeight = fitContentHeight;
  _webView.scrollView.bounces = !fitContentHeight;
}

- (void)sendEventForContentHeightChange:(CGFloat) contentHeight
{
  NSLog(@"height is %f\n", contentHeight);
  NSMutableDictionary<NSString *, id> *eventForHeight = [self baseEvent];
  eventForHeight[@"contentHeight"] = [NSNumber numberWithDouble:(double) contentHeight];
  _onContentHeightChange(eventForHeight);
}

- (void)observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object change:(NSDictionary *)change context:(void *)context
{
  if ([keyPath isEqualToString:@"contentSize"]) {
    CGFloat scrollHeight = [[_webView scrollView] contentSize].height;
//    CGFloat scrollHeight = [[_webView stringByEvaluatingJavaScriptFromString:@"document.body.scrollHeight"] floatValue];
    if (scrollHeight != 0) {
      if (height != scrollHeight) {
        [self sendEventForContentHeightChange:scrollHeight];
        height = scrollHeight;
      }
    }
  }
}

@end
