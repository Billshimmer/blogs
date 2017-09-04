//
//  LABLocationPickerDelegate.h
//  lab4
//
//  Created by QuanThomas on 2016/9/23.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <BaiduMapAPI_Base/BMKBaseComponent.h>//引入base相关所有的头文件
#import <BaiduMapAPI_Search/BMKSearchComponent.h>//引入检索功能所有的头文件

@protocol LABLocationPickerDelegate <NSObject>

- (void)onCancelPicked:(NSString *)locationMsg;

- (void)onDidPicked:(BMKPoiInfo *)poiInfo;

@end
