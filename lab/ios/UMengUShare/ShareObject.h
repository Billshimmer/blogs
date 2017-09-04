//
//  ShareObject.h
//  lab4
//
//  Created by QuanThomas on 2016/11/4.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface InformationObject : NSObject

@property (nonatomic, copy) NSString *url;
@property (nonatomic, copy) NSString *content;
@property (nonatomic, copy) NSString *title;
@property (nonatomic, copy) NSString *imageUrl;

@end

@interface ShareObject : NSObject

@property (nonatomic, strong) NSArray *platforms;
@property (nonatomic, copy)   NSString *platform;

@property (nonatomic, strong) InformationObject *informations;

@end
