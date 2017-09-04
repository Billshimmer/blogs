/**
 * 第三方登录与社会化分享
 */
'use strict';

import {
  NativeModules,
} from 'react-native';

const LABSocialModule = NativeModules.LABSocialModule;

/**
 * platform 平台参数
 * wb, qq, qzone, wx, wx_fav, wx_circle, sms
 */
export default {
  /**
   * 登录
   * @param options: {
   *   platform: String, //登录平台
   *   getPlatformInfo: Boolean, //是否需要返回平台信息 默认true
   * }
   * @return Promise
   * resolve:
   * {
   *   ...授权信息 openid access_token 等 各平台可能不同
   *   platform,
   *   // 下面为getPlatformInfo 为true时的返回
   *   nickname,
   *   avatarUrl,
   * }
   * reject:
   * {
   *   code, // 用户取消则为 cancel
   * }
   */
  login(options) {
    return new Promise((resolve, reject) => {
      options = Object.assign({getPlatformInfo: true}, options);
      LABSocialModule.login(options, (error, data) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      });
    });
  },

  /**
   * 分享
   * @param options: {
   *   platforms: [String], 分享平台,打开分享面板 默认为 ['wx', 'wx_circle', 'wb', 'qq', 'qzone']
   *   platform: String, 单平台分享
   *   informations: {
   *     title,
   *     content,
   *     imageUrl,
   *     url, // targetUrl 分享链接
   *   }
   * }
   * @param callback: Function(error, data)
   */
  share(options, callback) {
    if (!options.platform && !options.platforms) {
      options = {
        ...options,
        platforms: ['wx', 'wx_circle', 'wb', 'qq', 'qzone'],
      };
    }
    LABSocialModule.share(options, callback);
  },
};
