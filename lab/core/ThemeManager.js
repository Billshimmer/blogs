'use strict';

import {
  Platform,
} from 'react-native';
import DefaultTheme from './DefaultTheme';

// TODO 需要重构Theme系统 使得能够动态切换主题
// TODO 不要放入全局
global.Theme = DefaultTheme;

// TODO native 需要从系统配置获取(如oppo就不是android标准的)
let systemBarSize = { navigationBarHeight: 0 };
if (Platform.OS === 'android') {
  if (Platform.Version > 22) {
    systemBarSize.statusBarHeight = 24;
  } else if (Platform.Version > 19) {
    systemBarSize.statusBarHeight = 25;
  } else {
    systemBarSize.statusBarHeight = 0;
  }

  // else if(Platform.Version == 19) { //TODO
  // }
} else if (Platform.OS === 'ios') {
  systemBarSize.statusBarHeight = 20;
}

/**
 * 配置主题
 */
export function configTheme(theme) {
  global.Theme = Object.assign({}, DefaultTheme, theme, systemBarSize);
}