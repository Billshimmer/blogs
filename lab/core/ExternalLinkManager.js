'use strict';

import { Platform, Linking } from 'react-native';
import URI from 'urijs';
import DI from './DI';

/**
 * 默认的外部链接管理器
 */
export default class ExternalLinkManager {

  /**
   * 判断一个链接是否为外部链接
   * @param {String} link
   * TODO web 开发模式下 domain 判断
   */
  isExternalLink(url) {
    if (!url) {
      return false;
    }
    const uri = new URI(url);
    if (!uri.protocol()) {
      return false;
    }
    const domain = uri.domain();
    const baseUrl = DI.getRealBaseUrl() || '';
    return baseUrl.indexOf(domain) < 0;
  }

  /**
   * 处理外部链接
   * @param {Object} options 
   * {
   *   url,
   *   type, // LinkEmitAble 的 type
   * }
   */
  handleExternalLink({
    url,
  }) {
    if (Platform.OS === 'web') {
      location.href = url;
    } else {
      Linking.canOpenURL(url)
        .then(supported => {
          if (!supported && __DEV__) {
            console.warn("ExternalLinkManager Can't handle url: ", url);
          } else {
            return Linking.openURL(url);
          }
        })
        .catch(err => {
          if (__DEV__) {
            console.warn('ExternalLinkManager Linking.canOpenURL error', err);
          }
        });
    }
  }
}