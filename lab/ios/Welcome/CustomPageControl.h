//
//  CustomPageControl.h
//  CustomPageControlExample
//
//  Created by 周泽勇 on 16/2/25.
//  Copyright © 2016年 周泽勇. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface CustomPageControl : UIView
/**
 *  Distance between points
 */
@property(nonatomic, assign) CGFloat pointSpacing;

/**
 *  When the slider point change the ellipse, the width that needed
 */
@property(nonatomic, assign) CGFloat ellipseWidth;

/**
 *  the size of point represent the total page
 */
@property(nonatomic, assign) CGSize pointSize;

/**
 *  Slider point size
 */
@property(nonatomic, assign) CGSize sliderSize;

/**
 *  Slider point's stroke color
 */
@property(nonatomic, retain) UIColor* sliderStrokeColor;

/**
 *  Slider point's fill color
 */
@property(nonatomic, retain) UIColor* sliderFillColor;

/**
 *  Normal point's color
 */
@property(nonatomic, retain) UIColor* pointColor;

@property(nonatomic, assign) NSInteger currentPage;

/**
 *  Total page count
 */
@property(nonatomic, assign) NSInteger pageCount;

@property(nonatomic, retain) UIColor* textColor;

@property(nonatomic, assign) BOOL showText;

@property(nonatomic, retain) NSArray* colors;

- (void) refresh;

- (void) scrollViewDidScroll:(UIScrollView*) scrollView;

/**
 *   When the scorllview(or some thing like that) scrolling, call this method
 *
 *  @param offset      the scroll offset to the x value
 *  @param scrollWidth single page width of scroll view(or some thing like that)
 */
- (void) scrollViewDidScroll:(CGFloat) offset scrollWidth:(CGFloat) scrollWidth;
@end
