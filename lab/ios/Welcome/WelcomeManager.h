//
//  WelcomeManager.h
//  lab4
//
//  Created by 周泽勇 on 2016/11/11.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@class WelcomeViewController;

/**
 Manager the welcome system data,
 */
@interface WelcomeManager : NSObject
@property(nonatomic, retain) UIWindow* welcomeWindow;
@property(nonatomic, retain) WelcomeViewController* welcomeViewController;
@property(nonatomic, copy) void (^onDismissWelcomeViewController)(void);

+(WelcomeManager*) getInstance;

- (void) presentWelcomeViewController;
@end
