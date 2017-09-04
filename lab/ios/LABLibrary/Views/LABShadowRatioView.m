//
//  RCTShadowRatioView.m
//  RatioView
//
//  Created by yinhf on 16/9/11.
//
//

#import "LABShadowRatioView.h"

@implementation LABShadowRatioView

static CGSize RCTMeasure(void *context, float width, YGMeasureMode widthMode, float height, YGMeasureMode heightMode)
{
    LABShadowRatioView *shadow = (__bridge LABShadowRatioView *)context;
    CGSize result;
    
    if (widthMode == YGMeasureModeUndefined || width < 0 || heightMode == YGMeasureModeExactly) {
        result.width = width > 0 ? width : 0;
        result.height = heightMode == YGMeasureModeExactly ? height : 0;
        return result;
    }
    
    float h = width / shadow.whRatio;
    if (heightMode == YGMeasureModeAtMost && h > height) {
        h = height;
    }
    result.width = width;
    result.height = h;
    return result;
}

- (instancetype)init
{
    if ((self = [super init])) {
        _whRatio = NAN;
        YGNodeSetMeasureFunc(self.cssNode, RCTMeasure);
    }
    return self;
}

- (void)setWhRatio:(CGFloat)whRatio;
{
    _whRatio = whRatio;
    YGNodeMarkDirty(self.cssNode);
}

@end
