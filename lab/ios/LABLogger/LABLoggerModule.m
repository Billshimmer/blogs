//
//  LABLoggerModule.m
//  lab4
//
//  Created by 周泽勇 on 2017/6/13.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "LABLoggerModule.h"
#import "LoggerError.h"

static NSString* LABLoggerModleErrorDomain = @"LABLoggerModleErrorDomain";
static NSInteger LABLoggerModleErrorCode = 101;

@implementation LABLoggerModule
RCT_EXPORT_MODULE(LABLoggerModule);

RCT_EXPORT_METHOD(reportError:(NSDictionary*) options) {
  NSString* message = [options objectForKey:@"message"];
  BOOL isFatal = [[options objectForKey:@"isFatal"] boolValue];
  NSString* stack = [options objectForKey:@"stack"];
  NSString* description = [NSString stringWithFormat:@"message:%@, isFatal:%d, stack:\n%@", message, isFatal, stack];
  NSDictionary* userInfo = @{NSLocalizedDescriptionKey:description};
  LoggerError* error = [LoggerError errorWithDomain:LABLoggerModleErrorDomain code:LABLoggerModleErrorCode userInfo:userInfo];
  [Bugly reportError:error];
}
@end
