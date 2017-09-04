//
//  CustomPageControl.m
//  CustomPageControlExample
//
//  Created by 周泽勇 on 16/2/25.
//  Copyright © 2016年 周泽勇. All rights reserved.
//

#import "CustomPageControl.h"

@interface CustomPageControl ()
@property(nonatomic, retain) CAShapeLayer* sliderShapeLayer;
@property(nonatomic, retain) CATextLayer* textLayer;
@property(nonatomic, retain) NSMutableArray* pointShapes;
/**
 *  The start x value of the first point
 */
@property(nonatomic, assign) CGFloat startX;
@property(nonatomic, assign, readonly) CGFloat contentWidth;
@end

@implementation CustomPageControl

- (instancetype) initWithFrame:(CGRect)frame {
  self = [super initWithFrame:frame];
  if (self) {
    [self setupCustomPageControl];
  }
  return self;
}

- (instancetype) initWithCoder:(NSCoder *)aDecoder {
  self = [super initWithCoder:aDecoder];
  if (self) {
    [self setupCustomPageControl];
  }
  return self;
}

- (void) setupCustomPageControl {
  _showText = YES;
  self.backgroundColor = [UIColor clearColor];
  _pointSpacing = 15;
  _ellipseWidth = 10;
  _pointSize = CGSizeMake(10, 10);
  _sliderSize = _pointSize;
  _sliderStrokeColor = [UIColor colorWithRed:222/255.0 green:53/255.0 blue:46/255.0 alpha:1];
  _sliderFillColor = [UIColor whiteColor];
  _pointColor = [UIColor colorWithRed:84/255.0 green:80/255.0 blue:85/255.0 alpha:1];
  _currentPage = 0;
  _pageCount = 0;
  _sliderShapeLayer = [CAShapeLayer layer];
  _textLayer = [CATextLayer layer];
  _startX = 0;
  _textColor = [UIColor blackColor];
  
  _sliderShapeLayer.anchorPoint = CGPointMake(0.5, 0.5);
  _sliderShapeLayer.strokeColor = self.sliderStrokeColor.CGColor;
  _sliderShapeLayer.fillColor = self.sliderFillColor.CGColor;
  _sliderShapeLayer.lineWidth = 1;
  
  _textLayer.string = @"1";
  _textLayer.foregroundColor = _textColor.CGColor;
  _textLayer.alignmentMode = kCAAlignmentCenter;
  _textLayer.fontSize = _sliderSize.width - 2;
  CGFloat width = MAX(self.ellipseWidth, self.sliderSize.width);
  _textLayer.frame = CGRectMake(0, 0, width, self.sliderSize.height);
  [_sliderShapeLayer addSublayer:_textLayer];
}

- (void) layoutSubviews {
  [super layoutSubviews];
  [self refresh];
}

- (void) refresh {
  if (self.ellipseWidth < self.sliderSize.width) {
    self.ellipseWidth = self.sliderSize.width;
  }
  self.startX = (self.bounds.size.width - self.contentWidth)/2;
  UIBezierPath* layerPath = [UIBezierPath bezierPathWithRoundedRect:CGRectMake(0, 0, self.pointSize.width, self.pointSize.height) cornerRadius:self.pointSize.height];
  UIBezierPath* sliderPath = [UIBezierPath bezierPathWithRoundedRect:CGRectMake(0, 0, self.ellipseWidth, self.sliderSize.height) cornerRadius:self.sliderSize.height];
  
  // Set the slide shape
  _sliderShapeLayer.anchorPoint = CGPointMake(0.5, 0.5);
  
  _sliderShapeLayer.fillColor = self.sliderFillColor.CGColor;
  if (self.showText) {
    _sliderShapeLayer.lineWidth = 1;
    _sliderShapeLayer.strokeColor = self.sliderStrokeColor.CGColor;
  }else {
    _sliderShapeLayer.lineWidth = 0;
    _sliderShapeLayer.strokeColor = [UIColor clearColor].CGColor;
  }
  
  _sliderShapeLayer.path = sliderPath.CGPath;
  _sliderShapeLayer.frame = CGRectMake(self.startX - (_ellipseWidth - _sliderSize.width)/2, (self.bounds.size.height - _sliderSize.height)/2, self.sliderSize.width, self.sliderSize.height);
  if (self.layer.sublayers.count > 0) {
    if (![self.layer.sublayers containsObject:self.sliderShapeLayer]) {
      [self.layer addSublayer:self.sliderShapeLayer];
    }
  }else {
    [self.layer addSublayer:self.sliderShapeLayer];
  }
  
  _textLayer.foregroundColor = _textColor.CGColor;
  
  // Set the points
  for (CAShapeLayer* layer in self.pointShapes) {
    [layer removeFromSuperlayer];
  }
  [self.pointShapes removeAllObjects];
  for (NSInteger index = 0; index < self.pageCount; index++) {
    CAShapeLayer* shapeLayer = [CAShapeLayer layer];
    shapeLayer.path = layerPath.CGPath;
    shapeLayer.fillColor = self.pointColor.CGColor;
    shapeLayer.anchorPoint = CGPointMake(0.5, 0.5);
    CGRect frame = CGRectMake(self.startX + (_pointSize.width + _pointSpacing)*index, (self.bounds.size.height - _pointSize.height)/2, _pointSize.width, _pointSize.height);
    shapeLayer.frame = frame;
    [self.pointShapes addObject:shapeLayer];
    [self.layer insertSublayer:shapeLayer below:self.sliderShapeLayer];
  }
}

