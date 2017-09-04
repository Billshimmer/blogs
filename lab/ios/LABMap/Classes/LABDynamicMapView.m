//
//  LABDynamicMapView.m
//  lab4
//
//  Created by 周泽勇 on 2017/1/3.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "LABDynamicMapView.h"
#import "Masonry.h"


@implementation LABDynamicMapView

- (instancetype) init {
  self = [super init];
  if (self) {
    [self setupLABDynamicMapView];
  }
  return self;
}

- (instancetype) initWithCoder:(NSCoder *)aDecoder {
  self = [super initWithCoder:aDecoder];
  if (self) {
    [self setupLABDynamicMapView];
  }
  return self;
}

- (instancetype) initWithFrame:(CGRect)frame {
  self = [super initWithFrame:frame];
  if (self) {
    [self setupLABDynamicMapView];
  }
  return self;
}

- (void) setupLABDynamicMapView {
  [self addSubview:self.locationButton];
  [self addSubview:self.zoomOutButton];
  [self addSubview:self.zoomInButton];
  self.userTrackingMode = BMKUserTrackingModeFollow;
  [self.locationButton mas_makeConstraints:^(MASConstraintMaker *make) {
    make.leading.equalTo(self).offset(10);
    make.bottom.equalTo(self).offset(-20);
    make.width.height.equalTo(@30);
  }];
  
  [self.zoomInButton mas_makeConstraints:^(MASConstraintMaker *make) {
    make.trailing.equalTo(self).offset(-10);
    make.bottom.equalTo(self).offset(-10);
    make.width.height.equalTo(@24);
  }];
  
  [self.zoomOutButton mas_makeConstraints:^(MASConstraintMaker *make) {
    make.trailing.equalTo(self).offset(-10);
    make.bottom.equalTo(self.zoomInButton.mas_top);
    make.width.height.equalTo(@24);
  }];
}

#pragma mark - BMKLocationServiceDelegate
- (void) didUpdateBMKUserLocation:(BMKUserLocation *)userLocation {
  [self updateLocationData:userLocation];
}

- (void) zoomIn:(UIButton*) sender {
  [self zoomIn];
}

- (void) zoomOut:(UIButton*) sender {
  [self zoomOut];
}

- (void) locateUserPosition:(UIButton*) sender {
  if (!sender.isSelected) {
    [self.locationService startUserLocationService];
    self.userTrackingMode = BMKUserTrackingModeFollow;
    self.showsUserLocation = YES;
  }else {
    [self.locationService stopUserLocationService];
    self.showsUserLocation = NO;
  }
  sender.selected = !sender.selected;
}

- (void) locate {
  [self.locationService startUserLocationService];
  self.userTrackingMode = BMKUserTrackingModeFollow;
  self.showsUserLocation = YES;
  self.locationButton.selected = YES;
}

- (UIButton*) locationButton {
  if (!_locationButton) {
    _locationButton = [[UIButton alloc] initWithFrame:CGRectZero];
    [_locationButton setImage:[UIImage imageNamed:@"drawable_rg_ic_locate_car_point"] forState:UIControlStateNormal];
    _locationButton.backgroundColor = [UIColor whiteColor];
    _locationButton.layer.shadowColor = [UIColor blackColor].CGColor;
    _locationButton.layer.shadowRadius = 3;
    _locationButton.layer.shadowOffset = CGSizeMake(2, 3);
    _locationButton.layer.cornerRadius = 5;
    [_locationButton addTarget:self action:@selector(locateUserPosition:) forControlEvents:UIControlEventTouchUpInside];
  }
  return _locationButton;
}

- (UIButton*) zoomInButton {
  if (!_zoomInButton) {
    _zoomInButton = [[UIButton alloc] initWithFrame:CGRectZero];
    [_zoomInButton setImage:[UIImage imageNamed:@"nearby_btn_zoomin"] forState:UIControlStateNormal];
    _zoomInButton.backgroundColor = [UIColor whiteColor];
    [_zoomInButton addTarget:self action:@selector(zoomIn:) forControlEvents:UIControlEventTouchUpInside];
  }
  return _zoomInButton;
}

- (void) setShowsCompass:(BOOL)showsCompass {
  _showsCompass = showsCompass;
#pragma mark - TODO: show compass
}

- (void) setShowZoomControls:(BOOL)showZoomControls {
  _showZoomControls = showZoomControls;
  self.zoomInButton.hidden = !showZoomControls;
  self.zoomOutButton.hidden = !showZoomControls;
}

- (void) setShowsLocateButton:(BOOL)showsLocateButton {
  _showsLocateButton = showsLocateButton;
  self.locationButton.hidden = !showsLocateButton;
}

- (void) setLocateInitialRegion:(BOOL)locateInitialRegion {
  _locateInitialRegion = locateInitialRegion;
  if (locateInitialRegion) {
    [self locate];
  }
}

- (BMKLocationService*) locationService {
  if (!_locationService) {
    _locationService = [[BMKLocationService alloc] init];
    _locationService.delegate = self;
  }
  return _locationService;
}

- (UIButton*) zoomOutButton {
  if (!_zoomOutButton) {
    _zoomOutButton = [[UIButton alloc] initWithFrame:CGRectZero];
    [_zoomOutButton setImage:[UIImage imageNamed:@"nearby_btn_zoomout"] forState:UIControlStateNormal];
    _zoomOutButton.backgroundColor = [UIColor whiteColor];
    [_zoomOutButton addTarget:self action:@selector(zoomOut:) forControlEvents:UIControlEventTouchUpInside];
  }
  return _zoomOutButton;
}
@end
