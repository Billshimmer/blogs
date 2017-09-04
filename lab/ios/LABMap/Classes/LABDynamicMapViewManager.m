//
//  LABDynamicMapViewManager.m
//  lab4
//
//  Created by 周泽勇 on 2016/12/27.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "LABDynamicMapViewManager.h"
#import "TitleAnnotationView.h"
#import "LABDynamicMapView.h"
#import "Masonry.h"
#import "BMKHelper.h"
#import <BaiduMapAPI_Map/BMKMapView.h>
#import <BaiduMapAPI_Utils/BMKGeometry.h>
#import <BaiduMapAPI_Map/BMKPointAnnotation.h>
#import <BaiduMapAPI_Map/BMKPolygon.h>
#import <BaiduMapAPI_Map/BMKPolygonView.h>
#import <BaiduMapAPI_Base/BMKBaseComponent.h>
#import <BaiduMapAPI_Map/BMKMapComponent.h>
#import <BaiduMapAPI_Search/BMKSearchComponent.h>
#import <BaiduMapAPI_Location/BMKLocationComponent.h>

@interface LABDynamicMapViewManager ()<BMKMapViewDelegate>
@property(nonatomic, retain) LABDynamicMapView* mapView;

@property(nonatomic, retain) NSString* url;
@property(nonatomic, retain) NSArray* layers;
@property(nonatomic, retain) NSString* query;
@property(nonatomic, retain) NSMutableDictionary* annotations;
@property(nonatomic, retain) BMKMapManager* mapManager;
@property(nonatomic, assign) BMKCoordinateRegion currentRegion;

@end

@implementation LABDynamicMapViewManager
RCT_EXPORT_MODULE()
RCT_EXPORT_VIEW_PROPERTY(showsLocateButton, BOOL)
RCT_EXPORT_VIEW_PROPERTY(showZoomControls, BOOL)
RCT_CUSTOM_VIEW_PROPERTY(layers, NSArray, BMKMapView) {
  self.layers = [RCTConvert NSArray:json];
  NSDictionary* value = [self.layers firstObject];
  NSString* url = [value objectForKey:@"url"];
  self.url = url;
  float minZoom = [[value objectForKey:@"minZoom"] floatValue];
  float maxZoom = [[value objectForKey:@"maxZoom"] floatValue];
  
  CLLocationDegrees minLongitude = [[value objectForKey:@"minLongitude"] doubleValue];
  CLLocationDegrees minLatitude = [[value objectForKey:@"minLatitude"] doubleValue];
  CLLocationDegrees maxLongitude = [[value objectForKey:@"maxLongitude"] doubleValue];
  CLLocationDegrees maxLatitude = [[value objectForKey:@"maxLatitude"] doubleValue];
  [self.mapView setMaxZoomLevel:maxZoom];
  [self.mapView setMinZoomLevel:minZoom];
  //zoom to sefiticate area
  CLLocationRectDegrees rectDegrees = CLLocationRectDegreesMake(minLongitude, minLatitude, maxLongitude, maxLatitude);
  BMKCoordinateRegion region = CLLocationRectDegreesToBMKCoordinateRegion(rectDegrees);
  //self.mapView.region = region;
}

RCT_CUSTOM_VIEW_PROPERTY(query, NSString, BMKMapView) {
  self.query = [RCTConvert NSString:json];
}

RCT_EXPORT_VIEW_PROPERTY(showsUserLocation, BOOL)
RCT_EXPORT_VIEW_PROPERTY(followUserLocation, BOOL)
RCT_EXPORT_VIEW_PROPERTY(showsCompass, BOOL)
RCT_EXPORT_VIEW_PROPERTY(zoomEnabled, BOOL)
RCT_EXPORT_VIEW_PROPERTY(rotateEnabled, BOOL)
RCT_EXPORT_VIEW_PROPERTY(pitchEnabled, BOOL)
RCT_EXPORT_VIEW_PROPERTY(scrollEnabled, BOOL)
RCT_EXPORT_VIEW_PROPERTY(locateInitialRegion, BOOL)
RCT_EXPORT_VIEW_PROPERTY(mapType, NSString)
RCT_EXPORT_VIEW_PROPERTY(onAnnotationPress, RCTBubblingEventBlock)

- (UIView*) view {
  return self.mapView;
}

RCT_EXPORT_METHOD(locate) {
  [self.mapView locate];
}

#pragma mark - BMKMapViewDelegate
- (void) mapView:(BMKMapView *)mapView regionDidChangeAnimated:(BOOL)animated {
  // 扩大一次性请求的区域，下次滑动如果还在这个范围内的就不请求
  BMKCoordinateRegion region = mapView.region;
  CGRect rect1 = BMKCoordinateRegionToCGRect(region);
  CGRect rect2 = BMKCoordinateRegionToCGRect(self.currentRegion);
  if (!CGRectContainsRect(rect1, rect2) || self.annotations.count == 0) {
    BMKCoordinateSpan span = BMKCoordinateSpanMake(region.span.latitudeDelta*2.0f, region.span.longitudeDelta*2.0f);
    self.currentRegion = BMKCoordinateRegionMake(region.center, span);
    //[self drawRegion:self.currentRegion];
    CLLocationRectDegrees rectDegrees = BMKCoordinateRegionToCLLocationRectDegrees(self.currentRegion);
    [self queryAnnotationsWithRectDegrees:rectDegrees];
  }
}

