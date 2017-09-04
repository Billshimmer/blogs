//
//  LABPhotoBrowserController.m
//  lab4
//
//  Created by Thomas Quan on 2017/1/5.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "LABPhotoBrowserController.h"

@interface LABPhotoBrowserController ()

@end

@implementation LABPhotoBrowserController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (void)toggleControls {
  if (_onPhotoTap) {
    _onPhotoTap(nil);
  }
}

@end
