//
//  LABLaunchAd.h
//  lab4
//
//  Created by QuanThomas on 16/9/12.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "UIImageView+WebCache.h"

@class LABLaunchAd;
typedef void (^LaunchAdClickBlock)();
typedef void (^SetLaunchAdBlock)(LABLaunchAd *launchAd);

typedef NS_ENUM(NSUInteger, SkipShowType)
{
  SkipShowTypeNone = 0,       /** 无跳过 */
  SkipShowTypeDefault,        /** 跳过+倒计时*/
  SkipShowTypeAnimation,      /** 动画跳过 ⭕️ */
};

@interface LABLaunchAd : UIView


/**
 *  广告图
 */
@property(nonatomic, strong) UIImageView *launchAdImgView;

/**
 *  广告frame
 */
@property (nonatomic, assign) CGRect launchAdViewFrame;

/**
 *  清理缓冲
 */
+ (void)clearDiskCache;

/**
 *  初始化启动页广告
 *
 *  @param adDuration  停留时间
 *  @param hideSkip    是否隐藏跳过
 *  @param setLaunchAd launchAdView
 *
 *  @return self
 */
+ (instancetype)initImageWithAttribute:(NSInteger)adDuration showSkipType:(SkipShowType)showSkipType setLaunchAd:(SetLaunchAdBlock)setLaunchAd;

/**
 *  设置远程图片
 *
 *  @param strURL       URL
 *  @param options      图片缓冲模式
 *  @param result       UIImage *image, NSURL *url
 *  @param adClickBlock 点击图片回调
 */
- (void)setWebImageWithURL:(NSString *)strURL options:(WebImageOptions)options result:(WebImageCompletionBlock)result adClickBlock:(LaunchAdClickBlock)adClickBlock;

/**
 *  设置本地图片
 */
- (void)setLocalImage;

/**
 *  设置动画跳过属性
 *
 *  @param strokeColor     转动颜色
 *  @param lineWidth       宽度
 *  @param backgroundColor 背景色
 *  @param textColor       字体颜色
 */
- (void)setAnimationSkipWithAttribute:(UIColor *)strokeColor lineWidth:(NSInteger)lineWidth backgroundColor:(UIColor *)backgroundColor textColor:(UIColor *)textColor;

@end
