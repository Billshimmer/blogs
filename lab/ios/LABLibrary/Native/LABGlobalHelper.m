//
//  LABGlobalHelper.m
//  lab4
//
//  Created by QuanThomas on 16/8/31.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "LABGlobalHelper.h"

@implementation LABGlobalHelper

+ (NSDictionary *)getCallback:(NSString *)code message:(NSString *)message data:(NSDictionary *)data {
  return @{
           @"code": code,
           @"message": message,
           @"data": data
          };
}

+ (NSDictionary *)getCallbackBrief:(NSString *)code {
  return @{
           @"code": code,
           @"message": code
           };
}



@end
