'use strict';

import ReactNative, {
  NativeModules,
} from 'react-native';

const LABLocationModule = NativeModules.LABLocationModule;
const LABNavigationModule = NativeModules.LABNavigationModule;

export default {
  /**
   * options: {
   *   coordType, //返回的坐标类型 'bd09' 'gcj02' 默认bd09 
   * }
   */
  getCurrentPosition(options) {
    return new Promise((resolve, reject) => {
      LABLocationModule.getCurrentPosition(options || {}, (error, data) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      });
    });
  },

  //TODO 监听位置变化功能

  openNavigation: LABNavigationModule.openNavigation,
};
