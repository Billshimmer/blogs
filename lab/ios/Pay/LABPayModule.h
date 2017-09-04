//
//  LABPayModule.h
//  lab4
//
//  Created by QuanThomas on 16/8/11.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import <React/RCTBridgeModule.h>
#import "Pingpp.h"

/*
URL Schemes 需要在 Xcode 的 Info 标签页的 URL Types 中添加，\
需要你自定义（不能使用 "alipay", "wx", "wechat" 等等这些），首字母必须是英文字母，支持英文和数字，不建议使用特殊符号。\
如果这个不设置，可能会导致支付完成之后，无法跳转回 App 或者无法得到结果回调。\
对于微信支付来说，必须添加一项值为微信平台上注册的应用程序 id（"wx" 开头的字符串）作为 URL Scheme。
#define kUrlScheme      @"lab4paydeomo" // 这个是你定义的 URL Scheme，支付宝、微信支付、银联和测试模式需要。
*/

/*
 
 ping++ 新增的需要设置的白名单列表
 
<key>LSApplicationQueriesSchemes</key>
  <array>
    <string>alipay</string>
    <string>alipays</string>
    <string>wechat</string>
    <string>weixin</string>
    <string>mqq</string>
  </array>
 */


@interface LABPayModule : NSObject <RCTBridgeModule>

+ (BOOL) payCanOpenURL:(NSURL *)url withCompletion:(PingppCompletion)completion;

@end
