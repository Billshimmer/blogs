//
//  LABLocationUploadModule.h
//  lab4
//
//  Created by Thomas Quan on 2017/4/12.
//  Copyright © 2017年 Facebook. All rights reserved.
//

/*
 
 设置NSLocationAlwaysUsageDescription
 Background Mode 使用Location
 添加CoreLocation， SystemConfiguration
 
 */
#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import <CoreLocation/CoreLocation.h>
#import <React/RCTBridgeModule.h>
#import <BaiduMapAPI_Base/BMKBaseComponent.h>//引入base相关所有的头文件
#import <BaiduMapAPI_Search/BMKSearchComponent.h>//引入检索功能所有的头文件
#import <BaiduMapAPI_Location/BMKLocationComponent.h>
#import <CoreLocation/CoreLocation.h>


@interface LABLocationUploadModule : CLLocationManager <CLLocationManagerDelegate, RCTBridgeModule, BMKGeoCodeSearchDelegate>

+ (instancetype)sharedInstance;

- (void)uploadLocation;

@end
