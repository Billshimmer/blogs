//
//  UMengBuild.h
//  lab4
//
//  Created by QuanThomas on 2016/11/8.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UMSocialCore/UMSocialCore.h>

@interface UMengUShareHelper : NSObject

+ (BOOL) UMengSocialCanOpenURL:(NSURL *)url;

+ (void)Build:(NSDictionary *)Options;

@end
