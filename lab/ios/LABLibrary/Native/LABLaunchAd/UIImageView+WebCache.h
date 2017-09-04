//
//  UIImageView+WebCache.h
//  lab4
//
//  Created by QuanThomas on 16/9/12.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>

typedef NS_OPTIONS(NSUInteger, WebImageOptions) {
  WebImageDefault = 1 << 0,         // 有缓存,读取缓存,不重新加载,没缓存先加载,并缓存
  WebImageOnlyLoad = 1 << 1,        // 只加载,不缓存
  WebImageRefreshCached = 1 << 2    // 先读缓存,再加载刷新图片和缓存
};

typedef void(^WebImageCompletionBlock)(UIImage *image, NSURL *url);
typedef void(^Dispatch_asyncBlock)(UIImage *image, NSURL *url, NSData *data);
typedef void(^LocalImageComletionBlock)(UIImage *image);

@interface WebImageDownloader : NSObject

/**
 *  缓冲路径
 *
 *  @return 路径
 */
+ (NSString *)cacheImagePath;
/**
 *  检查目录
 *
 *  @param path 路径
 */
+(void)checkDirectory:(NSString *)path;
@end

@interface UIImage (GIF)
/**
 *  NSData -> UIImage
 *
 *  @param data Data
 *
 *  @return UIImage
 */
+ (UIImage *)gifWithData:(NSData *)data;
@end

@interface UIImageView (WebCache)

/**
 *  获取当前图像的URL
 */
- (NSURL *)imageURL;

/**
 *  异步加载网络图片+缓存
 *
 *  @param url            图片url
 *  @param placeholder    默认图片
 *  @param completedBlock 加载完成回调
 */
- (void)setImageWithURL:(NSURL *)url placeholderImage:(UIImage *)placeholderImage completed:(WebImageCompletionBlock)completedBlock;

/**
 *  异步加载网络图片+缓存
 *
 *  @param url            图片url
 *  @param placeholder    默认图片
 *  @param options        缓存机制
 *  @param completedBlock 加载完成回调
 */
- (void)setImageWithURL:(NSURL *)url placeholderImage:(UIImage *)placeholderImage options:(WebImageOptions)options completed:(WebImageCompletionBlock)completedBlock;

/**
 *  使用本地LaunchImage作为广告页
 *
 *  @param image LaunchImage
 */
- (void)setLocalImage:(UIImage *)image;

@end
