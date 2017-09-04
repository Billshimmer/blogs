//
//  WelcomeManager.m
//  lab4
//
//  Created by 周泽勇 on 2016/11/11.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "WelcomeManager.h"
#import "WelcomeViewController.h"

@implementation WelcomeManager

+(WelcomeManager*) getInstance {
  static WelcomeManager* sharedWelcomeManager = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    if (!sharedWelcomeManager) {
      sharedWelcomeManager = [[WelcomeManager alloc] init];
    }
  });
  return sharedWelcomeManager;
}

- (void) presentWelcomeViewController {
  self.welcomeWindow.rootViewController = self.welcomeViewController;
  [self.welcomeViewController.finishButton addTarget:self action:@selector(dismissWelcomeViewController) forControlEvents:UIControlEventTouchUpInside];
  [self.welcomeWindow makeKeyAndVisible];
}

- (void) dismissWelcomeViewController {
  [self.welcomeWindow resignKeyWindow];
  if (self.onDismissWelcomeViewController) {
    self.onDismissWelcomeViewController();
  }
}

#pragma mark - Getter&Setter
- (UIWindow*) welcomeWindow {
  if (!_welcomeWindow) {
    _welcomeWindow = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  }
  return _welcomeWindow;
}

- (WelcomeViewController*) welcomeViewController {
  if (!_welcomeViewController) {
    _welcomeViewController = [[WelcomeViewController alloc] init];
  }
  return _welcomeViewController;
}
@end
