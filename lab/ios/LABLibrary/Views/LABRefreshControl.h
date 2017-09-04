/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import <UIKit/UIKit.h>
#import "MJRefresh.h"
#import <React/RCTComponent.h>

@interface LABRefreshControl : MJRefreshHeader
@property (nonatomic, copy) NSString *title;
@property (nonatomic, retain) UIColor* titleColor;
@property (nonatomic, copy) RCTDirectEventBlock onRefresh;
@property (nonatomic, retain) UIColor* indicatorColor;
@property (nonatomic, assign) BOOL refreshing;
@end
