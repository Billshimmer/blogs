//
//  TitleAnnotationView.h
//  lab4
//
//  Created by 周泽勇 on 2016/12/28.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import <BaiduMapAPI_Base/BMKBaseComponent.h>
#import <BaiduMapAPI_Search/BMKSearchComponent.h>
#import <BaiduMapAPI_Map/BMKAnnotationView.h>

@interface TitleAnnotationView : BMKAnnotationView
@property(nonatomic, retain) UIImageView* imageView;
@property(nonatomic, retain) UILabel* titleLabel;
@end
