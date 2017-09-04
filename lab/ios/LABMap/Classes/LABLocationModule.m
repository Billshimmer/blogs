//
//  LABLocationModule.m
//  lab4
//
//  Created by QuanThomas on 16/7/19.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "LABLocationModule.h"
#import "JZLocationConverter.h"
#import <BaiduMapAPI_Location/BMKLocationService.h>

typedef NS_ENUM(NSInteger, ErrorCode) {
  Unavailable = 1,
  Denid,
  Timeout,
};

@interface LABLocationModule ()<BMKLocationServiceDelegate>
@property(nonatomic, retain) BMKLocationService* locationService;
@property(nonatomic, retain) BMKGeoCodeSearch* geoCodeSearch;
@property(nonatomic, assign) CLLocationCoordinate2D coordinate2D;
@property(nonatomic, retain) NSDictionary *options;
@end

@implementation LABLocationModule {
  RCTResponseSenderBlock _callback;
}
@synthesize bridge = _bridge;
RCT_EXPORT_MODULE(LABLocationModule);

RCT_EXPORT_METHOD(getCurrentPosition:(NSDictionary *)options callback:(RCTResponseSenderBlock)callback) {
  self.options = options;
  _callback = callback;
  self.locationService = [[BMKLocationService alloc] init];
  self.locationService.delegate = self;
  [self.locationService startUserLocationService];
}

- (void) didUpdateBMKUserLocation:(BMKUserLocation *)userLocation {
  self.coordinate2D = userLocation.location.coordinate;
  self.geoCodeSearch = [[BMKGeoCodeSearch alloc] init];
  self.geoCodeSearch.delegate = self;
  BMKReverseGeoCodeOption* reverseGeoCodeSearchOption = [[BMKReverseGeoCodeOption alloc] init];
  reverseGeoCodeSearchOption.reverseGeoPoint = self.coordinate2D;
  [self.geoCodeSearch reverseGeoCode:reverseGeoCodeSearchOption];
  [self.locationService stopUserLocationService];
}

- (void) didFailToLocateUserWithError:(NSError *)error {
  _callback(@[[NSNumber numberWithInteger:Unavailable]]);
}

-(void) onGetReverseGeoCodeResult:(BMKGeoCodeSearch *)searcher result:(BMKReverseGeoCodeResult *)result errorCode:(BMKSearchErrorCode)error {
  if (error == BMK_SEARCH_NO_ERROR) {
    CLLocationCoordinate2D coor;
    
    NSString *coordType;
    if (self.options && [self.options objectForKey:@"coordType"]) {
      coordType = self.options[@"coordType"];
      if ([coordType isEqualToString:@"bd09"]) {
        coor = CLLocationCoordinate2DMake(self.coordinate2D.latitude, self.coordinate2D.longitude);
      } else if ([coordType isEqualToString:@"gcj02"]) {
        coor = [JZLocationConverter bd09ToGcj02:CLLocationCoordinate2DMake(self.coordinate2D.latitude, self.coordinate2D.longitude)];
      } else {
        coor = [JZLocationConverter bd09ToWgs84:CLLocationCoordinate2DMake(self.coordinate2D.latitude, self.coordinate2D.longitude)];
      }
    } else {
      coor = CLLocationCoordinate2DMake(self.coordinate2D.latitude, self.coordinate2D.longitude);
    }
    NSString *city = result.addressDetail.city;
    NSString *name = result.address;
    NSDictionary *dict = @{@"longitude": [[NSNumber alloc] initWithDouble:coor.longitude] ,
                           @"latitude": [[NSNumber alloc] initWithDouble:coor.latitude],
                           @"address": [NSString stringWithFormat:@"%@", name],
                           @"city": [NSString stringWithFormat:@"%@", city]
                           };
    if (_callback) {
      _callback(@[[NSNull null], dict]);
    }
    
    _callback = NULL;
  }else {
    if (_callback) {
      _callback(@[[NSNumber numberWithInteger:Unavailable]]);
    }
    _callback = NULL;
    NSLog(@"抱歉，未找到结果");
  }
}

- (dispatch_queue_t)methodQueue {
  return dispatch_get_main_queue();
}
@end
