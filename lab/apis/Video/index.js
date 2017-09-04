'use strict';

import ReactNative, {
  NativeModules,
} from 'react-native';

const LABVideoModule = NativeModules.LABVideoModule;

export default {
  /**
   * 播放视屏
   * @param options {
   *   uri,
   *   title,
   * }
   */
  play(options, callback) {
    if (options.uri) {
      options.uri = options.uri.trim();
    }
    if (!options.title) {
      options.title = options.uri;
    }
    LABVideoModule.play(options, callback || (() => {}));
  },
};
