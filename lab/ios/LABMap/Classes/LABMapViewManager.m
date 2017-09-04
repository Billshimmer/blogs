//
//  LABMapViewManager.m
//  lab4
//
//  Created by 周泽勇 on 2017/1/5.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "LABMapViewManager.h"
#import <BaiduMapAPI_Base/BMKBaseComponent.h>
#import <BaiduMapAPI_Search/BMKSearchComponent.h>
#import "LABMapView.h"
#import "BMKHelper.h"
#import "TitleAnnotationView.h"
#import <BaiduMapAPI_Map/BMKMapView.h>
#import <BaiduMapAPI_Utils/BMKGeometry.h>
#import <BaiduMapAPI_Map/BMKPointAnnotation.h>
#import <BaiduMapAPI_Map/BMKPolygon.h>
#import <BaiduMapAPI_Map/BMKPolygonView.h>
#import <BaiduMapAPI_Base/BMKBaseComponent.h>
#import <BaiduMapAPI_Map/BMKMapComponent.h>
#import <BaiduMapAPI_Search/BMKSearchComponent.h>
#import <BaiduMapAPI_Location/BMKLocationComponent.h>

@interface LABMapViewManager ()<BMKMapViewDelegate>
@property(nonatomic, retain) NSString* url;
@property(nonatomic, retain) BMKMapManager* mapManager;
@property(nonatomic, assign) BMKCoordinateRegion currentRegion;
@property(nonatomic, retain) NSMutableDictionary* annotations;
@property(nonatomic, retain) NSMutableArray* annotationsJsonValue;
@property(nonatomic, retain) NSArray* layers;
@property(nonatomic, retain) NSString* query;
@property(nonatomic, assign) NSInteger currentPage;
@end

@implementation LABMapViewManager
RCT_EXPORT_MODULE()
RCT_EXPORT_VIEW_PROPERTY(showsUserLocation, BOOL)
RCT_EXPORT_VIEW_PROPERTY(followUserLocation, BOOL)
RCT_EXPORT_VIEW_PROPERTY(showsCompass, BOOL)
RCT_EXPORT_VIEW_PROPERTY(zoomEnabled, BOOL)
RCT_EXPORT_VIEW_PROPERTY(rotateEnabled, BOOL)
RCT_EXPORT_VIEW_PROPERTY(pitchEnabled, BOOL)
RCT_EXPORT_VIEW_PROPERTY(scrollEnabled, BOOL)
RCT_EXPORT_VIEW_PROPERTY(showsLocateButton, BOOL)
RCT_EXPORT_VIEW_PROPERTY(showZoomControls, BOOL)
RCT_EXPORT_VIEW_PROPERTY(locateInitialRegion, BOOL)
RCT_CUSTOM_VIEW_PROPERTY(mapType, NSString, LABDynamicMapView) {
  NSString* mapTypeValue = [RCTConvert NSString:json];
  if([mapTypeValue isEqualToString:@"standard"]) {
    view.mapType = BMKMapTypeStandard;
  }else if([mapTypeValue isEqualToString:@"satellite"]) {
    view.mapType = BMKMapTypeSatellite;
  }
}

RCT_CUSTOM_VIEW_PROPERTY(annotations, NSArray, LABDynamicMapView) {
  NSArray* annotations = [RCTConvert NSArray:json];
  NSMutableDictionary* annotationCopy = [self.annotations mutableCopy];
  for (NSDictionary* annotationValue in annotations) {
    NSString* key = [annotationValue objectForKey:@"__$id"];
    BMKPointAnnotation* annotation = [self.annotations objectForKey:key];
    if (!annotation) {
      annotation = [[BMKPointAnnotation alloc] init];
      CLLocationCoordinate2D coor;
      coor.latitude = [[annotationValue objectForKey:@"latitude"] doubleValue];
      coor.longitude = [[annotationValue objectForKey:@"longitude"] doubleValue];
      annotation.coordinate = coor;
      annotation.title = [annotationValue objectForKey:@"title"];
      [self.annotations setObject:annotation forKey:key];
      [view addAnnotation:annotation];
    }else {
      [annotationCopy removeObjectForKey:key];
    }
  }
  for (NSString* key in annotationCopy.allKeys) {
    BMKPointAnnotation* annotation = [annotationCopy objectForKey:key];
    [view removeAnnotation:annotation];
  }
}

RCT_CUSTOM_VIEW_PROPERTY(region, NSDictionary, LABDynamicMapView) {
  NSDictionary* value = [RCTConvert NSDictionary:json];
  CLLocationDegrees latitude = [[value objectForKey:@"latitude"] doubleValue];
  CLLocationDegrees longitude = [[value objectForKey:@"longitude"] doubleValue];
  CLLocationDegrees latitudeDelta = [[value objectForKey:@"latitudeDelta"] doubleValue];
  CLLocationDegrees longitudeDelta = [[value objectForKey:@"longitudeDelta"] doubleValue];

  //zoom to sefiticate area
  CLLocationCoordinate2D centerCoordinate = CLLocationCoordinate2DMake(latitude, longitude);
  BMKCoordinateSpan span = BMKCoordinateSpanMake(latitudeDelta, longitudeDelta);
  BMKCoordinateRegion region = BMKCoordinateRegionMake(centerCoordinate, span);
  view.region = region;
}

#pragma mark - BMKMapViewDelegate
- (BMKAnnotationView*) mapView:(BMKMapView *)mapView viewForAnnotation:(id<BMKAnnotation>)annotation {
  if ([annotation isKindOfClass:[BMKPointAnnotation class]]) {
    BMKAnnotationView* annotationView = [[BMKAnnotationView alloc] initWithAnnotation:annotation reuseIdentifier:@"FCMapViewManagerAnnotationIdentifier"];
    annotationView.image =  [UIImage imageNamed:@"icon_pin_shadow"];
    return annotationView;
  }
  return nil;
}

- (UIView*) view {
  LABMapView* mapView = [[LABMapView alloc] init];
  mapView.delegate = self;
  return  mapView;
}

- (NSMutableDictionary*) annotations {
  if (!_annotations) {
    _annotations = [NSMutableDictionary dictionary];
  }
  return _annotations;
}

@end
