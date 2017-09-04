//
//  LABSideIndexViewManager.m
//  lab4
//
//  Created by Thomas Quan on 2017/1/16.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import <React/RCTBridgeModule.h>
#import <React/RCTBridge.h>
#import <React/RCTConvert.h>
#import <React/UIView+React.h>
#import "LABSideIndexViewManager.h"
#import "LABSideIndexView.h"

@implementation LABSideIndexViewManager

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE();

RCT_EXPORT_VIEW_PROPERTY(onLetterChange, RCTBubblingEventBlock)

RCT_CUSTOM_VIEW_PROPERTY(options, NSDictionary, LABSideIndexView)
{
  view.options = [RCTConvert NSDictionary:json];
}

- (UIView *)view
{
  return [LABSideIndexView new];
}


@end
