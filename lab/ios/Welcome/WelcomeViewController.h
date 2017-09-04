//
//  WelcomeViewController.h
//  lab4
//
//  Created by 周泽勇 on 2016/11/11.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>

@class CustomPageControl;


/**
 Show the introduction at the first open application. 
 default show list of local image.
 */
@interface WelcomeViewController : UIViewController<UIScrollViewDelegate>
@property(nonatomic, retain) UIScrollView* scrollView;

/**
 The dismiss button at the last page.
 */
@property(nonatomic, retain) UIButton* finishButton;
@property(nonatomic, assign) CGSize buttonSize;
@property(nonatomic, assign) CGFloat buttonBottomOffset;

/**
 List of images to show. value is type of @UIImage
 */
@property(nonatomic, retain) NSArray* imageArray;

/**
 indicator at the bottom, you can custom pageControl by use 
 self.pageControl.ellipseWidth = 5 etc...
 */
@property(nonatomic, retain) CustomPageControl* pageControl;
@property(nonatomic, assign) CGFloat pageControlBottomOffset;


/**
 Prepare the welcome page, default is use the image array to build this pages,
 you can override this method to provide the custom page.

 @return welcome pages, @NSArray, the value's type is @UIView
 */
- (NSArray*) prepareWelcomePages;
@end
