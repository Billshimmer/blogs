/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "LABRefreshControl.h"
#import <React/RCTUtils.h>
#import "LABActivityIndicatorView.h"


@interface LABRefreshControl ()
@property(nonatomic, retain) UILabel* titleLabel;
@property(nonatomic, retain) LABActivityIndicatorView* indicatorView;
@end

const CGFloat IndicatorViewWidth = 12;
const CGFloat IndicatorIntersect = 8;

@implementation LABRefreshControl
#pragma Life Cycle
- (instancetype)init {
  if(self = [super init]) {
    [self setRefreshingTarget:self refreshingAction:@selector(onRefreshing)];
  }
  return self;
}

- (void) prepare {
  [super prepare];
  [self addSubview:self.titleLabel];
  [self addSubview:self.indicatorView];
}


- (void) placeSubviews {
  [super placeSubviews];
  CGSize textSize = [self.titleLabel textRectForBounds:CGRectMake(0, 0, MAXFLOAT, MAXFLOAT) limitedToNumberOfLines:1].size;
  textSize.width = textSize.width + 15;
  CGFloat originX = (CGRectGetWidth(self.frame) - IndicatorViewWidth )/2;
  self.indicatorView.frame = CGRectMake(originX, IndicatorIntersect, IndicatorViewWidth, IndicatorViewWidth);
  self.titleLabel.frame = CGRectMake(0, IndicatorViewWidth + IndicatorIntersect, CGRectGetWidth(self.frame), self.mj_h - IndicatorViewWidth - IndicatorIntersect);
}

RCT_NOT_IMPLEMENTED(- (instancetype)initWithCoder:(NSCoder *)aDecoder)

#pragma mark - Event Response
- (void) onRefreshing {
  if(self.onRefresh) {
    self.onRefresh(nil);
  }
}

#pragma mark - Getter&Setter
- (NSString *)title {
  return self.titleLabel.text;
}

- (BOOL) refreshing {
  return self.state == MJRefreshStateRefreshing;
}

- (void) setRefreshing:(BOOL)refreshing {
  if (refreshing) {
    [self beginRefreshing];
  }else {
    [self endRefreshing];
  }
}

- (void) setPullingPercent:(CGFloat)pullingPercent {
  [super setPullingPercent:pullingPercent];
  self.indicatorView.timeOffset = pullingPercent;
}

- (void)setTitle:(NSString *)title {
  self.titleLabel.text = title;
}

- (void)setTitleColor:(UIColor *)color {
  self.titleLabel.textColor = color;
}

- (UILabel*) titleLabel {
  if (!_titleLabel) {
    _titleLabel = [[UILabel alloc] initWithFrame:CGRectZero];
    _titleLabel.font = [UIFont systemFontOfSize:12];
    _titleLabel.textColor = self.titleColor;
    _titleLabel.textAlignment = NSTextAlignmentCenter;
  }
  return _titleLabel;
}

- (void) setFrame:(CGRect)frame {
  frame.size.height = MJRefreshHeaderHeight;
  frame.size.width = self.superview.frame.size.width;
  [super setFrame:frame];
}

- (LABActivityIndicatorView*) indicatorView {
  if (!_indicatorView) {
    _indicatorView = [[LABActivityIndicatorView alloc] initWithFrame:CGRectZero];
    _indicatorView.tintColor = self.tintColor;
  }
  return _indicatorView;
}

- (void) setTintColor:(UIColor *)tintColor {
  [super setTintColor:tintColor];
  _indicatorView.tintColor = tintColor;
}

- (void) setState:(MJRefreshState)state {
  [super setState:state];
  switch (state) {
    case MJRefreshStateIdle:{
      self.titleLabel.text = @"下拉即可刷新";
      [self.indicatorView stopAnimating];
      break;
    }
    case MJRefreshStatePulling:{
      self.titleLabel.text = @"松开即可刷新";
      [self.indicatorView stopAnimating];
      break;
    }
    case MJRefreshStateRefreshing:{
      self.titleLabel.text = @"正在刷新，请稍等...";
      [self.indicatorView startAnimating];
      break;
    }
    default:
      break;
  }
}

@end
