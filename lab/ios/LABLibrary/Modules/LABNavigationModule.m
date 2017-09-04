//
//  LABNavigationModule.m
//  lab4
//
//  Created by QuanThomas on 16/8/3.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "LABNavigationModule.h"
#import <React/RCTUtils.h>
#import "JZLocationConverter.h"
#import <CoreLocation/CoreLocation.h>
#import <React/RCTLocationObserver.h>

typedef NS_ENUM(NSInteger, ErrorCode) {
  Unavailable = 1,
  Denid,
  Timeout,
};

typedef struct {
  double timeout;
  double maximumAge;
  double accuracy;
  double distanceFilter;
} RCTLocationOptions;

@implementation LABNavigationModule
{
  RCTLocationObserver *locationObserver;
}
RCT_EXPORT_MODULE();

@synthesize bridge = _bridge;


// Todo: 调研CLLocationManager 服务关闭的手段
RCT_EXPORT_METHOD(openNavigation:(NSDictionary *)options
                  callback:(RCTResponseSenderBlock)callback)
{
  locationObserver = [_bridge moduleForClass:[RCTLocationObserver class]];
  
  if (options[@"destLongitude"] != nil) {
    _destLongitude = [options[@"destLongitude"] doubleValue];
  } else {
    _destLongitude = 0;
  }
  if (options[@"destLatitude"] != nil) {
    _destLatitude = [options[@"destLatitude"] doubleValue];
  } else {
    _destLatitude = 0;
  }
  if (options[@"destName"] != nil) {
    _destName = options[@"destName"];
  } else {
    _destName = @"目的地";
  }
  // coordType 值有'bd09' 'gcj02' 默认bd09
  if (options[@"coordType"]) {
    _coordType = options[@"coordType"];
  } else {
    _coordType = @"bd09";
  }
  
  
  // 前端传来的参数不对
  if (_destLongitude == 0 || _destLatitude == 0) {
    callback(@[[NSNumber numberWithInt:1]]);
    return;
  }
  
  [self showActionSheet];
}

- (void)showActionSheet
{
  UIAlertController *alertVC = [UIAlertController alertControllerWithTitle:@"请选择地图" message:nil preferredStyle:UIAlertControllerStyleActionSheet];
  
  UIAlertAction *appleNavi = [UIAlertAction actionWithTitle:@"使用苹果地图导航"
                                                      style:UIAlertActionStyleDefault
                                                    handler:^(UIAlertAction * _Nonnull action)
  {
    MKMapItem *currentItem = [MKMapItem mapItemForCurrentLocation];
    CLLocationCoordinate2D coor;
    if ([_coordType isEqualToString:@"bd09"]) {
      coor = [JZLocationConverter bd09ToGcj02:CLLocationCoordinate2DMake(_destLatitude, _destLongitude)];
    } else if ([_coordType isEqualToString:@"wgs84"]) {
      coor = [JZLocationConverter wgs84ToGcj02:CLLocationCoordinate2DMake(_destLatitude, _destLongitude)];
    } else {
      coor = CLLocationCoordinate2DMake(_destLatitude, _destLongitude);
    }
    MKMapItem *destItem = [[MKMapItem alloc] initWithPlacemark:[[MKPlacemark alloc] initWithCoordinate:coor addressDictionary:nil]];
    destItem.name = _destName;
    
    [MKMapItem openMapsWithItems:@[currentItem, destItem] launchOptions: @{MKLaunchOptionsDirectionsModeKey: MKLaunchOptionsDirectionsModeDriving,
                                                                         MKLaunchOptionsShowsTrafficKey: [NSNumber numberWithBool:YES]}];
    
  }];
  
  [alertVC addAction: appleNavi];
  
  UIApplication *application = [UIApplication sharedApplication];
  
//  要调起外置地图导航，保证下面两项在info.plist里已经设置好
//  <key>NSLocationWhenInUseUsageDescription</key>
//  <string>xxxx</string>
//  
//  <key>LSApplicationQueriesSchemes</key>
//  <array>
//		<string>baidumap</string>
//		<string>iosamap</string>
//  </array>

  NSURL *gdUrl = [NSURL URLWithString:@"iosamap://"];
  NSURL *bdUrl = [NSURL URLWithString:@"baidumap://"];
  
  // 设置高德地图导航
  //  style 导航方式
  //  0 速度快
  //  1 费用少
  //  2 路程短
  //  3 不走高速
  //  4 躲避拥堵
  //  5 不走高速且避免收费
  //  6 不走高速且躲避拥堵
  //  7 躲避收费和拥堵
  //  8 不走高速躲避收费和拥堵
  if ([application canOpenURL:gdUrl]) {
    UIAlertAction *gdNavi = [UIAlertAction actionWithTitle:@"使用高德地图导航"
                                                     style:UIAlertActionStyleDefault
                                                   handler:^(UIAlertAction * _Nonnull action)
    {
      CLLocationCoordinate2D coor;
      int dev = 0; // dev=0表示不需要国测局加密，=1表示需要加密
      if ([_coordType isEqualToString:@"bd09"]) {
        coor = [JZLocationConverter bd09ToGcj02:CLLocationCoordinate2DMake(_destLatitude, _destLongitude)];
      } else if ([_coordType isEqualToString:@"gcj02"]) {
        coor = CLLocationCoordinate2DMake(_destLatitude, _destLongitude);
      } else {
        coor = CLLocationCoordinate2DMake(_destLatitude, _destLongitude);
        dev = 1;
      }
      NSString *urlString = [NSString stringWithFormat:@"iosamap://navi?sourceApplication=lab4&backScheme=backustech&lat=%f&lon=%f&dev=%d&style=2",  coor.latitude, coor.longitude, dev];
      //Swift: let urlStr = urlString.stringByAddingPercentEncodingWithAllowedCharacters(NSCharacterSet.URLQueryAllowedCharacterSet())
      urlString = [urlString stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
      NSURL *url = [NSURL URLWithString:urlString];
      
      [application openURL:url];
    }];

    [alertVC addAction:gdNavi];
  }
  
  
  // 设置百度地图导航
  // 如果地图SDK用的是百度地图SDK coord_type请填bd09ll 否则 就填gcj02
  if ([application canOpenURL:bdUrl]) {
    UIAlertAction *bdNavi = [UIAlertAction actionWithTitle:@"使用百度地图导航"
                                                     style:UIAlertActionStyleDefault
                                                   handler:^(UIAlertAction * _Nonnull action)
    {
      if ([_coordType isEqualToString:@"bd09"]) {
        _coordType = @"bd09ll";
      }
      NSString *urlString = [NSString stringWithFormat:@"baidumap://map/direction?origin={{我的位置}}&destination=latlng:%f,%f|name=%@&mode=driving&coord_type=%@",_destLatitude, _destLongitude, _destName, _coordType];
      urlString = [urlString stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
      NSURL *url = [NSURL URLWithString:urlString];
      
      [application openURL:url];
    }];
    
    [alertVC addAction:bdNavi];
  }
  
  // 取消
  UIAlertAction *cancelAction = [UIAlertAction actionWithTitle:@"取消"
                                                         style:UIAlertActionStyleCancel
                                                       handler:nil];
  
  [alertVC addAction:cancelAction];
  
  dispatch_async(dispatch_get_main_queue(), ^{
    [RCTPresentedViewController() presentViewController:alertVC animated:YES completion:nil];
  });
  
}

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

@end
