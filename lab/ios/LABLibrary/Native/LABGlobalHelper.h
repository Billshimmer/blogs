//
//  LABGlobalHelper.h
//  lab4
//
//  Created by QuanThomas on 16/8/31.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface LABGlobalHelper : NSObject

/**
 *  code: success代表成功，cancel代表取消，失败时视具体情况传入
 *
 *  @param code    success代表成功，cancel代表取消，失败时视具体情况传入
 *  @param message 回调的信息
 *  @param data    回调需要带上的数据
 *
 *  @return 回调字典
 */
+ (NSDictionary *)getCallback:(NSString *)code message:(NSString *)message data:(NSDictionary *)data;

+ (NSDictionary *)getCallbackBrief:(NSString *)code;

@end
