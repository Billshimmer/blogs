//
//  LABPhotoBrowserManager.m
//  lab4
//
//  Created by Thomas Quan on 2016/12/27.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "LABPhotoBrowserManager.h"
#import <React/RCTBridgeModule.h>
#import "LABPhotoBrowser.h"
#import <React/RCTBridge.h>
#import <React/RCTConvert.h>
#import <React/UIView+React.h>

@implementation LABPhotoBrowserManager

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE();

RCT_EXPORT_VIEW_PROPERTY(onPhotoTap, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onPhotoSelected, RCTBubblingEventBlock)

RCT_CUSTOM_VIEW_PROPERTY(options, NSDictionary, LABPhotoBrowser)
{
  view.options = [RCTConvert NSDictionary:json];
}

- (UIView *)view
{
  return [LABPhotoBrowser new];
}

@end
