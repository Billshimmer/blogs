//
//  LABAppDelegate.m
//  LAB4
//
//  Created by zzycami@foxmail.com on 06/13/2017.
//  Copyright (c) 2017 zzycami@foxmail.com. All rights reserved.
//

#import "AppDelegate.h"
#import <React/RCTRootView.h>
#import <React/RCTBundleURLProvider.h>
#import <BaiduMapAPI_Map/BMKMapView.h>
#import "LABPayModule.h"
#import "AppDelegate+LaunchAd.h"
#import "WelcomeManager.h"
#import <Bugly/Bugly.h>

#define BaiduMapViewKey @"X2s48YmdqxKfMzUyfZN90PvlFZVAy4ma"

@interface AppDelegate ()
@property(nonatomic, retain) BMKMapManager* mapManager;
@end

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    _mapManager = [[BMKMapManager alloc] init];
    NSString *baiduMapKey = BaiduMapViewKey;
    BOOL ret = [_mapManager start:baiduMapKey  generalDelegate:nil];
    if (!ret) {
        NSLog(@"manager start failed!");
    }
    [Bugly startWithAppId:@"cfb9dd8a0b"];
    
    NSURL *jsCodeLocation;
    [[RCTBundleURLProvider sharedSettings] setDefaults];
    jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"demo/index" fallbackResource:nil];
    
    RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation moduleName:@"index" initialProperties:nil launchOptions:launchOptions];
    
    _window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
    UIViewController *rootViewController = [UIViewController new];
    rootViewController.view = rootView;
    _window.rootViewController = rootViewController;
    [_window makeKeyAndVisible];
    //  [WelcomeManager getInstance].onDismissWelcomeViewController = ^(){
    //    [_window makeKeyAndVisible];
    //  };
    //  [[WelcomeManager getInstance] presentWelcomeViewController];
    return YES;
}

- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation {
    BOOL canHandleURL = [LABPayModule payCanOpenURL:url withCompletion:nil];
    return canHandleURL;
}

- (void)applicationWillResignActive:(UIApplication *)application
{
    // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
    // Use this method to pause ongoing tasks, disable timers, and throttle down OpenGL ES frame rates. Games should use this method to pause the game.
}

- (void)applicationDidEnterBackground:(UIApplication *)application
{
    // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
    // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
}

- (void)applicationWillEnterForeground:(UIApplication *)application
{
    // Called as part of the transition from the background to the inactive state; here you can undo many of the changes made on entering the background.
}

- (void)applicationDidBecomeActive:(UIApplication *)application
{
    // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
}

- (void)applicationWillTerminate:(UIApplication *)application
{
    // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
}

@end
