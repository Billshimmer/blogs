//
//  AppConfig.h
//  lab4
//
//  Created by QuanThomas on 2016/11/18.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface Config : NSObject

@property (nonatomic, copy) NSString *baseUrl;
@property (nonatomic, copy) NSString *version;
@property (nonatomic, strong) NSDictionary *extra;
@property (nonatomic, assign) NSUInteger versionCode;

@end

static NSString *QQ        = @"QQ";
static NSString *WEIXIN    = @"WEIXIN";
static NSString *WEIBO     = @"WEIBO";
static NSString *UMENG     = @"UMENG";
static NSString *BUGLY     = @"BUGLY";
static NSString *IM        = @"IM";
static NSString *PUSH      = @"PUSH";
static NSString *MAP       = @"MAP";
static NSString *appkey    = @"appkey";
static NSString *appsecret = @"appsecret";
static NSString *url       = @"url";
static NSString *apnsname  = @"apnsname";

@interface AppConfig : NSObject

@property (nonatomic, strong) Config *config;

+ (instancetype)getInstance;

- (Config *)getConfig;

- (NSDictionary *)getExtra;

- (NSString*) getUUID;

- (NSString*) getIdentifier;


/**
 获取baseurl
 */
- (NSString *)getBaseURL;

/**
 获取友盟AppKey
 */
- (NSString *)getUMENG_appkey;

/**
 获取QQ的AppKey
 */
- (NSString *)getQQ_appkey;

/**
 获取QQ的AppScret
 */
- (NSString *)getQQ_appscret;

/**
 获取QQ的URL
 */
- (NSString *)getQQ_url;

/**
 获取微信的AppKey
 */
- (NSString *)getWEIXIN_appkey;

/**
 获取微信的AppScret
 */
- (NSString *)getWEIXIN_appscret;

/**
 获取微信的URL
 */
- (NSString *)getWEIXIN_url;

/**
 获取微博的AppKey
 */
- (NSString *)getWEIBO_appkey;

/**
 获取微博的AppScret
 */
- (NSString *)getWEIBO_appscret;

/**
 获取微博的URL
 */
- (NSString *)getWEIBO_url;

/**
 获取Bugly的AppKey
 */
- (NSString *)getBUGLY_appkey;

/**
 获取环信IM的AppKey
 */
- (NSString *)getIM_appkey;

/**
 获取环信的推送APNS的p12文件名
 */
- (NSString *)getIM_apnsname;

/**
 获取极光推送的AppKey
 */
- (NSString *)getPUSH_appkey;

/**
 获取百度地图的AppKey
 */
- (NSString *)getMAP_appkey;

@end

/*
 * sample of config.ios.json
 
 {
 "baseUrl": "http://huitu.hz.backustech.com:81",
 "extra": {
 "qiniu": {
 "tokenUrl": "/Content/Index/getQiniuToken?LAB_JSON=1&LAB_NOTRANS=1"
 },
 "rootUrl": "/Content/Index/index",
 "UMENG": {
 "appkey": "xxxx"
 },
 "QQ": {
 "appkey": "xxx",
 "appscret": "xxx",
 "url": "xxx"
 },
 "WX": {
 "appkey": "xxxx",
 "appscret": "xxx",
 "url": "xxx"
 },
 "WB": {
 "appkey": "xxxx",
 "appscret": "xxx",
 "url": "xxx"
 },
 "BUGLY": {
 "appkey": "xxxx"
 },
 "IM": {
 "appkey": "35248620-0#huitu",
 "apnsname": "huitu_backus_prod"
 },
 "PUSH": {
 "appkey": "55bb0cb5babd23d28df52523"
 },
 "MAP": {
 "appkey": "xxx"
 }
 },
 "version": "1.0.0",
 "versionCode": 10000000
 }
 
 
 */

