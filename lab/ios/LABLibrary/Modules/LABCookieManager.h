//
//  LABCookieManager.h
//  lab4
//
//  Created by yinhf on 16/6/24.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@interface LABCookieManager : NSObject <RCTBridgeModule>

+ (void)setCookieWithUrl:(NSString *)urlString key:(NSString *)key value:(NSString *)value;

- (void)clearCookies;

@end
