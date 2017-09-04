//
//  AppConfig.m
//  lab4
//
//  Created by QuanThomas on 2016/11/18.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "AppConfig.h"
#import "MJExtension.h"

@implementation Config

@end

@implementation AppConfig

+ (instancetype)getInstance {
  static AppConfig *appconfig = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    appconfig = [[AppConfig alloc] init];
  });
  return appconfig;
}

- (instancetype)init
{
  self = [super init];
  if (self) {
    self.config = [self getConfig];
  }
  return self;
}

- (Config *)getConfig {
  //  NSString *path = [mainbundle pathForResource:@"config.ios" ofType:@"json"];
  NSString *path = [[[NSBundle mainBundle] resourcePath] stringByAppendingPathComponent:@"config.ios.json"];
  if (path == nil) {
    return nil;
  }
  NSString *jsonString  = [NSString stringWithContentsOfFile:path encoding:NSUTF8StringEncoding error:nil];
  if (jsonString == nil) {
    return nil;
  }
  NSData *jsonData   = [[NSData alloc] initWithData:[jsonString dataUsingEncoding:NSUTF8StringEncoding]];
  if (jsonData == nil) {
    return nil;
  }
  NSDictionary *dic = [NSJSONSerialization JSONObjectWithData:jsonData options:(NSJSONReadingMutableContainers) error:nil];
  if (dic == nil) {
    return nil;
  }
  Config *config = [Config mj_objectWithKeyValues:dic];
  return config;
}

- (NSDictionary *)getExtra {
  return self.config.extra;
}

- (NSString*) getUUID {
  return self.config.extra[@"uuid"];
}

- (NSString*) getIdentifier {
  return self.config.extra[@"identifier"];
}

- (NSString *)getBaseURL {
  return self.config.baseUrl;
}

- (NSString *)getUMENG_appkey {
  return self.config.extra[UMENG][appkey];
}

- (NSString *)getQQ_appkey {
  return self.config.extra[QQ][appkey];
}

- (NSString *)getQQ_appscret{
  return self.config.extra[QQ][appsecret];
}

- (NSString *)getQQ_url {
  return self.config.extra[QQ][url];
}

- (NSString *)getWEIXIN_appkey {
  return self.config.extra[WEIXIN][appkey];
}

- (NSString *)getWEIXIN_appscret {
  return self.config.extra[WEIXIN][appsecret];
}

- (NSString *)getWEIXIN_url {
  return self.config.extra[WEIXIN][url];
}

- (NSString *)getWEIBO_appkey {
  return self.config.extra[WEIBO][appkey];
}

- (NSString *)getWEIBO_appscret {
  return self.config.extra[WEIBO][appsecret];
}

- (NSString *)getWEIBO_url {
  return self.config.extra[WEIBO][url];
}

- (NSString *)getBUGLY_appkey {
  return self.config.extra[BUGLY][appkey];
}

- (NSString *)getIM_appkey {
  return self.config.extra[IM][appkey];
}

- (NSString *)getIM_apnsname {
  return self.config.extra[IM][apnsname];
}

- (NSString *)getPUSH_appkey {
  return self.config.extra[PUSH][appkey];
}

- (NSString *)getMAP_appkey {
  return self.config.extra[MAP][appkey];
}


@end

