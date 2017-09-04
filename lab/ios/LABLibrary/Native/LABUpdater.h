//
//  LABUpdater.h
//  lab4
//
//  Created by QuanThomas on 16/9/21.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface LABUpdater : NSObject

@property (nonatomic, copy) NSString *appID;
@property (nonatomic, copy) NSString *APIToken;
@property (nonatomic, copy) NSString *bundleID;

@property (nonatomic, copy) NSString *updateUrl;

/**
 AppId and APIToken

 @param appID appId
 @param token apiToken
 */
- (void)checkVersionInfoFromFIR:(NSString *)appID APIToken:(NSString *)token;

- (void)checkVersionInfoFromFIR:(NSString *)bundleID;

- (void)checkVersionInfoFromPGY;


- (void)checkVersionInfoFromAppStore:(NSString *)appleID;

@end
