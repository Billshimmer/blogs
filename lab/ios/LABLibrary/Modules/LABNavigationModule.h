//
//  LABNavigationModule.h
//  lab4
//
//  Created by QuanThomas on 16/8/3.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import "UIKit/UIKit.h"

@import MapKit;

@interface LABNavigationModule : NSObject <RCTBridgeModule, CLLocationManagerDelegate>

@property (nonatomic) CLLocationDegrees destLongitude;
@property (nonatomic) CLLocationDegrees destLatitude;
@property (nonatomic) CLLocationDegrees sourceLongitude;
@property (nonatomic) CLLocationDegrees sourceLatitude;
@property (nonatomic, copy) NSString *destName;
@property (nonatomic, copy) NSString *coordType;

@property (nonatomic, weak) RCTBridge *bridge;

@end
