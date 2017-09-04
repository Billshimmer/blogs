//
//  LABTableViewIndex.m
//  lab4
//
//  Created by Thomas Quan on 2017/1/16.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "IndexView.h"

@interface IndexView () {
  BOOL isLayedOut;
  CAShapeLayer *shapeLayer;
  CGFloat fontSize;
}

@property (nonatomic, strong) NSArray *letters;
@property (nonatomic, assign) CGFloat letterHeight;

@end


@implementation IndexView

- (id)initWithFrame:(CGRect)frame {
  if (self = [super initWithFrame:frame]) {
    self.backgroundColor = [UIColor grayColor];
    
    if (frame.size.height > 480) {
      self.letterHeight = 20;
      fontSize = 14;
    } else {
      self.letterHeight = 14;
      fontSize = 12;
    }
  }
  return self;
}

- (void)setup {
  shapeLayer = [CAShapeLayer layer];
  shapeLayer.lineWidth = 1.0f;
  shapeLayer.fillColor = [UIColor clearColor].CGColor;
  shapeLayer.lineJoin = kCALineCapSquare;
  shapeLayer.strokeColor = [[UIColor clearColor] CGColor];
  shapeLayer.strokeEnd = 1.0f;
  self.layer.masksToBounds = NO;
}

- (void)setIndexView {
  self.letters = self.indexes;
  isLayedOut = NO;
  
  [self setNeedsLayout];
  [self layoutIfNeeded];
}

- (void)layoutSubviews{
  [super layoutSubviews];
  [self setup];
  
  if (!isLayedOut){
    
    [self.layer.sublayers makeObjectsPerformSelector:@selector(removeFromSuperlayer)];
    
    shapeLayer.frame = (CGRect) {.origin = CGPointZero, .size = self.layer.frame.size};
    UIBezierPath *bezierPath = [UIBezierPath bezierPath];
    [bezierPath moveToPoint:CGPointZero];
    [bezierPath addLineToPoint:CGPointMake(0, self.frame.size.height)];
    
    [self.letters enumerateObjectsUsingBlock:^(NSString *letter, NSUInteger idx, BOOL *stop) {
      CGFloat originY = idx * self.letterHeight;
      CATextLayer *ctl = [self textLayerWithSize:fontSize
                                          string:letter
                                        andFrame:CGRectMake(0, originY, self.frame.size.width, self.letterHeight)];
      [self.layer addSublayer:ctl];
      [bezierPath moveToPoint:CGPointMake(0, originY)];
      [bezierPath addLineToPoint:CGPointMake(ctl.frame.size.width, originY)];
    }];
    
    shapeLayer.path = bezierPath.CGPath;
    [self.layer addSublayer:shapeLayer];
    
    isLayedOut = YES;
  }
}

- (void)reloadLayout:(UIEdgeInsets)edgeInsets {
  CGRect rect = self.frame;
  rect.size.height = self.indexes.count * self.letterHeight;
  rect.origin.y = edgeInsets.top + ([self superview].bounds.size.height - edgeInsets.top - edgeInsets.bottom - rect.size.height) / 2;
  self.frame = rect;
}

- (CATextLayer*)textLayerWithSize:(CGFloat)size string:(NSString*)string andFrame:(CGRect)frame {
  CATextLayer *textLayer = [CATextLayer layer];
  [textLayer setFont:@"ArialMT"];
  [textLayer setFontSize:size];
  [textLayer setFrame:frame];
  [textLayer setAlignmentMode:kCAAlignmentCenter];
  [textLayer setContentsScale:[[UIScreen mainScreen] scale]];
  [textLayer setForegroundColor:RGB(168, 168, 168, 1).CGColor];
  [textLayer setString:string];
  return textLayer;
}

- (void)touchesBegan:(NSSet *)touches withEvent:(UIEvent *)event {
  [super touchesBegan:touches withEvent:event];
  [self sendEventToDelegate:event];
  [self.delegate tableViewIndexTouchesBegan:self];
}

- (void)touchesMoved:(NSSet *)touches withEvent:(UIEvent *)event {
  [super touchesMoved:touches withEvent:event];
  [self sendEventToDelegate:event];
}

- (void)touchesEnded:(NSSet *)touches withEvent:(UIEvent *)event {
  [self.delegate tableViewIndexTouchesEnd:self];
}

- (void)touchesCancelled:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event {
  [self.delegate tableViewIndexTouchesEnd:self];
}

- (void)sendEventToDelegate:(UIEvent*)event{
  UITouch *touch = [[event allTouches] anyObject];
  CGPoint point = [touch locationInView:self];
  
  NSInteger indx = ((NSInteger) floorf(point.y) / self.letterHeight);
  
  if (indx< 0 || indx > self.letters.count - 1) {
    return;
  }
  
  [self.delegate tableViewIndex:self didSelectSectionAtIndex:indx withTitle:self.letters[indx]];
}

@end
