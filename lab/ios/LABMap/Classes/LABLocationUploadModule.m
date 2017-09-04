//
//  LABLocationUploadManager.m
//  lab4
//
//  Created by QuanThomas on 16/7/7.
//  Copyright © 2016年 Facebook. All rights reserved.
//

/*
 1. 如果用户的位置在持续变化 则隔一段时间上报一次
 　　由于我们希望能够实时的将用户的位置变化反馈在APP里 所以定时的上报是刚需
 
 2. 如果用户的移动速度很慢 则隔一段距离上报一次
 　　如果用户是低速率的状态(比如步行的移动速度大概就是1m/s左右) 这个时候如果还按(1)中的方式来上报的话 由于变化太小 地图上的点会非常的密集 这种数据的意义不大(而且如果要做轨迹服务的话 这些密集点都是必须优化掉的) 所以这时候我们按照距离间隔来上报
 
 3. 如果用户的位置在到达某处后没有变化 则不继续上报
 　　我们只关心位置的变化 如果用户的位置没有变化或者变化很小 其实是不需要上报其位置的(比如进入的公司 或者等一个很长时间的红灯) 这时候我们就不上报(以达到省电的目的)
 
 4. 切换到后台也要能定位上报
 　　后台上报是必须的 用户不可能一直运行着APP (iOS4开始就支持了)
 
 5. APP因各种原因终止运行后(用户主动关闭, 系统杀掉) 也要能定位上报
 　　用户主动关闭APP的几率不大 但是因系统调度被杀掉的情况是很普遍的 这个时候我们也要能够上报 (iOS7开始已支持被杀掉后唤醒)
 */


#import "LABLocationUploadModule.h"
#import "JZLocationConverter.h"
#import "AFNetworking.h"

@interface LABLocationUploadModule()

@property (nonatomic, assign) UIBackgroundTaskIdentifier backgroundTask;

@property (nonatomic, assign) CGFloat minSpeed;    //最小速度
@property (nonatomic, assign) CGFloat minFilter;   //最小范围
@property (nonatomic, assign) CGFloat minInteval;  //更新间隔

@property (nonatomic, strong) NSString *UPLOADURL;

@property (nonatomic) CLLocationDegrees latitude;
@property (nonatomic) CLLocationDegrees longitude;
@property (nonatomic) NSString *address;

@end

@implementation LABLocationUploadModule
{
  BMKGeoCodeSearch *_geoCodeSearch;
  RCTResponseSenderBlock _callback;
  CLLocation *_currentLocation;
  NSDictionary *_body;
  CLLocationCoordinate2D _coor;
}

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(startUpdatingLocation:(NSString *)uploadURL)
{
  LABLocationUploadModule *locationModule = [LABLocationUploadModule sharedInstance];
  locationModule.UPLOADURL = uploadURL;
  
  [[NSUserDefaults standardUserDefaults] setObject:uploadURL forKey:@"UPLOADURL"];
  [[NSUserDefaults standardUserDefaults] synchronize];
  
#if __IPHONE_OS_VERSION_MAX_ALLOWED >= 80000
  if ([locationModule respondsToSelector:@selector(requestAlwaysAuthorization)]) {
    [locationModule requestAlwaysAuthorization];
  }
#endif
  
#if __IPHONE_OS_VERSION_MAX_ALLOWED >= 90000
  if ([locationModule respondsToSelector:@selector(setAllowsBackgroundLocationUpdates:)]) {
    [locationModule setAllowsBackgroundLocationUpdates:YES];
  }
#endif
  
  if ([locationModule respondsToSelector:@selector(startUpdatingLocation)]) {
    [locationModule startUpdatingLocation];
  }
}

RCT_EXPORT_METHOD(stopUpdatingLocation) {
  LABLocationUploadModule *locationModule = [LABLocationUploadModule sharedInstance];
  if ([locationModule respondsToSelector:@selector(stopUpdatingLocation)]) {
    [locationModule stopUpdatingLocation];
  }
}

- (instancetype)init {
  self = [super init];
  if (self) {
    self.minSpeed = 10;
    self.minFilter = 50;
    self.minInteval = 50;
    self.delegate = self;
    self.distanceFilter = self.minFilter;
    self.desiredAccuracy = kCLLocationAccuracyBest;
  }
  return self;
}

+ (instancetype)sharedInstance {
  static LABLocationUploadModule* _mmLocation = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    _mmLocation = [[self alloc] init];
  });
  return _mmLocation;
}


