'use strict';

import utils from '../utils';

const IMAGE = 1;
const LOCAL_IMAGE = 2;
const ICON = 3;

const ResTypes = {
  IMAGE,
  LOCAL_IMAGE,
  ICON,
};

const ResourceManager = {
  ResTypes,

  /**
   * 解析image 或 icon uri
   * http[s]://xxx
   * /xxx
   * @image/xxx
   * @icon/xxx
   * xxx
   */
  parseDrawableUri(uri) {
    if (typeof uri !== 'string') {
      return uri;
    }
    if (uri.indexOf(':/') > 0) {
      return {
        uri,
        type: IMAGE,
      };
    }
    if (uri.startsWith('@image/')) {
      return {
        uri: uri.slice(7),
        type: LOCAL_IMAGE,
      };
    }
    if (uri.startsWith('@icon/')) {
      return {
        uri: uri.slice(6),
        type: ICON,
      };
    }
    if (uri[0] === '/') {
      return {
        uri: utils.getAbsoluteUrl(uri),
        type: IMAGE,
      };
    }
    return {
      uri,
      type: LOCAL_IMAGE,
      isDefaultType: true,
    };
  },
};

export default ResourceManager;