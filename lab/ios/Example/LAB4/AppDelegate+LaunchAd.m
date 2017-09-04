//
//  AppDelegate+LaunchAd.m
//  lab4
//
//  Created by QuanThomas on 16/9/13.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "AppDelegate+LaunchAd.h"
#import "AFNetworking.h"
#import "LABLaunchAd.h"

NSString *REQURL = @"REQURL";
NSString *IMGURL = @"IMGURL"; // 图片地址
NSString *CLKURL = @"CLKURL"; // 点击跳转地址
NSString *ISNEXT = @"ISNEXT"; // 下一次是否展示
NSString *ISFS = @"ISFS";     // 是否全屏显示
NSString *Launch = @"Launch"; // 首次启动标识符

@implementation AppDelegate (LaunchAd)

- (void)postRequest:(NSString *)urlStr
               body:(NSDictionary *)body
            success:(void (^)(id responseObject))success
            failure:(void (^)(NSError *error))failure
{
  AFHTTPSessionManager *mgr = [AFHTTPSessionManager new];
  
  mgr.requestSerializer = [AFJSONRequestSerializer serializer];
  mgr.responseSerializer = [AFJSONResponseSerializer serializer];
  
  [mgr POST:urlStr parameters:body progress:^(NSProgress * _Nonnull uploadProgress) {
    
  } success:^(NSURLSessionDataTask * _Nonnull task, id  _Nullable responseObject) {
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
      success(responseObject);
    });
  } failure:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
    failure(error);
  }];
}

- (BOOL)isFirstLaunch {
  NSUserDefaults *userDefault = [NSUserDefaults standardUserDefaults];
  BOOL isLaunch = [userDefault objectForKey:Launch] == nil ? YES : NO;
  if (isLaunch) {
    [userDefault setObject:Launch forKey:Launch];
    [userDefault synchronize];
  }
  return isLaunch ;
}

- (void)resetFirstLaunch {
  [[NSUserDefaults standardUserDefaults] setObject:nil forKey:Launch];
  [[NSUserDefaults standardUserDefaults] synchronize];
}

- (void)launchLocalImage {
  [LABLaunchAd initImageWithAttribute:3.0 showSkipType:SkipShowTypeNone setLaunchAd:^(LABLaunchAd *launchAd) {
    [launchAd setLocalImage];
  }];
}

- (void)requestAdInfo {

  // 设置启动页广告图片的URL
  //  NSString *imgUrlString = @"http://c.hiphotos.baidu.com/image/pic/item/d62a6059252dd42a6a943c180b3b5bb5c8eab8e7.jpg";
  
  //1、请求服务器，获得最新的广告图的URL
  void (^success)(id) = ^(id  _Nullable responseObject) {
    NSMutableDictionary *options = [responseObject mutableCopy];
    NSUserDefaults *userDefault = [NSUserDefaults standardUserDefaults];
    if (!options) {
      [self resetFirstLaunch];
      return ;
    }
    [userDefault setObject:options[IMGURL] forKey:IMGURL];
    [userDefault setObject:options[CLKURL] forKey:CLKURL];
    [userDefault setObject:options[ISNEXT] forKey:ISNEXT];
    [userDefault setObject:options[ISFS] forKey:ISFS];
    [userDefault synchronize];
  };
  
  void (^failure)(NSError *) = ^(NSError * _Nonnull error) {
    [self resetFirstLaunch];
  };
  
//  NSString *requestURL = [[[NSUserDefaults standardUserDefaults] objectForKey:REQURL] string];
  
//  [self postRequest:requestURL body:nil success:success failure:failure];
  
}


- (void)launchRemoteImage {
  
  NSString *imgUrlString =@"http://imgstore.cdn.sogou.com/app/a/100540002/714860.jpg";
  NSString *clickUrlString = @"http://www.baidu.com";
  
  NSUInteger showType = SkipShowTypeAnimation;
  
  NSUserDefaults *userDefault = [NSUserDefaults standardUserDefaults];
  NSString *imageUrl = [userDefault objectForKey:IMGURL];
  NSString *clickUrl = [userDefault objectForKey:CLKURL];
  BOOL isFullScreen = [[userDefault objectForKey:ISFS] boolValue];
  
  
  [LABLaunchAd initImageWithAttribute:5.0 showSkipType:showType setLaunchAd:^(LABLaunchAd *launchAd) {
    __block LABLaunchAd *weakSelf = launchAd;
    // 如果选择 SkipShowTypeAnimation 需要设置动画跳过按钮的属性
    if (showType == SkipShowTypeAnimation) {
      [weakSelf setAnimationSkipWithAttribute:[UIColor brownColor]
                                    lineWidth:3.0
                              backgroundColor:nil
                                    textColor:nil];
    }
    
    [launchAd setWebImageWithURL:imgUrlString options:WebImageDefault result:^(UIImage *image, NSURL *url) {

      // 设置Frame大小
      CGFloat kScreen_Width = [UIScreen mainScreen].bounds.size.width;
      CGFloat kScreen_Height = [UIScreen mainScreen].bounds.size.height;
      if (!isFullScreen) {
        kScreen_Height -= 150;
      }
      //  异步缓冲图片完成后调整图片Frame
      weakSelf.launchAdViewFrame = CGRectMake(0, 0, kScreen_Width, kScreen_Height);

    } adClickBlock:^{
      
      [[UIApplication sharedApplication] openURL:[NSURL URLWithString:clickUrlString]];

    }];
  }];
}

- (void)launchAdImage {
  
  BOOL isShow = YES;
  NSUserDefaults *userDefault = [NSUserDefaults standardUserDefaults];
  if ([userDefault objectForKey:ISNEXT]) {
    isShow = [[userDefault objectForKey:ISNEXT] boolValue];
  }
  
  // 判断是否为第一次启动
  if ([self isFirstLaunch]) {
    // 如果是第一次启动,则先加载launchImage
    [self launchLocalImage];
    [self requestAdInfo]; // 获取失败则下次启动仍算作首次启动
  } else {
    if (isShow) {
      // 如果非第一次启动，则先加载本地缓存的图，再从服务器请求下来新图
      [self launchRemoteImage];
    } else {
      [self launchLocalImage];
    }
    [self requestAdInfo];
  }
  
}

@end
