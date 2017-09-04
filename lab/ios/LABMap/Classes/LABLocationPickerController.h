//
//  LABLocationPicker.h
//  lab4
//
//  Created by QuanThomas on 2016/9/23.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "UIKit/UIKit.h"
#import <BaiduMapAPI_Base/BMKBaseComponent.h>//引入base相关所有的头文件
#import <BaiduMapAPI_Map/BMKMapComponent.h>//引入地图功能所有的头文件
#import <BaiduMapAPI_Search/BMKSearchComponent.h>//引入检索功能所有的头文件
#import <BaiduMapAPI_Location/BMKLocationComponent.h>//引入定位功能所有的头文件
#import "Masonry.h"
#import "LABLocationPickerDelegate.h"

NSString *cancelString = @"Cancel";

NSString *backImageName = @"ic_back";
NSString *pinImageName = @"icon_pin_shadow";
NSString *locateImageName = @"icon_locate";


@interface LABLocationPickerController : UIViewController

@property (nonatomic, weak) id<LABLocationPickerDelegate> delegate;

// View
@property (nonatomic, retain) BMKMapView *mapView;
@property (nonatomic, retain) UISearchBar *searchBar;
@property (nonatomic, retain) UISearchController *searchController;
@property (nonatomic, retain) UIButton *backBtn;
@property (nonatomic, retain) UITableView *poiInfoTable;
@property (nonatomic, retain) UITableView *suggestionTable;
@property (nonatomic, retain) UIImage *pinImage;
@property (nonatomic, retain) UIImage *toLocate;
@property (nonatomic, retain) UIImageView *imageView;

// Data
@property (nonatomic, copy) NSMutableArray *suggestionArr;
@property (nonatomic, copy) NSMutableArray *geoArr;
@property (nonatomic, copy) BMKSuggestionSearch *suggestion;
@property (nonatomic, copy) NSString *city;

// struct
@property (nonatomic, copy) BMKLocationService *locationService;
@property (nonatomic, copy) BMKUserLocation *lastUserLocation;
@property (nonatomic, copy) BMKPoiSearch *poiSearcher;
@property (nonatomic, copy) BMKCitySearchOption *option;
@property (nonatomic, copy) BMKGeoCodeSearch *geoSearcher;
@property (nonatomic, copy) BMKReverseGeoCodeOption *geo;
@property (nonatomic) CLLocationCoordinate2D coordinate;
@property (nonatomic) BOOL moveToUserLocation;

@end
