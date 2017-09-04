//
//  WelcomeViewController.m
//  lab4
//
//  Created by 周泽勇 on 2016/11/11.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "WelcomeViewController.h"
#import "CustomPageControl.h"
#import "masonry.h"

#define KKColor(r, g, b) [UIColor colorWithRed:(r)/255.0 green:(g)/255.0 blue:(b)/255.0 alpha:1.0]

@interface WelcomeViewController ()
@property(nonatomic, retain) NSArray* pageViewArray;
@end

@implementation WelcomeViewController
#pragma mark - Life Cycle
- (instancetype) init {
  self = [super init];
  if (self) {
    [self setup];
  }
  return self;
}

- (instancetype) initWithCoder:(NSCoder *)aDecoder {
  self = [super initWithCoder:aDecoder];
  if (self) {
    [self setup];
  }
  return self;
}

- (instancetype) initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil {
  self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
  if (self) {
    [self setup];
  }
  return self;
}

- (void) setup {
  //Set the default value
  self.imageArray = @[[UIImage imageNamed:@"sample01"], [UIImage imageNamed:@"sample02"], [UIImage imageNamed:@"sample03"]];
  self.buttonSize = CGSizeMake(200, 50);
  self.buttonBottomOffset = 100;
  self.pageControlBottomOffset = 50;
}

- (void)viewDidLoad {
  [super viewDidLoad];
  [self.view addSubview:self.scrollView];
  [self.view addSubview:self.pageControl];
  [self.view addSubview:self.finishButton];
  self.finishButton.alpha = 0;
  [self reloadPages];
}

- (void) viewDidAppear:(BOOL)animated {
  [super viewDidAppear:animated];
  self.pageControl.pageCount = self.imageArray.count;
  [self.pageControl refresh];
}

- (void)didReceiveMemoryWarning {
  [super didReceiveMemoryWarning];
  // Dispose of any resources that can be recreated.
}

- (void) viewWillLayoutSubviews {
  [super viewWillLayoutSubviews];
  CGFloat width = CGRectGetWidth(self.view.bounds);
  CGFloat height = CGRectGetHeight(self.view.bounds);
  NSInteger count = self.pageViewArray.count;
  
  //layour scrollView's frame
  self.scrollView.frame = self.view.bounds;
  self.scrollView.contentSize = CGSizeMake(width*count, height);
  
  //layout the page's frame
  CGFloat startX = 0;
  for (UIView* view in self.pageViewArray) {
    view.frame = CGRectMake(startX, 0, width, height);
    startX += width;
  }
  
  //layout the button's frame
  [self layoutFinishButtonWithFrame:CGSizeMake(width, height)];
  
  //layout the page controller
  [self layoutPageControlWithFrame:CGSizeMake(width, height)];
}

#pragma mark - Delegate
- (void) scrollViewDidScroll:(UIScrollView *)scrollView {
  NSInteger lastPageIndex = self.imageArray.count - 1;
  CGFloat width = scrollView.frame.size.width;
  if (scrollView.contentOffset.x <= width*lastPageIndex && scrollView.contentOffset.x >= width*(lastPageIndex - 0.5) ) {
    CGFloat offsetWidth = scrollView.contentOffset.x - width*(lastPageIndex - 0.5);
    CGFloat ratio = offsetWidth/(width/2);
    self.finishButton.alpha = ratio;
  }else {
    if (scrollView.contentOffset.x > width*lastPageIndex) {
      self.finishButton.alpha = 1;
    }else if(scrollView.contentOffset.x < width*(lastPageIndex - 0.5)){
      self.finishButton.alpha = 0;
    }
  }
  [self.pageControl scrollViewDidScroll:scrollView];
}

#pragma mark - custom method
- (NSArray*) prepareWelcomePages {
  NSMutableArray* welcomPages = [NSMutableArray arrayWithCapacity:self.imageArray.count];
  for (UIImage* image in self.imageArray) {
    UIImageView* imageView = [[UIImageView alloc] initWithImage:image];
    [welcomPages addObject:imageView];
  }
  return welcomPages;
}

- (void) reloadPages {
  for (UIView* subview in self.scrollView.subviews) {
    [subview removeFromSuperview];
  }
  self.pageViewArray = [self prepareWelcomePages];
  for (UIView* view in self.pageViewArray) {
    [self.scrollView addSubview:view];
  }
}

- (void) layoutPageControlWithFrame:(CGSize) frameSize {
  CGFloat pageControlHeight = 30;
  self.pageControl.frame = CGRectMake(0, frameSize.height - self.pageControlBottomOffset - pageControlHeight, frameSize.width, 30);
}

- (void) layoutFinishButtonWithFrame:(CGSize) frameSize  {
  CGFloat centerX = (frameSize.width - self.buttonSize.width)/2;
  CGFloat y = frameSize.height - self.buttonSize.height - self.buttonBottomOffset;
  self.finishButton.frame = CGRectMake(centerX, y, self.buttonSize.width, self.buttonSize.height);
}

#pragma mark - Getter&Setter
- (UIScrollView*) scrollView {
  if (!_scrollView) {
    _scrollView = [[UIScrollView alloc] initWithFrame:CGRectZero];
    _scrollView.frame = self.view.bounds;
    _scrollView.pagingEnabled = YES;
    _scrollView.showsHorizontalScrollIndicator = NO;
    _scrollView.showsVerticalScrollIndicator = NO;
    _scrollView.backgroundColor = [UIColor clearColor];
    _scrollView.delegate = self;
    _scrollView.contentSize = CGSizeMake(CGRectGetWidth(self.view.bounds)*self.imageArray.count, CGRectGetHeight(self.view.bounds));
  }
  return _scrollView;
}

- (CustomPageControl*) pageControl {
  if (!_pageControl) {
    _pageControl = [[CustomPageControl alloc] initWithFrame:CGRectZero];
    _pageControl.pointSize = CGSizeMake(6, 6);
    _pageControl.sliderSize = CGSizeMake(6, 6);
    _pageControl.pointSpacing = 19;
    _pageControl.ellipseWidth = 12;
    _pageControl.sliderFillColor = KKColor(230, 70, 60);
    _pageControl.pointColor = KKColor(196, 196, 196);
    _pageControl.showText = NO;
    _pageControl.colors = @[KKColor(230, 70, 60), KKColor(10, 152, 250), KKColor(12, 180, 8)];
  }
  return _pageControl;
}

- (UIButton*) finishButton {
  if (!_finishButton) {
    _finishButton = [UIButton buttonWithType:UIButtonTypeCustom];
    [_finishButton setTitle:@"开启" forState:UIControlStateNormal];
    _finishButton.layer.cornerRadius = 8;
    _finishButton.layer.borderColor = KKColor(12, 180, 8).CGColor;
    _finishButton.backgroundColor = KKColor(12, 180, 8);
  }
  return _finishButton;
}
@end
