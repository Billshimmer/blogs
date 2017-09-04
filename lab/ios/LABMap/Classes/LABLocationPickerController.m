//
//  LABLocationPicker.m
//  lab4
//
//  Created by QuanThomas on 2016/9/23.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "LABLocationPickerController.h"

@interface LABLocationPickerController (init)

- (void)goBack;

- (void)addBackBar;

@end

@implementation LABLocationPickerController (init)

- (void)goBack {
  [self dismissViewControllerAnimated:YES completion:^{
    [self.navigationController popViewControllerAnimated:YES];
  }];
  if ([self.delegate respondsToSelector:@selector(onCancelPicked:)]) {
    [self.delegate onCancelPicked:cancelString];
  }
}

- (void)addBackBar {
  self.backBtn = [[UIButton alloc] init];
  self.backBtn.backgroundColor = [[UIColor whiteColor] colorWithAlphaComponent:0.9];
  
  UIImage *image = [UIImage imageNamed:backImageName];
  self.imageView = [[UIImageView alloc] initWithImage:image];
  [self.backBtn addSubview:self.imageView];
  [self.imageView mas_makeConstraints:^(MASConstraintMaker *make) {
    make.center.mas_equalTo(self.backBtn.center);
    make.width.equalTo(@9);
    make.height.equalTo(@19);
  }];
  
  self.backBtn.layer.cornerRadius = 10;
  [self.backBtn addTarget:self action:@selector(goBack) forControlEvents:UIControlEventTouchUpInside];
  [self.view addSubview:self.backBtn];
  [self.backBtn mas_makeConstraints:^(MASConstraintMaker *make) {
//    make.width.equalTo(@30);
//    make.height.equalTo(@40);
//    make.leading.equalTo(self.view).offset(@8);
//    make.top.equalTo(self.view).offset(@20);
  }];
}

@end


@implementation LABLocationPickerController


- (void)viewDidLoad {
  [super viewDidLoad];
}


@end
