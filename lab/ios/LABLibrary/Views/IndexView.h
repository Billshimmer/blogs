//
//  LABTableViewIndex.h
//  lab4
//
//  Created by Thomas Quan on 2017/1/16.
//  Copyright © 2017年 Facebook. All rights reserved.
//


#import <UIKit/UIKit.h>

#define RGB(r,g,b,a)  [UIColor colorWithRed:(double)r/255.0f green:(double)g/255.0f blue:(double)b/255.0f alpha:a]

@protocol IndexViewDelegate;

@interface IndexView : UIView

@property (nonatomic, strong) NSArray *indexes;
@property (nonatomic, weak) id <IndexViewDelegate> delegate;

- (void)reloadLayout:(UIEdgeInsets)edgeInsets;

- (void)setIndexView;

@end

/*----------------------------------------------------------*/

@protocol IndexViewDelegate <NSObject>

/**
 *  触摸到索引时触发
 *
 *  @param tableViewIndex 触发didSelectSectionAtIndex对象
 *  @param index          索引下标
 *  @param title          索引文字
 */
- (void)tableViewIndex:(IndexView *)tableViewIndex didSelectSectionAtIndex:(NSInteger)index withTitle:(NSString *)title;

/**
 *  开始触摸索引
 *
 *  @param tableViewIndex 触发tableViewIndexTouchesBegan对象
 */
- (void)tableViewIndexTouchesBegan:(IndexView *)tableViewIndex;
/**
 *  触摸索引结束
 *
 *  @param tableViewIndex
 */
- (void)tableViewIndexTouchesEnd:(IndexView *)tableViewIndex;

@end
