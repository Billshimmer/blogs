//
//  UMengConfigObject.h
//  lab4
//
//  Created by QuanThomas on 2016/11/8.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface KeyObject : NSObject

@property (nonatomic, copy) NSString *AppKey;
@property (nonatomic, copy) NSString *AppSecret;
@property (nonatomic, copy) NSString *RedirectURL;

@end

@interface UMengConfigObject : NSObject

@property (nonatomic, strong) KeyObject *UMeng;
@property (nonatomic, strong) KeyObject *QQ;
@property (nonatomic, strong) KeyObject *WeChat;
@property (nonatomic, strong) KeyObject *Sina;

@end


