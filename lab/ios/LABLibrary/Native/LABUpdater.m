//
//  LABUpdater.m
//  lab4
//
//  Created by QuanThomas on 16/9/21.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "LABUpdater.h"
#import "AFNetworking.h"
#import <React/RCTUtils.h>
#import "LABAlertController.h"

@implementation LABUpdater

//请求返回格式
//{
//  binary =     {
//    fsize = 23767110;
//  };
//  build = 2;
//  changelog = "";
//  "direct_install_url" = "http://download.fir.im/v2/app/install/57df41cbca87a87f91000198?download_token=385800cebf332ec782ca5dd4874d4be5";
//  installUrl = "http://download.fir.im/v2/app/install/57df41cbca87a87f91000198?download_token=385800cebf332ec782ca5dd4874d4be5";
//  "install_url" = "http://download.fir.im/v2/app/install/57df41cbca87a87f91000198?download_token=385800cebf332ec782ca5dd4874d4be5";
//  name = "e途";
//  "update_url" = "http://fir.im/pw78";
//  "updated_at" = 1474259340;
//  version = 2;
//  versionShort = "1.01";
//}
- (void)checkVersionInfoFromFIR:(NSString *)appID APIToken:(NSString *)token {
  NSString *urlString = [NSString stringWithFormat:@"http://api.fir.im/apps/latest/%@?api_token=%@", appID, token];
  void (^success)(id) = ^(id  _Nullable responseObject) {
    NSLog(@"responseObject is %@", responseObject);
    if (![responseObject isKindOfClass:[NSDictionary class]]) {
      return ;
    }
    
    //对比版本
    int version = [responseObject[@"version"] intValue]; //对应 CFBundleVersion, 对应Xcode项目配置"General"中的 Build
    NSString *versionShort = responseObject[@"versionShort"]; //对应 CFBundleShortVersionString, 对应Xcode项目配置"General"中的 Version
    
    int localVersion = [[[NSBundle mainBundle] infoDictionary][@"CFBundleVersion"] intValue];
    NSString *localVersionShort = [[NSBundle mainBundle] infoDictionary][@"CFBundleShortVersionString"];
    
    if (version <= localVersion) {
      return ;
    }
    
    _updateUrl = responseObject[@"update_url"]; //如果有更新 需要用Safari打开的地址
    NSString *changelog = responseObject[@"changelog"];
    
    NSString *appName = responseObject[@"name"];
    NSString *title = [NSString stringWithFormat:@"%@有更新啦！", appName];
    
    if (![localVersionShort isEqualToString:versionShort]) {
      changelog = [changelog stringByAppendingString:@"\n老版本已经无法使用"];
    }
    
    NSString *goUpdateString = @"去更新";
    NSString *cancelString = @"下次再说";
    
    UIAlertController *alertController = [UIAlertController alertControllerWithTitle:title message:changelog preferredStyle:UIAlertControllerStyleAlert];
    UIAlertAction *goUpdate = [UIAlertAction actionWithTitle:goUpdateString style:1 handler:^(UIAlertAction * _Nonnull action) {
      [[UIApplication sharedApplication] openURL:[NSURL URLWithString:_updateUrl]];
    }];
    
    UIAlertAction *cancel = [UIAlertAction actionWithTitle:cancelString style:0 handler:nil];
    
    [alertController addAction:goUpdate];
    if ([localVersionShort isEqualToString:versionShort]) {
      [alertController addAction:cancel];
    }
    
    [RCTPresentedViewController() presentViewController:alertController animated:YES completion:nil];
    
  };
  
  void (^failure)(NSError *) = ^(NSError * _Nonnull error) {
    NSLog(@"get version info fail");
  };
  
  [self getRequest:urlString body:nil success:success failure:failure];
  
}