- (CGFloat) contentWidth {
  return self.pageCount*self.pointSize.width + (self.pageCount - 1)*self.pointSpacing;
}

- (NSMutableArray*) pointShapes {
  if (!_pointShapes) {
    _pointShapes = [NSMutableArray new];
  }
  return _pointShapes;
}

- (void) scrollViewDidScroll:(CGFloat)offset scrollWidth:(CGFloat)scrollWidth {
  CGFloat percent = offset/scrollWidth;
  _currentPage = (NSInteger) percent;
  CGFloat singleWidth = _pointSize.width + _pointSpacing;
  CGFloat totoalWidth = self.contentWidth - _pointSize.width/2;
  // positionX is current x-alias position of slider, (startX + pointSize.width/2) is the center of the first point
  CGFloat positionX = _startX + percent* singleWidth + _pointSize.width/2;
  if (offset > (_pageCount - 1)*scrollWidth) {
    positionX = _startX + (1 - (percent - floor(percent)))*totoalWidth + _pointSize.width/2;
  }else if(offset < 0){
    positionX = _startX - percent*totoalWidth + _pointSize.width/2;
  }
  [CATransaction begin];
  [CATransaction setDisableActions:YES];
  self.sliderShapeLayer.position = CGPointMake(positionX, self.bounds.size.height/2);
  if (self.colors && self.colors.count > 0 && self.colors.count > self.currentPage) {
    
    UIColor* color = self.colors[self.currentPage];
    if (color) {
      self.sliderShapeLayer.fillColor = color.CGColor;
    }
  }
  [CATransaction commit];
  
  // When the slider insects with the normal point, change the shape of the slider
  if (offset > (_pageCount - 1)*scrollWidth || offset < 0) {
    return;
  }
  for (CAShapeLayer* shapeLayer in self.pointShapes) {
    if (CGRectIntersectsRect(shapeLayer.frame, self.sliderShapeLayer.frame)) {
      // calculate the length between x-alias position of current intersects shape layer with slider shape and xalis position of slider
      CGFloat length = fabs(shapeLayer.position.x - positionX);
      if (length >= 0 && length <= (self.ellipseWidth - self.pointSize.width)) {
        [CATransaction begin];
        [CATransaction setDisableActions:YES];
        CGFloat offsetX = (self.ellipseWidth - self.sliderSize.width - length)/2;
        self.sliderShapeLayer.path = [UIBezierPath bezierPathWithRoundedRect:CGRectMake(-offsetX, 0, self.ellipseWidth - length, self.sliderSize.height) cornerRadius:self.sliderSize.height].CGPath;
        
        [CATransaction commit];
      }else {
        UIBezierPath* sliderPath = [UIBezierPath bezierPathWithRoundedRect:CGRectMake(0, 0, self.sliderSize.width, self.sliderSize.height) cornerRadius:self.sliderSize.height];
        self.sliderShapeLayer.path = sliderPath.CGPath;
      }
      if (self.showText) {
        self.textLayer.string = [NSString stringWithFormat:@"%.0f", percent + 1];
      }
    }
  }
}

- (void) scrollViewDidScroll:(UIScrollView *)scrollView {
  [self scrollViewDidScroll:scrollView.contentOffset.x scrollWidth:scrollView.bounds.size.width];
}

- (void) setShowText:(BOOL)showText {
  _showText = showText;
  if (showText) {
    if (![self.sliderShapeLayer.sublayers containsObject:self.textLayer]) {
      [self.sliderShapeLayer addSublayer:self.textLayer];
    }
  }else {
    [self.textLayer removeFromSuperlayer];
    self.sliderShapeLayer.lineWidth = 0;
    self.sliderShapeLayer.strokeColor = [UIColor clearColor].CGColor;
  }
}
@end
