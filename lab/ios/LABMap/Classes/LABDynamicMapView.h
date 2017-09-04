//
//  LABDynamicMapView.h
//  lab4
//
//  Created by 周泽勇 on 2017/1/3.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import <BaiduMapAPI_Map/BMKMapView.h>
#import <React/RCTViewManager.h>
#import "LABDynamicMapView.h"
#import "Masonry.h"
#import <BaiduMapAPI_Utils/BMKGeometry.h>
#import <BaiduMapAPI_Map/BMKPointAnnotation.h>
#import <BaiduMapAPI_Map/BMKPolygon.h>
#import <BaiduMapAPI_Map/BMKPolygonView.h>
#import <BaiduMapAPI_Base/BMKBaseComponent.h>
#import <BaiduMapAPI_Map/BMKMapComponent.h>
#import <BaiduMapAPI_Search/BMKSearchComponent.h>
#import <BaiduMapAPI_Location/BMKLocationComponent.h>


@interface LABDynamicMapView : BMKMapView<BMKLocationServiceDelegate>
@property(nonatomic, copy) RCTBubblingEventBlock onAnnotationPress;
@property(nonatomic, retain) UIButton* locationButton;
@property(nonatomic, retain) UIButton* zoomOutButton;
@property(nonatomic, retain) UIButton* zoomInButton;
@property(nonatomic, retain) BMKLocationService *locationService;
@property(nonatomic, assign) BOOL followUserLocation;
@property(nonatomic, assign) BOOL showsCompass;
@property(nonatomic, assign) BOOL pitchEnabled;
@property(nonatomic, assign) BOOL showZoomControls;
@property(nonatomic, assign) BOOL showsLocateButton;
@property(nonatomic, assign) BOOL locateInitialRegion;
- (void) locate;
@end
