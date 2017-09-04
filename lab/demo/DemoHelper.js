'use strict';

import ReactNative, { Platform, AsyncStorage } from 'react-native';

import LAB_DEMOS from './DEMOS';
import DebugPage from './DebugPage';

const isNative = Platform.OS !== 'web';

// 处理require es module
function requireDefault(obj) {
  return (obj && obj.default) || obj;
}

export default {
  cameraEnabled: Platform.OS !== 'web',

  get _demos() {
    if (!this.__demos) {
      this.__demos = LAB_DEMOS;
    }
    return this.__demos;
  },
  _platformCache: null,

  setExtraDemos(demos) {
    if (Array.isArray(demos)) {
      demos = {
        _: demos,
      };
    }
    this.__demos = {
      ...demos,
      ...LAB_DEMOS,
    };
    this._platformCache = null;
  },

  getDemos() {
    if (!this._platformCache) {
      let cache = Object.create(null);
      let oriDemos = this._demos;
      for (let s in oriDemos) {
        let list = (cache[s] = []);
        let oriList = oriDemos[s];
        for (let i = 0; i < oriList.length; ++i) {
          let oriItem = requireDefault(oriList[i]);
          let platform = oriItem.platform;
          if (
            !platform ||
            platform === Platform.OS ||
            (isNative && platform === 'native')
          ) {
            if (typeof oriItem === 'function') {
              oriItem = {
                title: oriItem.title || oriItem.name,
                comp: oriItem,
              };
            }
            list.push(oriItem);
          }
        }
      }
      this._platformCache = cache;
    }
    return this._platformCache;
  },

  getTestState() {
    return AsyncStorage.getItem('DEMO_STATE').then(debugConfig => {
      //console.log(debugConfig);
      if (!debugConfig) {
        return null;
      }
      debugConfig = JSON.parse(debugConfig);
      let debugState = {
        debugConfig,
      };
      if (debugConfig.isDebugPageOpen && debugConfig.debugUrl) {
        debugState.route = {
          id: 'debugPage',
          comp: DebugPage,
          url: debugConfig.debugUrl,
          isPage: debugConfig.isPage,
        };
      } else if (debugConfig.demoCompName) {
        let demos = this.getDemos();
        for (let s in demos) {
          let section = demos[s];
          for (let i = 0; i < section.length; ++i) {
            if (section[i].title === debugConfig.demoCompName) {
              debugState.route = this.getDemoRoute(section[i]);
              break;
            }
          }
        }
      }
      return debugState;
    });
  },

  getDemoRoute(demoConfig) {
    return {
      id: 'demo',
      comp: requireDefault(demoConfig.comp),
    };
  },

  /**
   * testConfig {
   *   isDebugPageOpen,
   *   demoCompName,
   *   debugUrl,
   * }
   */
  saveTestState(testConfig) {
    AsyncStorage.setItem('DEMO_STATE', JSON.stringify(testConfig));
  },

  clearTestState() {
    AsyncStorage.removeItem('DEMO_STATE');
  },

  setCameraEnabled(enabled) {
    this.cameraEnabled = enabled;
  },
};
