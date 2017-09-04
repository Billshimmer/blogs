'use strict';

import ReactNative, {
  NativeModules,
  Platform,
} from 'react-native';
import utils from 'lab4/utils';

const LABCookieManager = NativeModules.LABCookieManager;

function getUrl(options) {
  if (options.url) {
    return options.url;
  }
  if (options.domain) {
    //XXX http https 是否要区分?
    return `http://${options.domain}${options.path}`;
  }
  return utils.getAbsoluteUrl(options.path);
}

function stringifyCookie(key, value, options) {
  let expires = options.expires;
  if (typeof expires === 'number') {
    let days = expires;
    expires = new Date();
    expires.setTime(+expires + days * 864e+5);
  }

  return [
    key, '=', value,
    expires ? '; expires=' + expires.toUTCString() : '',
    options.path ? '; path=' + options.path : '',
    options.domain ? '; domain=' + options.domain : '',
    options.secure ? '; secure' : ''
  ].join('');
}

/**
 * cookie读写
 * options:
 * {
 *   expires Number | Date Number表示有效天数
 *   path
 *   domain
 *   secure
 *   url //综合domain path secure
 * }
 *
 * TODO encode decode
 */
const CookieManager = {
  get(key, options = {}, callback) {
    let url = getUrl(options);
    return new Promise((resolve, reject) => {
      LABCookieManager.get(url, (error, cookies) => {
        if (error) {
          callback && callback(error);
          reject(error);
          return;
        }
        let value = cookies[key];
        callback && callback(null, value);
        resolve(value);
      });
    });
  },
  set(key, value, options = {}, callback) {
    let url = getUrl(options);
    return new Promise((resolve, reject) => {
      LABCookieManager.setFromResponse(url, stringifyCookie(key, value, options), (error) => {
        if (error) {
          callback && callback(error);
          reject(error);
          return;
        }
        callback && callback(null);
        resolve(null);
      });
    });
  },
  remove(key, options = {}, callback) {
    let url = getUrl(options);
    let removeOptions = {
      ...options,
      expires: 946656000,
    };
    return new Promise((resolve, reject) => {
      LABCookieManager.setFromResponse(url, stringifyCookie(key, '', removeOptions), (error) => {
        if (error) {
          callback && callback(error);
          reject(error);
          return;
        }
        callback && callback(null);
        resolve(null);
      });
    });
  },
  flush() {
    if (Platform.OS === 'android') {
      LABCookieManager.flush();
    }
  },
};

export default CookieManager;
