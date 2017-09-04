//
//  TitleAnnotationView.m
//  lab4
//
//  Created by 周泽勇 on 2016/12/28.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "TitleAnnotationView.h"
#import "Masonry.h"

@implementation TitleAnnotationView
- (instancetype) initWithFrame:(CGRect)frame {
  self = [super initWithFrame:frame];
  if (self) {
    [self setupTitleAnnotationView];
  }
  return self;
}

- (instancetype) initWithAnnotation:(id<BMKAnnotation>)annotation reuseIdentifier:(NSString *)reuseIdentifier {
  self = [super initWithAnnotation:annotation reuseIdentifier:reuseIdentifier];
  if (self) {
    [self setupTitleAnnotationView];
  }
  return self;
}

- (instancetype) initWithCoder:(NSCoder *)aDecoder {
  self = [super initWithCoder:aDecoder];
  if (self) {
    [self setupTitleAnnotationView];
  }
  return self;
}

- (instancetype) init {
  self = [super init];
  if (self) {
    [self setupTitleAnnotationView];
  }
  return self;
}

- (void) setupTitleAnnotationView {
  [self addSubview:self.titleLabel];
  [self.titleLabel mas_remakeConstraints:^(MASConstraintMaker *make) {
    make.centerX.equalTo(self);
    make.top.equalTo(self.mas_bottom).offset(5);
    make.height.equalTo(@12);
  }];
}

- (void) layoutSubviews {
  [super layoutSubviews];
}


- (UILabel*) titleLabel {
  if (!_titleLabel) {
    _titleLabel = [[UILabel alloc] init];
    _titleLabel.textColor = [UIColor colorWithRed:1 green:143/255.0f blue:17/255.0f alpha:1];
    _titleLabel.font = [UIFont systemFontOfSize:12];
    _titleLabel.textAlignment = NSTextAlignmentCenter;
  }
  return _titleLabel;
}
@end
