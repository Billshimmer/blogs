//
//  LABActivityIndicatorView.h
//  lab4
//
//  Created by 周泽勇 on 16/8/25.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface LABActivityIndicatorView : UIView

/**
 *  菊花的颜色
 */
@property (nonatomic, copy) UIColor *tintColor;

/**
 *  外部设置滑动距离
 */
@property (nonatomic, assign) CGFloat timeOffset;  // 0.0 ~ 1.0

/**
 *  开始动画加载
 */
- (void)startAnimating;

/**
 *  结束动画加载
 */
- (void)stopAnimating;
@end
