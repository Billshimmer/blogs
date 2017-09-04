//
//  NEWLABSocialModule.m
//  lab4
//
//  Created by QuanThomas on 2016/11/3.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "LABSocialModule.h"

@implementation LABSocialModule

RCT_EXPORT_MODULE();

@synthesize bridge = _bridge;

/* 前端传来的格式串
 {
 "platform": [ // 平台信息
 "qq",
 "wb",
 "wx"
 ],
 }
 */

# pragma ThirdParty Login
RCT_EXPORT_METHOD(login:(NSDictionary *)options
                  callback:(RCTResponseSenderBlock)callback)
{
  LoginObject *loginObject = [LoginObject mj_objectWithKeyValues:options];
  NSString *platform = loginObject.platform;
  UMSocialPlatformType type;
  if ([platform isEqualToString:@"qq"]) {
    type = UMSocialPlatformType_QQ;
  } else if ([platform isEqualToString:@"wx"]) {
    type = UMSocialPlatformType_WechatSession;
  } else if ([platform isEqualToString:@"wb"]) {
    type = UMSocialPlatformType_Sina;
  }
  
  UIViewController *viewController = RCTPresentedViewController();
  
  [[UMSocialManager defaultManager] getUserInfoWithPlatform:type currentViewController:nil completion:^(id result, NSError *error) {
    
    UMSocialUserInfoResponse *resp = result;
    
    // 第三方登录数据(为空表示平台未提供)
    // 授权数据
    NSLog(@" uid: %@", resp.uid);
    NSLog(@" openid: %@", resp.openid);
    NSLog(@" accessToken: %@", resp.accessToken);
    NSLog(@" refreshToken: %@", resp.refreshToken);
    NSLog(@" expiration: %@", resp.expiration);
    
    // 用户数据
    NSLog(@" name: %@", resp.name);
    NSLog(@" iconurl: %@", resp.iconurl);
    NSLog(@" gender: %@", resp.gender);
    
    // 第三方平台SDK原始数据
    NSLog(@" originalResponse: %@", resp.originalResponse);
  }];
}

# pragma ThirdParty Share

/*
 {
 "platforms": [ // 平台信息
 "qq",
 "sina",
 "qzone",
 "wb",
 "wx_fav",
 "wx_circle",
 "sms",
 ],
 "platform": "qq"
 "informations": {
 "url":"url",//通用的Url链接
 "content":"content"//通用，内容
 "title": "title", //通用,标题
 "imageUrl":"xxx", //网址链接
 }
 }
 */

- (void)shareDataWithPlatform:(ShareObject *)shareObject platformType:(UMSocialPlatformType)platformType callback:(RCTResponseSenderBlock)callback {
  
  //创建分享消息对象
  UMSocialMessageObject *messageObject = [UMSocialMessageObject messageObject];
  
  //创建网页内容对象
  UMShareWebpageObject *webpageObject = [UMShareWebpageObject shareObjectWithTitle:shareObject.informations.title descr:shareObject.informations.content thumImage:shareObject.informations.imageUrl];
  webpageObject.webpageUrl = shareObject.informations.url;
  
  messageObject.shareObject = webpageObject;
  
  UIViewController *viewController = RCTPresentedViewController();
  
  //调用分享接口
  [[UMSocialManager defaultManager] shareToPlatform:platformType messageObject:messageObject currentViewController:viewController completion:^(id data, NSError *error) {
    if (error) {
      if (error.code == 2009) {
        callback(@[@{@"code": @"cancel", @"message": @"Operation is cancel"}]);
      } else {
        callback(@[@{@"code": @"error", @"message": @"share error"}]);
      }
    } else {
      callback(@[[NSNull null], @{}]);
    }
  }];
  
}

RCT_EXPORT_METHOD(share:(NSDictionary *)options
                  callback:(RCTResponseSenderBlock)callback) {
  ShareObject *shareObject = [ShareObject mj_objectWithKeyValues:options];
  
  __weak typeof(self) weakSelf = self;
  
  if (shareObject.platform != nil) {
    NSString *platform = shareObject.platform;
    UMSocialPlatformType type;
    if ([platform isEqualToString:@"qq"]) {
      type = UMSocialPlatformType_QQ;
    } else if ([platform isEqualToString:@"wx"]) {
      type = UMSocialPlatformType_WechatSession;
    } else if ([platform isEqualToString:@"wb"]) {
      type = UMSocialPlatformType_Sina;
    } else {
      callback(@[@{@"code": @"error", @"message": @"分享的平台不存在"}]);
      return;
    }
    
    [weakSelf shareDataWithPlatform:shareObject platformType:type callback:callback];
  } else {
    [UMSocialShareUIConfig shareInstance].sharePageGroupViewConfig.sharePageGroupViewPostionType = UMSocialSharePageGroupViewPositionType_Bottom;
    [UMSocialShareUIConfig shareInstance].sharePageScrollViewConfig.shareScrollViewPageItemStyleType = UMSocialPlatformItemViewBackgroudType_IconAndBGRadius;
    [UMSocialUIManager showShareMenuViewInWindowWithPlatformSelectionBlock:^(UMSocialPlatformType platformType, NSDictionary *userInfo) {
      NSDictionary *dic = @{@"code": @"LAB_SOCIAL_CLICKED"};
      [_bridge.eventDispatcher sendAppEventWithName:@"LAB_SOCIAL_CLICKED" body:dic];
      [weakSelf shareDataWithPlatform:shareObject platformType:platformType callback:callback];
    }];
  }
  
  
}

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

@end
