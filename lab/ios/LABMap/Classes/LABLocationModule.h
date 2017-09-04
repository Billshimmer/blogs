//
//  LABLocationModule.h
//  lab4
//
//  Created by QuanThomas on 16/7/19.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <BaiduMapAPI_Base/BMKBaseComponent.h>//引入base相关所有的头文件
#import <BaiduMapAPI_Search/BMKSearchComponent.h>//引入检索功能所有的头文件
#import "CoreLocation/CoreLocation.h"
#import <React/RCTBridgeModule.h>


@interface LABLocationModule : NSObject <RCTBridgeModule, BMKGeoCodeSearchDelegate>
@property (nonatomic, weak) RCTBridge *bridge;
@end
