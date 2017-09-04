//
//  LABSideIndexView.h
//  lab4
//
//  Created by Thomas Quan on 2017/1/16.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <React/RCTUtils.h>
#import <React/RCTViewManager.h>

@interface LABSideIndexView : UIView

@property (nonatomic, strong) NSDictionary *options;
@property (nonatomic, strong) NSArray *letters;

@property (nonatomic, strong) RCTBubblingEventBlock onLetterChange;

@end


