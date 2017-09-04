//
//  LABAlertController.h
//  lab4
//
//  Created by QuanThomas on 2016/9/27.
//  Copyright © 2016年 Facebook. All rights reserved.
//

/* use example
LABAlertController *alertVC = [LABAlertController alertControllerWithTitle:@"系统更新" message:@"1、xxxxxx\n2、xxxxxxxxx" ];
LABAlertAction *cancel = [LABAlertAction actionWithTitle:@"不要更新" handler:^(LABAlertAction *action) {
  NSLog(@"点击了 %@ 按钮",action.title);
}];
LABAlertAction *updateNow = [LABAlertAction actionWithTitle:@"立即更新" handler:^(LABAlertAction *action) {
  NSLog(@"点击了 %@ 按钮",action.title);
}];
LABAlertAction *updateLater = [LABAlertAction actionWithTitle:@"稍后更新" handler:^(LABAlertAction *action) {
  NSLog(@"点击了 %@ 按钮",action.title);
}];
[alertVC addAction:cancel];
[alertVC addAction:updateNow];
[alertVC addAction:updateLater];
[self presentViewController:alertVC animated:NO completion:nil];
 */

#import <UIKit/UIKit.h>

@interface LABAlertAction : NSObject

+ (instancetype)actionWithTitle:(NSString *)title
                        handler:(void (^)(LABAlertAction *action))handler;

@property (nonatomic, copy) void(^actionHandler)(LABAlertAction *action);
@property (nonatomic, readonly) NSString *title;

@end

@interface LABAlertController : UIViewController

@property (nonatomic, readonly) NSArray<LABAlertAction *> *actions;
@property (nonatomic, copy) NSString *title;
@property (nonatomic, copy) NSString *message;
@property (nonatomic, assign) NSTextAlignment messageAlignment;

+ (instancetype)alertControllerWithTitle:(NSString *)title message:(NSString *)message;
- (void)addAction:(LABAlertAction *)action;

@end
