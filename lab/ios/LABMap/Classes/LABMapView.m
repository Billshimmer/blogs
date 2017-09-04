//
//  LABMapView.m
//  lab4
//
//  Created by 周泽勇 on 2017/1/6.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "LABMapView.h"

@implementation LABMapView
- (instancetype) initWithFrame:(CGRect)frame {
  self = [super initWithFrame:frame];
  if (self) {
    [self setupLABMapView];
  }
  return self;
}

- (instancetype) initWithCoder:(NSCoder *)aDecoder {
  self = [super initWithCoder:aDecoder];
  if (self) {
    [self setupLABMapView];
  }
  return self;
}

- (instancetype) init {
  self = [super init];
  if (self) {
    [self setupLABMapView];
  }
  return self;
}

- (void) setupLABMapView {
  [self addSubview:self.prevPageButton];
  [self addSubview:self.nextPageButton];
  [self.prevPageButton mas_remakeConstraints:^(MASConstraintMaker *make) {
    make.right.equalTo(self).offset(-10);
    make.top.equalTo(self).offset(10);
  }];
  
  [self.nextPageButton mas_remakeConstraints:^(MASConstraintMaker *make) {
    make.top.equalTo(self.prevPageButton).offset(10);
    make.right.equalTo(self).offset(10);
  }];
}

- (UIButton*) prevPageButton {
  if (!_prevPageButton) {
    _prevPageButton = [[UIButton alloc] initWithFrame:CGRectZero];
    [_prevPageButton setTitle:@"上一页" forState:UIControlStateNormal];
    [_prevPageButton setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
  }
  return _prevPageButton;
}

- (UIButton*) nextPageButton {
  if (_nextPageButton) {
    _nextPageButton = [[UIButton alloc] initWithFrame:CGRectZero];
    [_nextPageButton setTitle:@"下一页" forState:UIControlStateNormal];
    [_nextPageButton setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
  }
  return _nextPageButton;
}

@end
