//
//  LABMapManager.m
//  lab4
//
//  Created by QuanThomas on 2016/9/22.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "LABMapManager.h"
#import <BaiduMapAPI_Base/BMKBaseComponent.h>

@implementation LABMapManager

+ (BOOL)startMapWithKey:(NSString *)key {
  BMKMapManager *mapManager = [[BMKMapManager alloc] init];
  BOOL ret = [mapManager start:key generalDelegate:nil];
  if (!ret) {
    return NO;
  }
  return YES;
}

@end
