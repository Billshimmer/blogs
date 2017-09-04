//
//  JPushHelper.h
//  PushDemo
//
//  Created by oshumini on 16/3/14.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import "JPUSHService.h"
#import <React/RCTEventEmitter.h>

#define kJPFDidReceiveRemoteNotification  @"kJPFDidReceiveRemoteNotification"


@interface LABPushManager : NSObject <RCTBridgeModule>

@property(strong,nonatomic) RCTResponseSenderBlock asyCallback;

- (void)startJPush:(NSString *)key ;

- (void)didRegistRemoteNotification:(NSString *)token;

@end
