//
//  LABCookieManager.m
//  lab4
//
//  Created by yinhf on 16/6/24.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "LABCookieManager.h"
#import "AppConfig.h"

@implementation LABCookieManager

RCT_EXPORT_MODULE()
//RCT_EXTERN void RCTRegisterModule(Class);
//+ (NSString *)moduleName { return nil; }
//+ (void)load {
//  NSLog(@"LABCookieManager load");
//  RCTRegisterModule(self);
//}

RCT_EXPORT_METHOD(setFromResponse:(NSURL *)url
                            value:(NSString *)value
                         callback:(RCTResponseSenderBlock)callback) {
  NSArray *cookies = [NSHTTPCookie cookiesWithResponseHeaderFields:[NSDictionary dictionaryWithObjectsAndKeys:value, @"Set-Cookie", nil] forURL:url];
  [[NSHTTPCookieStorage sharedHTTPCookieStorage] setCookies:cookies forURL:url mainDocumentURL:NULL];
  callback(@[[NSNull null]]);
}


RCT_EXPORT_METHOD(get:(NSURL *)url
             callback:(RCTResponseSenderBlock)callback) {
  NSMutableDictionary *cookies = [NSMutableDictionary dictionary];
  for (NSHTTPCookie *c in [[NSHTTPCookieStorage sharedHTTPCookieStorage] cookiesForURL:url]) {
    if (!c.isHTTPOnly) {
      [cookies setObject:c.value forKey:c.name];
    }
  }
  callback(@[[NSNull null], cookies]);
}

+ (void)setCookieWithUrl:(NSString *)urlString key:(NSString *)key value:(NSString *)value {
  NSDate *date = [NSDate dateWithTimeIntervalSinceNow:60*60*24*365*20]; // 20年
  
  NSURL *url = [NSURL URLWithString:urlString];
  //设置cookie 注意，所有值都是NSString类型的
  NSMutableDictionary *cookieProperties = [NSMutableDictionary dictionary];
  [cookieProperties setObject:key forKey:NSHTTPCookieName];//名称
  [cookieProperties setObject:value forKey:NSHTTPCookieValue];//值
  [cookieProperties setObject:[url host] forKey:NSHTTPCookieDomain];//域
  [cookieProperties setObject:url forKey:NSHTTPCookieOriginURL];
  [cookieProperties setObject:[url path] forKey:NSHTTPCookiePath];//路径
  [cookieProperties setObject:@"0" forKey:NSHTTPCookieVersion];//cookie版本0
  [cookieProperties setObject:date forKey:NSHTTPCookieExpires];//过期时间
  // [cookieProperties setObject:@"30000" forKey:NSHTTPCookieMaximumAge];//有效期
  
  NSHTTPCookie *cookie = [NSHTTPCookie cookieWithProperties:cookieProperties];
  [[NSHTTPCookieStorage sharedHTTPCookieStorage] setCookies:@[cookie] forURL:url mainDocumentURL:NULL];
//  NSLog(@"设置cookie key=%@，value=%@",key,value);
}

- (void)clearCookies
{
  NSHTTPCookieStorage *cookieStorage = [NSHTTPCookieStorage sharedHTTPCookieStorage];
  NSArray *cookies = [[NSHTTPCookieStorage sharedHTTPCookieStorage] cookies];
  
  for (NSHTTPCookie *tempCookie in cookies) {
    [cookieStorage deleteCookie:tempCookie];
  }
  
//  //把cookie打印出来，检测是否已经删除
//  NSArray *cookiesAfterDelete = [[NSHTTPCookieStorage sharedHTTPCookieStorage] cookies];
//  for (NSHTTPCookie *tempCookie in cookiesAfterDelete) {
//    NSLog(@"cookieAfterDelete: %@", tempCookie);
//  }
//  NSLog(@"\n");
}

@end
