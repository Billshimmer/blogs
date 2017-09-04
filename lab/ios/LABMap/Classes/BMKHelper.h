//
//  BMKHelper.h
//  lab4
//
//  Created by 周泽勇 on 2017/1/6.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import <BaiduMapAPI_Map/BMKMapView.h>
#import <BaiduMapAPI_Utils/BMKGeometry.h>
#import <BaiduMapAPI_Map/BMKPointAnnotation.h>
#import <BaiduMapAPI_Map/BMKPolygon.h>
#import <BaiduMapAPI_Map/BMKPolygonView.h>
#import <BaiduMapAPI_Base/BMKBaseComponent.h>
#import <BaiduMapAPI_Map/BMKMapComponent.h>
#import <BaiduMapAPI_Search/BMKSearchComponent.h>
#import <BaiduMapAPI_Location/BMKLocationComponent.h>

struct CLLocationRectDegrees {
  CLLocationDegrees minLongitude;
  CLLocationDegrees minLatitude;
  CLLocationDegrees maxLongitude;
  CLLocationDegrees maxLatitude;
};
typedef struct CLLocationRectDegrees CLLocationRectDegrees;

UIKIT_STATIC_INLINE CLLocationRectDegrees CLLocationRectDegreesMake(CLLocationDegrees minLongitude, CLLocationDegrees minLatitude, CLLocationDegrees maxLongitude, CLLocationDegrees maxLatitude) {
  CLLocationRectDegrees rectDegrees;
  rectDegrees.minLatitude = minLatitude;
  rectDegrees.minLongitude = minLongitude;
  rectDegrees.maxLatitude = maxLatitude;
  rectDegrees.maxLongitude = maxLongitude;
  return rectDegrees;
}

UIKIT_STATIC_INLINE CLLocationRectDegrees BMKCoordinateRegionToCLLocationRectDegrees(BMKCoordinateRegion region) {
  CLLocationDegrees maxLatitude = (region.span.latitudeDelta + 2*region.center.latitude)*0.5f;
  CLLocationDegrees minLatitude = region.center.latitude - region.span.latitudeDelta*0.5f;
  CLLocationDegrees maxLongitude = (region.span.longitudeDelta + 2*region.center.longitude)*0.5;
  CLLocationDegrees minLongitude = region.center.longitude - region.span.longitudeDelta*0.5;
  return CLLocationRectDegreesMake(minLongitude, minLatitude, maxLongitude, maxLatitude);
}

UIKIT_STATIC_INLINE BMKCoordinateRegion CLLocationRectDegreesToBMKCoordinateRegion(CLLocationRectDegrees rectDegrees) {
  CLLocationCoordinate2D centerCoor;
  centerCoor.latitude = (CLLocationDegrees)((rectDegrees.maxLatitude + rectDegrees.minLatitude) * 0.5f);
  centerCoor.longitude = (CLLocationDegrees)((rectDegrees.maxLongitude + rectDegrees.minLongitude) * 0.5f);
  BMKCoordinateSpan span;
  span.latitudeDelta = rectDegrees.maxLatitude - rectDegrees.minLatitude;
  span.longitudeDelta = rectDegrees.maxLongitude - rectDegrees.minLongitude;
  BMKCoordinateRegion region = BMKCoordinateRegionMake(centerCoor, span);
  return region;
}

UIKIT_STATIC_INLINE CGRect BMKCoordinateRegionToCGRect(BMKCoordinateRegion region) {
  double x = region.center.longitude - region.span.longitudeDelta*0.5f;
  double y = region.center.latitude - region.span.latitudeDelta*0.5f;
  return CGRectMake(x, y, region.span.longitudeDelta, region.span.latitudeDelta);
}

