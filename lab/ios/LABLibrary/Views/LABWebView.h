/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import <React/RCTView.h>

@class LABWebView;

/**
 * Special scheme used to pass messages to the injectedJavaScript
 * code without triggering a page load. Usage:
 *
 *   window.location.href = RCTJSNavigationScheme + '://hello'
 */
extern NSString *const RCTJSNavigationScheme;

@protocol LABWebViewDelegate <NSObject>

- (BOOL)webView:(LABWebView *)webView shouldStartLoadForRequest:(NSMutableDictionary<NSString *, id> *)request withCallback:(RCTDirectEventBlock)callback;

@end

@interface LABWebView : RCTView
@property(nonatomic, copy) RCTBubblingEventBlock onLoadRequest;
@property (nonatomic, weak) id<LABWebViewDelegate> delegate;
@property (nonatomic, copy) NSDictionary *source;
@property (nonatomic, assign) UIEdgeInsets contentInset;
@property (nonatomic, assign) BOOL automaticallyAdjustContentInsets;
@property (nonatomic, assign) BOOL messagingEnabled;
@property (nonatomic, copy) NSString *injectedJavaScript;
@property (nonatomic, assign) BOOL scalesPageToFit;

// LAB ex
@property (nonatomic, assign) BOOL fitContentHeight;
@property (nonatomic, assign) BOOL externalOpenUrl;
@property (nonatomic, assign) BOOL sendLoadRequest;

- (void)goForward;
- (void)goBack;
- (void)reload;
- (void)stopLoading;
- (void)postMessage:(NSString *)message;
- (void)injectJavaScript:(NSString *)script;

@end
