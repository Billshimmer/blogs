//
//  LABAppDelegate.m
//  lab4
//
//  Created by QuanThomas on 16/8/26.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "LABAppDelegate.h"
#import "LABPushManager.h"
#import "AppConfig.h"

static NSString *JPUSHFlag = @"_j_msgid";
static NSString *IMFlag = @"ConversationChatter";

@implementation LABAppDelegate

- (NSMutableDictionary *)getLABLaunchOptions:(NSDictionary *)launchOptions
{
  if (launchOptions == nil) {
    return nil;
  }
  NSMutableDictionary *labLaunchOptions = [launchOptions mutableCopy];
  UILocalNotification *localNotify = [launchOptions objectForKey:UIApplicationLaunchOptionsLocalNotificationKey];
  if(localNotify)
  {
    NSString *targetImId = localNotify.userInfo[@"ConversationChatter"];
    NSMutableDictionary *labUserInfo = [localNotify.userInfo mutableCopy];
    [labUserInfo setObject:targetImId forKey:@"targetImId"];
    [labUserInfo setObject:@"IM" forKey:@"lab_notification_type"];
    [labUserInfo setObject:[NSNumber numberWithBool:NO] forKey:@"lab_is_notification_click"];
    localNotify.userInfo = labUserInfo;
    [labLaunchOptions setObject:localNotify forKey:UIApplicationLaunchOptionsLocalNotificationKey];
  }
  NSDictionary * userInfo = [launchOptions objectForKey:UIApplicationLaunchOptionsRemoteNotificationKey];
  if(userInfo)
  {
    NSMutableDictionary *labUserInfo = [userInfo mutableCopy];
    [labUserInfo setObject:@"PUSH" forKey:@"lab_notification_type"];
    userInfo = labUserInfo;
    [labLaunchOptions setObject:labUserInfo forKey:UIApplicationLaunchOptionsRemoteNotificationKey];
  }
  return labLaunchOptions;
}

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [self registerUserAgent];
  return YES;
}

- (void)registerUserAgent {
  NSString *appVersion = [[NSBundle mainBundle] infoDictionary][@"CFBundleShortVersionString"];
  NSString *originAgent = [[[UIWebView alloc] init] stringByEvaluatingJavaScriptFromString:@"navigator.userAgent"];
  NSString *newAgent = [originAgent stringByAppendingString:[NSString stringWithFormat:@" LABAPP/%@ LAB_DEV_IOS", appVersion]];
  [[NSUserDefaults standardUserDefaults] registerDefaults:@{@"UserAgent": newAgent}];
}

- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification
{
  if ([[NSDate new] timeIntervalSinceDate:notification.fireDate] < 1.0f) {
    // 距离生成本地通知1s 内
    
  } else {
    // 超过1s, 可以认为是点击
    if (notification.userInfo[IMFlag] != nil) {
      NSMutableDictionary *labUserInfo = [notification.userInfo mutableCopy];
      [labUserInfo setObject:@"IM" forKey:@"lab_notification_type"];
      [labUserInfo setObject:[NSNumber numberWithBool:YES] forKey:@"lab_is_notification_click"];
      NSString *targetImId = notification.userInfo[IMFlag];
      [labUserInfo setObject:targetImId forKey:@"targetImId"];
      notification.userInfo = labUserInfo;
      [RCTPushNotificationManager didReceiveLocalNotification:notification];
    }
    
  }
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(nonnull void (^)(UIBackgroundFetchResult))completionHandler {
  if ([UIApplication sharedApplication].applicationState == UIApplicationStateActive) {
    return;
  }
  
  if (userInfo[JPUSHFlag] != nil) {
    // 极光推送通知
    NSMutableDictionary *labUserInfo = [userInfo mutableCopy];
    [labUserInfo setObject:@"PUSH" forKey:@"lab_notification_type"];
    [RCTPushNotificationManager didReceiveRemoteNotification:labUserInfo];
    [self sendMsg:labUserInfo];
  }else if(userInfo[@"iBeaconFlag"] != nil) {
    //本地推送
    NSMutableDictionary *labUserInfo = [userInfo mutableCopy];
    [labUserInfo setObject:@"LOCAL" forKey:@"lab_notification_type"];
    [RCTPushNotificationManager didReceiveRemoteNotification:labUserInfo];
  }
}

// iOS 10 Support App在前台时收到远程或本地推送
- (void)jpushNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(NSInteger))completionHandler {
  // Required
  NSDictionary *userInfo = notification.request.content.userInfo;
  if([notification.request.trigger isKindOfClass:[UNPushNotificationTrigger class]]) {
    if (userInfo[JPUSHFlag] != nil) {
      // 极光推送通知
      NSMutableDictionary *labUserInfo = [userInfo mutableCopy];
      [labUserInfo setObject:@"PUSH" forKey:@"lab_notification_type"];
      [RCTPushNotificationManager didReceiveRemoteNotification:labUserInfo];
      [self sendMsg:labUserInfo];
      //      [[NSNotificationCenter defaultCenter] postNotificationName:kJPFDidReceiveRemoteNotification object:userInfo];
    }else if(userInfo[@"iBeaconFlag"] != nil) {
      //本地推送
      NSMutableDictionary *labUserInfo = [userInfo mutableCopy];
      [labUserInfo setObject:@"LOCAL" forKey:@"lab_notification_type"];
      [RCTPushNotificationManager didReceiveRemoteNotification:labUserInfo];
    }
  }
  completionHandler(UNNotificationPresentationOptionAlert); // 需要执行这个方法，选择是否提醒用户，有Badge、Sound、Alert三种类型可以选择设置
}

// iOS 10 Support App在后台时，通知被点击
- (void)jpushNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void (^)())completionHandler {
  // Required
  NSDictionary *userInfo = response.notification.request.content.userInfo;
  if([response.notification.request.trigger isKindOfClass:[UNPushNotificationTrigger class]]) {
    if (userInfo[JPUSHFlag] != nil) {
      // 极光推送通知
      NSMutableDictionary *labUserInfo = [userInfo mutableCopy];
      [labUserInfo setObject:@"PUSH" forKey:@"lab_notification_type"];
      [RCTPushNotificationManager didReceiveRemoteNotification:labUserInfo];
      [self sendMsg:labUserInfo];
      //      [[NSNotificationCenter defaultCenter] postNotificationName:kJPFDidReceiveRemoteNotification object:userInfo];
    }
  } else {
    if (userInfo[IMFlag] != nil) {
      // IM推送通知
      NSMutableDictionary *labUserInfo = [userInfo mutableCopy];
      [labUserInfo setObject:@"IM" forKey:@"lab_notification_type"];
      [labUserInfo setObject:[NSNumber numberWithBool:YES] forKey:@"lab_is_notification_click"];
      NSString *targetImId = userInfo[IMFlag];
      [labUserInfo setObject:targetImId forKey:@"targetImId"];
      [RCTPushNotificationManager didReceiveRemoteNotification:labUserInfo];
    }else if(userInfo[@"iBeaconFlag"] != nil) {
      //本地推送
      NSMutableDictionary *labUserInfo = [userInfo mutableCopy];
      [labUserInfo setObject:@"PUSH" forKey:@"lab_notification_type"];
      [RCTPushNotificationManager didReceiveRemoteNotification:labUserInfo];
    }
  }
  completionHandler();  // 系统要求执行这个方法
}

- (void)sendMsg:(NSDictionary *)userInfo {
  [[NSNotificationCenter defaultCenter] postNotificationName:kJPFDidReceiveRemoteNotification object:userInfo];
}

// 递归的查找字典里是否含有某个字段
- (BOOL) search:(NSDictionary *)dic string:(NSString *)str {
  if ([dic objectForKey:str]) {
    return YES;
  }
  for (id o in dic) {
    if ([dic[o] isKindOfClass:[NSDictionary class]]) {
      NSDictionary *d = [[NSDictionary alloc] initWithDictionary:dic[o]];
      BOOL get = [self search:d string:str];
      if (get) {
        return YES;
      }
    } else {
      continue;
    }
  }
  return NO;
}

@end

