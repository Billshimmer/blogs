//
//  LABPhotoBrowser.m
//  lab4
//
//  Created by Thomas Quan on 2016/12/27.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "LABPhotoBrowser.h"

@interface LABPhotoBrowser() <MWPhotoBrowserDelegate>

@end

@implementation LABPhotoBrowser

- (void)setOptions:(NSDictionary *)options {
  self.photos = [[NSMutableArray alloc] init];
  NSArray *photosURL = [options objectForKey:@"photos"];
  for (NSString *urlString in photosURL) {
    NSURL *url = [NSURL URLWithString:urlString];
    [self.photos addObject: [MWPhoto photoWithURL: url]];
  }
  self.index = [[options objectForKey:@"currentIndex"] unsignedIntegerValue];
  
  if (self.labbrowser) {
    [self initPhotoBrowser];
  }
  
}

- (void)initPhotoBrowser {
  
  if (self.labbrowser) {
    self.labbrowser.delegate = nil;
    [self.labbrowser.view removeFromSuperview];
    [self.labbrowser removeFromParentViewController];
    self.labbrowser = nil;
  }
  
  self.labbrowser  = [[LABPhotoBrowserController alloc] initWithDelegate:self];
  self.labbrowser.displaySelectionButtons = NO;
  self.labbrowser.zoomPhotosToFill = YES;
  self.labbrowser.alwaysShowControls = NO;
  [self.labbrowser showNextPhotoAnimated: YES];
  [self.labbrowser showPreviousPhotoAnimated: YES];
  
  [self.labbrowser setCurrentPhotoIndex:self.index];
  
  [self.labbrowser setOnPhotoTap:self.onPhotoTap];
  
  UIViewController *rootViewController = RCTPresentedViewController();
  [rootViewController addChildViewController:self.labbrowser];
  [self addSubview:self.labbrowser.view];
  
  self.labbrowser.view.frame = self.frame;
  
}

- (void)didMoveToWindow {
  [super didMoveToWindow];
  if (!self.window) {
    [self.labbrowser.view removeFromSuperview];
    [self.labbrowser removeFromParentViewController];
    self.labbrowser = nil;
    self.photos = nil;
  } else {
    dispatch_async(dispatch_get_main_queue(), ^{
      [self initPhotoBrowser];
    });
  }
}


#pragma mark - MWPhotoBrowserDelegate

- (NSUInteger)numberOfPhotosInPhotoBrowser:(MWPhotoBrowser *)photoBrowser {
  return self.photos.count;
}

- (id <MWPhoto>)photoBrowser:(MWPhotoBrowser *)photoBrowser photoAtIndex:(NSUInteger)index {
  if (index < self.photos.count) {
    return [self.photos objectAtIndex:index];
  }
  return [self.photos objectAtIndex:(self.photos.count - 1)];
}

- (void)photoBrowser:(MWPhotoBrowser *)photoBrowser didDisplayPhotoAtIndex:(NSUInteger)index {
  if (self.onPhotoSelected) {
    self.onPhotoSelected(@{@"index": @(index)});
  }
}

@end
