//
//  LABSideIndexView.m
//  lab4
//
//  Created by Thomas Quan on 2017/1/16.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "LABSideIndexView.h"
#import "IndexView.h"

@interface LABSideIndexView() <IndexViewDelegate>

@property (nonatomic, strong) IndexView *indexView;
@property (nonatomic, strong) UILabel *titleLabel;

@end

@implementation LABSideIndexView

- (void)setOptions:(NSDictionary *)options {
  if (options != nil) {
      _options = options;
  }
  
  if ([options objectForKey:@"letters"]) {
    _letters = [options objectForKey:@"letters"];
  }
  
}

- (void)createTitleLabel {
  CGFloat width = [UIScreen mainScreen].bounds.size.width;
  CGFloat height = [UIScreen mainScreen].bounds.size.height;
  self.titleLabel = [[UILabel alloc] initWithFrame:(CGRect){(width - 64 ) / 2, (height - 64)/2, 64, 64}];
  self.titleLabel.backgroundColor = RGB(18, 29, 45, 0.9);
  self.titleLabel.hidden = YES;
  self.titleLabel.textAlignment = NSTextAlignmentCenter;
  self.titleLabel.textColor = [UIColor whiteColor];
  [[[[UIApplication sharedApplication] delegate] window] addSubview:self.titleLabel];
}

- (void)createSideIndexView {
  self.indexView = [[IndexView alloc] initWithFrame:(CGRect){0, 0, self.frame.size.width, self.frame.size.height}];
  self.indexView.userInteractionEnabled = YES;
  [self addSubview:self.indexView];
  [self createTitleLabel];
}

- (void)setDelegate {
  self.indexView.indexes = _letters;
  [self.indexView reloadLayout:UIEdgeInsetsZero];
  self.indexView.delegate = self;
  [self.indexView setIndexView];
}

- (void)initSideIndexView {
  [self createSideIndexView];
  [self setDelegate];
  
}

- (void)removeSubviews {
  [self.indexView removeFromSuperview];
  [self.titleLabel removeFromSuperview];
}

- (void)deinitSideIndexView {
  [self removeSubviews];
  [self removeFromSuperview];

}

- (void)didMoveToWindow {
  [super didMoveToWindow];
  if (!self.window) {
    [self deinitSideIndexView];
  } else {
    dispatch_async(dispatch_get_main_queue(), ^{
      [self initSideIndexView];
    });
  }
}

- (void)touchesBegan:(NSSet *)touches withEvent:(UIEvent *)event {
  
}

#pragma mark - LABTableViewIndexDelegate
- (void)tableViewIndex:(LABSideIndexView *)tableViewIndex didSelectSectionAtIndex:(NSInteger)index withTitle:(NSString *)title {
  NSString *letter = self.indexView.indexes[index];
  self.titleLabel.text = letter;
  if (_onLetterChange) {
    _onLetterChange(@{@"letter": title,
                      @"position": @(index)});
  }
}

- (void)tableViewIndexTouchesBegan:(LABSideIndexView *)tableViewIndex {
  self.titleLabel.hidden = NO;
}

- (void)tableViewIndexTouchesEnd:(LABSideIndexView *)tableViewIndex {
  CATransition *animation = [CATransition animation];
  animation.type = kCATransitionFade;
  animation.duration = 0.4;
  [self.titleLabel.layer addAnimation:animation forKey:nil];
  
  self.titleLabel.hidden = YES;
}


@end
