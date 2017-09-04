//
//  UMengBuild.m
//  lab4
//
//  Created by QuanThomas on 2016/11/8.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "UMengUShareHelper.h"
#import "UMengConfigObject.h"
#import "MJExtension.h"

@implementation UMengUShareHelper

+ (BOOL) UMengSocialCanOpenURL:(NSURL *)url {
  BOOL canHandleURL = [[UMSocialManager defaultManager] handleOpenURL:url];
  return canHandleURL;
}

+ (void)Build:(NSDictionary *)Options {
  UMengConfigObject *object = [UMengConfigObject mj_objectWithKeyValues:Options];
  if (object.UMeng) {
    [[UMSocialManager defaultManager] setUmSocialAppkey:object.UMeng.AppKey];
  } else {
    return;
  }
  
  if (object.QQ) {
    [[UMSocialManager defaultManager] setPlaform:UMSocialPlatformType_QQ appKey:object.QQ.AppKey appSecret:nil redirectURL:object.QQ.RedirectURL];
  }
  
  if (object.WeChat) {
    [[UMSocialManager defaultManager] setPlaform:UMSocialPlatformType_WechatSession appKey:object.WeChat.AppKey appSecret:object.WeChat.AppSecret redirectURL:object.WeChat.RedirectURL];
  }
  
  if (object.Sina) {
    [[UMSocialManager defaultManager] setPlaform:UMSocialPlatformType_Sina appKey:object.Sina.AppKey appSecret:object.Sina.AppSecret redirectURL:object.Sina.RedirectURL];
  }
  
  // 隐藏显示微信收藏
  [[UMSocialManager defaultManager] removePlatformProviderWithPlatformTypes:@[@(UMSocialPlatformType_WechatFavorite)]];
  
}

@end
