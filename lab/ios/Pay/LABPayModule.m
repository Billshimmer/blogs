//
//  LABPayModule.m
//  lab4
//
//  Created by QuanThomas on 16/8/11.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "LABPayModule.h"
#import <React/RCTUtils.h>

@implementation LABPayModule
{
  NSString *resultStr;
  NSString *errorCode;
  NSString *errorMsg;
  
  RCTPromiseResolveBlock _resolve;
  RCTPromiseRejectBlock _reject;
}

RCT_EXPORT_MODULE();

- (id)toArrayOrNSDictionary:(NSData *)jsonData{
  NSError *error = nil;
  id jsonObject = [NSJSONSerialization JSONObjectWithData:jsonData
                                                  options:NSJSONReadingAllowFragments
                                                    error:&error];
  
  if (jsonObject != nil && error == nil){
    return jsonObject;
  }else{
    // 解析错误
    return nil;
  }
  
}

- (void)toPay:(NSDictionary *)options {
  if (options != nil && options[@"charge"] == nil) {
    _reject(@"invalid", errorMsg, nil);
    return;
  }
  
  NSLog(@"%@", options[@"charge"]);
  NSString *chargeString = options[@"charge"] ;
  NSData *chargeData = [chargeString dataUsingEncoding:NSUTF8StringEncoding];
  
  id charge = [self toArrayOrNSDictionary:chargeData];
  
  if (charge == nil) {
    _reject(@"error", @"charge decode error", nil);
    return;
  }
  
  NSString *type = @"CFBundleURLTypes";
  NSArray *UrlTypes = [NSBundle mainBundle].infoDictionary[type];
  NSDictionary *dict = [UrlTypes firstObject];
  NSArray *urlschemes = [dict objectForKey:@"CFBundleURLSchemes"];
  NSString *scheme = [urlschemes firstObject];
  
  UIViewController *viewController = RCTPresentedViewController();
  
  dispatch_async(dispatch_get_main_queue(), ^{
    [Pingpp createPayment:charge
           viewController:viewController
             appURLScheme:scheme
           withCompletion:^(NSString *result, PingppError *error) {
             if ([result isEqualToString:@"success"]) {
               // 支付成功
               _resolve(@{@"pay_result": result});
             } else {
               // 支付失败或取消
               NSLog(@"Error: code=%lu msg=%@", error.code, [error getMsg]);
               
               if (error.code == 5) {
                 // cancel pay
                 _reject(@"cancel", errorMsg, nil);
               } else {
                 // fail pay
                 _reject(@"fail", errorMsg, nil);
               }
             }
           }];
    
    
    //    [Pingpp createPayment:charge appURLScheme:scheme withCompletion:^(NSString *result, PingppError *error) {
    //
    //
    //      resultStr = result;
    //      NSLog(@"completion block: %@", result);
    //      if (error == nil) {
    //        NSLog(@"PingppError is nil");
    //        _resolve(result);
    //      } else {
    //        NSLog(@"PingppError: code=%lu msg=%@", (unsigned  long)error.code, [error getMsg]);
    //        errorMsg = [error getMsg];
    //        errorCode = [NSString stringWithFormat:@"%lu", (unsigned  long)error.code];
    //
    //        if (error.code == 5) {
    //          // 支付取消
    //          _reject(@"cancel", errorMsg, nil);
    //        } else {
    //          // 支付失败
    //          _reject(@"fail", errorMsg, nil);
    //        }
    //
    //      }
    //    }];
    
  });
}

RCT_EXPORT_METHOD(pay: (NSDictionary *)options
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
  _reject = reject;
  _resolve = resolve;
  
  [self toPay:options];
}

+ (BOOL) payCanOpenURL:(NSURL *)url withCompletion:(PingppCompletion)completion{
  BOOL canHandleURL = [Pingpp handleOpenURL:url withCompletion:completion];
  return canHandleURL;
}

@end
