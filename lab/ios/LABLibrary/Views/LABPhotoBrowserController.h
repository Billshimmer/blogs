//
//  LABPhotoBrowserController.h
//  lab4
//
//  Created by Thomas Quan on 2017/1/5.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <MWPhotoBrowser/MWPhotoBrowser.h>
#import <React/RCTViewManager.h>

@interface LABPhotoBrowserController : MWPhotoBrowser

@property (nonatomic, strong) RCTBubblingEventBlock onPhotoTap;

@end