- (void)checkVersionInfoFromAppStore:(NSString *)appleID {
  NSString *urlString = [NSString stringWithFormat:@"http://itunes.apple.com/lookup?id=%@", appleID];
  void (^success)(id) = ^(id  _Nullable responseObject) {
    NSLog(@"responseObject is %@", responseObject);
    if (![responseObject isKindOfClass:[NSDictionary class]]) {
      return ;
    }
    
    if (responseObject[@"resultCount"] == nil)  return;
    int count = [responseObject[@"resultCount"] intValue];
    if (count < 1) return;
    NSArray *array = [responseObject[@"results"] array];
    NSDictionary *info = [array firstObject];
    NSString *version = info[@"version"];
    
    NSString *localVersionShort = [[NSBundle mainBundle] infoDictionary][@"CFBundleShortVersionString"];

    if (![self compareVersion:version localVersion:localVersionShort]) {
      return;
    }
    
    if ([version isEqualToString:localVersionShort]) return;

    _updateUrl = [NSString stringWithFormat:@"http://itunes.apple.com/cn/app/id%@", appleID];
    NSString *changelog = responseObject[@"changelog"];
    
    NSString *appName = responseObject[@"name"];
    NSString *title = [NSString stringWithFormat:@"%@有更新啦！", appName];
 
    NSString *goUpdateString = @"去更新";
    NSString *cancelString = @"下次再说";
    
    UIAlertController *alertController = [UIAlertController alertControllerWithTitle:title message:changelog preferredStyle:UIAlertControllerStyleAlert];
    UIAlertAction *goUpdate = [UIAlertAction actionWithTitle:goUpdateString style:1 handler:^(UIAlertAction * _Nonnull action) {
      [[UIApplication sharedApplication] openURL:[NSURL URLWithString:_updateUrl]];
    }];
    
    UIAlertAction *cancel = [UIAlertAction actionWithTitle:cancelString style:0 handler:nil];
    
    [alertController addAction:goUpdate];
    [alertController addAction:cancel];
    
    [RCTPresentedViewController() presentViewController:alertController animated:YES completion:nil];
  };
  
  void (^failure)(NSError *) = ^(NSError * _Nonnull error) {
    NSLog(@"get version info fail");
  };
  
  [self getRequest:urlString body:nil success:success failure:failure];
}


/**
 判定本地版本号与线上版本号的大小  

 @param version 线上的版本号
 @param locver  本地的版本号

 @return 如果有新版本，返回YES，否则返回NO
 */
- (BOOL)compareVersion:(NSString *)version localVersion:(NSString *)locver {
  BOOL flag = NO;
  
  NSArray *newverArr = [version componentsSeparatedByString:@"."];
  NSArray *locverArr = [locver componentsSeparatedByString:@"."];
  NSInteger length = newverArr.count > locverArr.count ? newverArr.count : locverArr.count;
  // 本地比线上的版本要新 （1.0.1 vs 1.0）
  if (locverArr.count > newverArr.count) {
    return NO;
  }
  // 本地比线上的版本号老 (1.0 vs 1.0.1)
  if (locverArr.count < newverArr.count) {
    return YES;
  }
  
  for (NSInteger index=0; index<length; index++) {
    NSInteger new = [newverArr[index] integerValue];
    NSInteger loc = [locverArr[index] integerValue];
    
    if (new == loc) {
      continue;
    } else if (loc > new) {
      flag = NO;
      break;
    } else {
      flag = YES;
      break;
    }
  }
  
  return flag;
}

- (void)getRequest:(NSString *)urlStr
              body:(NSDictionary *)body
           success:(void (^)(id responseObject))success
           failure:(void (^)(NSError *error))failure
{
  AFHTTPSessionManager *mgr = [AFHTTPSessionManager new];
  
  mgr.requestSerializer = [AFJSONRequestSerializer serializer];
  mgr.responseSerializer = [AFJSONResponseSerializer serializer];
  
  [mgr GET:urlStr parameters:body progress:^(NSProgress * _Nonnull downloadProgress) {
    
  } success:^(NSURLSessionDataTask * _Nonnull task, id  _Nullable responseObject) {
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
      success(responseObject);
    });
  } failure:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
    failure(error);
  }];
}

@end

