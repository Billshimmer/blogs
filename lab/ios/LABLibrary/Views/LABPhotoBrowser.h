//
//  LABPhotoBrowser.h
//  lab4
//
//  Created by Thomas Quan on 2016/12/27.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <React/RCTUtils.h>
#import <React/RCTViewManager.h>
#import "LABPhotoBrowserController.h"

@interface LABPhotoBrowser : UIView

@property (nonatomic, strong) MWPhotoBrowser *browser;
@property (nonatomic, strong) LABPhotoBrowserController *labbrowser;

@property (nonatomic, strong) NSDictionary *options;
@property (assign) NSUInteger index;
@property (nonatomic, strong) NSMutableArray *photos;

@property (nonatomic, strong) RCTBubblingEventBlock onPhotoTap;
@property (nonatomic, strong) RCTBubblingEventBlock onPhotoSelected;

@end
