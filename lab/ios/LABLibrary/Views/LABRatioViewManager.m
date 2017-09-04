//
//  RCTRatioViewManager.m
//  RatioView
//
//  Created by yinhf on 16/9/11.
//
//

#import "LABRatioViewManager.h"
#import <React/RCTBridge.h>
#import "LABShadowRatioView.h"

@implementation LABRatioViewManager

RCT_EXPORT_MODULE()

- (LABShadowRatioView *)shadowView
{
    return [LABShadowRatioView new];
}

RCT_EXPORT_SHADOW_PROPERTY(whRatio, CGFloat)

@end
