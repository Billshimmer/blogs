'use strict';

import { Dimensions, Platform } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

export function forHorizontal(props) {
  const { layout, position, scene } = props;

  // 如果没有measured则使用SCREEN_WIDTH
  const width = layout.initWidth || SCREEN_WIDTH;
  const index = scene.index;
  const inputRange = [
    index - 1,
    index,
    index + 0.999,
    index + 1,
    index + 1.001,
  ];

  const opacity = position.interpolate({
    inputRange,
    outputRange: [1, 1, 0.3, 0, 0],
  });

  // const scale = position.interpolate({
  //   inputRange,
  //   outputRange: [1, 1, 0.99, 0.99, 0.99],
  // });

  const translateX = position.interpolate({
    inputRange,
    outputRange: Platform.OS === 'ios'
      ? [width - 0.5, 0, -width / 4, -width + 0.5, -10000]
      : [width, 0, -width / 4, -10000, -10000],
  });

  return {
    opacity,
    transform: [
      // { scale },
      { translateX },
    ],
  };
}