- (void)locationManager:(CLLocationManager *)manager didUpdateLocations:(NSArray *)locations {
  
  _currentLocation = [locations lastObject];
  
  if (_currentLocation == nil) {
    return;
  }
  
  //根据实际情况来调整触发范围
  [self adjustDistanceFilter: _currentLocation];
  
  CLLocationCoordinate2D wgs84Coor = CLLocationCoordinate2DMake(_currentLocation.coordinate.latitude, _currentLocation.coordinate.longitude);
  _coor = [JZLocationConverter wgs84ToBd09:wgs84Coor];
  _geoCodeSearch = [[BMKGeoCodeSearch alloc] init];
  _geoCodeSearch.delegate = self;
  BMKReverseGeoCodeOption *reverseGeoCodeSearchOption = [[BMKReverseGeoCodeOption alloc] init];
  reverseGeoCodeSearchOption.reverseGeoPoint = _coor;
  BOOL flag = [_geoCodeSearch reverseGeoCode:reverseGeoCodeSearchOption];
}

//接收反向地理编码结果
-(void) onGetReverseGeoCodeResult:(BMKGeoCodeSearch *)searcher
                           result:(BMKReverseGeoCodeResult *)result
                        errorCode:(BMKSearchErrorCode)error
{
  if (error == BMK_SEARCH_NO_ERROR) {
    //在此处理正常结果
    
    _body = @{@"longitude": [NSString stringWithFormat:@"%f", _coor.longitude],
              @"latitude": [NSString stringWithFormat:@"%f", _coor.latitude],
              @"address": result.address};
    [self uploadLocation];
  }
  else {
    
    NSLog(@"抱歉，未找到结果");
  }
}

/**
 *  规则: 如果速度小于minSpeed m/s 则把触发范围设定为50m
 *  否则将触发范围设定为minSpeed*minInteval
 *  此时若速度变化超过10% 则更新当前的触发范围(这里限制是因为不能不停的设置distanceFilter,
 *  否则uploadLocation会不停被触发)
 */
- (void)adjustDistanceFilter:(CLLocation*)location {
  NSLog(@"当前速度: %f\n", location.speed);
  NSLog(@"当前范围: %f\n", self.distanceFilter);
  
  
  if (location.speed < self.minSpeed) {
    if ( fabs(self.distanceFilter-self.minFilter) > 0.1f ) {
      self.distanceFilter = self.minFilter;
    }
  } else {
    CGFloat lastSpeed = self.distanceFilter/self.minInteval;
    
    if ( (fabs(lastSpeed-location.speed)/lastSpeed > 0.1f) || (lastSpeed < 0) ) {
      CGFloat newSpeed = (int)(location.speed+0.5f);
      CGFloat newFilter = newSpeed*self.minInteval;
      
      self.distanceFilter = newFilter;
    }
  }
}

- (void)uploadLocation {
  
  // uploading
  if ([[UIApplication sharedApplication] applicationState] == UIApplicationStateActive) {
    
    [self upload];
    [self endBackgroudUploadTask];
    
  } else {
    // In Background
    // 加入上一次操作尚未结束，则直接return
    if (self.backgroundTask != UIBackgroundTaskInvalid) {
      return;
    }
    [self beginBackgroundUploadTask];
    
    [self upload];
    
    [self endBackgroudUploadTask];
  }
  
}

- (void)upload {
  
  NSString *UPLOADURL = [LABLocationUploadModule sharedInstance].UPLOADURL;
  
  if (UPLOADURL == nil) {
    UPLOADURL = [[NSUserDefaults standardUserDefaults] objectForKey:@"UPLOADURL"];
  }
  
  if (UPLOADURL == nil) {
    return;
  }
  
  void (^success)(id) = ^(id  _Nullable responseObject) {
    
  };
  
  void (^failure)(NSError *) = ^(NSError * _Nonnull error) {
    
  };
  
  dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
    [self postRequest:UPLOADURL body:_body success:success failure:failure];
  });
}

- (void)postRequest:(NSString *)urlStr
               body:(NSDictionary *)body
            success:(void (^)(id responseObject))success
            failure:(void (^)(NSError *error))failure
{
  AFHTTPSessionManager *mgr = [AFHTTPSessionManager new];
  
  mgr.requestSerializer = [AFJSONRequestSerializer serializer];
  mgr.responseSerializer = [AFJSONResponseSerializer serializer];
  
  [mgr POST:urlStr parameters:body progress:^(NSProgress * _Nonnull uploadProgress) {
    
  } success:^(NSURLSessionDataTask * _Nonnull task, id  _Nullable responseObject) {
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
      success(responseObject);
    });
  } failure:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
    failure(error);
  }];
}

- (void)beginBackgroundUploadTask {
  self.backgroundTask = [[UIApplication sharedApplication] beginBackgroundTaskWithExpirationHandler:^{
    [self endBackgroudUploadTask];
  }];
}

- (void)endBackgroudUploadTask {
  if (self.backgroundTask != UIBackgroundTaskInvalid) {
    [[UIApplication sharedApplication] endBackgroundTask:self.backgroundTask];
    self.backgroundTask = UIBackgroundTaskInvalid;
  }
}

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

@end