- (void) drawRegion:(BMKCoordinateRegion) region {
  CLLocationCoordinate2D leftTop = CLLocationCoordinate2DMake(region.center.latitude - region.span.latitudeDelta*0.5f, region.center.longitude - region.span.longitudeDelta*0.5f);
  CLLocationCoordinate2D rightTop = CLLocationCoordinate2DMake(region.center.latitude - region.span.latitudeDelta*0.5f, region.center.longitude + region.span.longitudeDelta*0.5f);
  CLLocationCoordinate2D rightBottom = CLLocationCoordinate2DMake(region.center.latitude + region.span.latitudeDelta*0.5f, region.center.longitude + region.span.longitudeDelta*0.5f);
  CLLocationCoordinate2D leftBottom = CLLocationCoordinate2DMake(region.center.latitude + region.span.latitudeDelta*0.5f, region.center.longitude - region.span.longitudeDelta*0.5f);
  CLLocationCoordinate2D coors[4] = {0};
  coors[0] = leftTop;
  coors[1] = rightTop;
  coors[2] = rightBottom;
  coors[3] = leftBottom;
  BMKPolygon* polygon = [BMKPolygon polygonWithCoordinates:coors count:4];
  [self.mapView addOverlay:polygon];
}

- (BMKAnnotationView*) mapView:(BMKMapView *)mapView viewForAnnotation:(id<BMKAnnotation>)annotation {
  if ([annotation isKindOfClass:[BMKPointAnnotation class]]) {
    TitleAnnotationView* annotationView = [[TitleAnnotationView alloc] initWithAnnotation:annotation reuseIdentifier:@"FCMapViewManagerAnnotationIdentifier"];
    annotationView.imageView.image = [UIImage imageNamed:@"icon_location_company"];
    annotationView.titleLabel.text = annotation.title;
    annotationView.canShowCallout = NO;
    annotationView.image =  [UIImage imageNamed:@"icon_location_company"];
    return annotationView;
  }
  return nil;
}

- (void) mapView:(BMKMapView *)mapView didSelectAnnotationView:(BMKAnnotationView *)view {
  if (!self.mapView.onAnnotationPress) {
    return;
  }
  if ([view.annotation isKindOfClass:[BMKPointAnnotation class]]) {
    BMKPointAnnotation* annotation = (BMKPointAnnotation*) view.annotation;
    self.mapView.onAnnotationPress(@{@"annotationId":annotation.subtitle});
  }
}

- (BMKOverlayView*) mapView:(BMKMapView *)mapView viewForOverlay:(id<BMKOverlay>)overlay {
  if ([overlay isKindOfClass:[BMKPolygon class]]) {
    BMKPolygonView* polygonView = [[BMKPolygonView alloc] initWithOverlay:overlay] ;
    polygonView.strokeColor = [[UIColor purpleColor] colorWithAlphaComponent:1];
    polygonView.lineWidth = 5.0;
    return polygonView;
  }
  return nil;
}

- (void) queryAnnotationsWithRectDegrees:(CLLocationRectDegrees) rectDegrees {
  NSString* url = [NSString stringWithFormat:@"%@?bounds=%f,%f;%f,%f",self.url,rectDegrees.minLongitude, rectDegrees.minLatitude, rectDegrees.maxLongitude, rectDegrees.maxLatitude];
  NSURLSession* session = [NSURLSession sharedSession];
  NSURLSessionDataTask* dataTask = [session dataTaskWithURL:[NSURL URLWithString:url] completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error) {
    if (error != nil) {
      NSLog(@"%@", error.localizedDescription);
      return;
    }
    NSError* err = nil;
    NSDictionary* jsonValue = [NSJSONSerialization JSONObjectWithData:data options:NSJSONReadingMutableLeaves error:&err];
    if (err) {
      NSLog(@"%@", err.localizedDescription);
      return;
    }
    NSLog(@"%@", jsonValue);
    if ([[jsonValue objectForKey:@"CODE"] isEqualToString:@"ok"]) {
      dispatch_async(dispatch_get_main_queue(), ^{
        [self renderAnnotations:[[jsonValue objectForKey:@"DATA"] objectForKey:@"list"]];
      });
    }else {
      NSLog(@"%@", [jsonValue objectForKey:@"message"]);
    }
  }];
  [dataTask resume];
}

- (void) renderAnnotations:(NSArray*) annotations {
  NSMutableArray* currentAnnotations = [NSMutableArray array];
  for (NSDictionary* value in annotations) {
    NSString* identity = [value objectForKey:@"id"];
    [currentAnnotations addObject:identity];
    BMKPointAnnotation* annotation = [self.annotations objectForKey:identity];
    if (!annotation) {
      annotation = [[BMKPointAnnotation alloc] init];
      CLLocationCoordinate2D coor;
      coor.latitude = [[value objectForKey:@"y"] doubleValue];
      coor.longitude = [[value objectForKey:@"x"] doubleValue];
      annotation.coordinate = coor;
      annotation.title = [value objectForKey:@"title"];
      NSError* error = nil;
      NSData* data = [NSJSONSerialization dataWithJSONObject:value options:NSJSONWritingPrettyPrinted error:&error];
      annotation.subtitle = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
      [self.mapView addAnnotation:annotation];
      [self.annotations setObject:annotation forKey:identity];
    }
  }
  if (self.annotations.count > 100) {
    NSMutableDictionary* values = [self.annotations mutableCopy];
    [values removeObjectsForKeys:currentAnnotations];
    [self.mapView removeAnnotations:values.allValues];
    [self.annotations removeObjectsForKeys:values.allKeys];
  }
}

- (LABDynamicMapView*) mapView {
  if (!_mapView) {
    _mapView = [[LABDynamicMapView alloc] init];
    _mapView.delegate = self;
  }
  return _mapView;
}


- (NSMutableDictionary*) annotations {
  if (!_annotations) {
    _annotations = [NSMutableDictionary dictionary];
  }
  return _annotations;
}
@end
