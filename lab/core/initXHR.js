/**
 * 初始化XMLHttpRequest配置
 * 为每个请求带上版本号等信息
 */
'use strict';

import { Platform } from 'react-native';
import RCTNetworking from 'react-native/Libraries/Network/RCTNetworking';
import DI from './DI';

const originalSendRequest = RCTNetworking.sendRequest;

let LABUserAgent = '';

RCTNetworking.sendRequest = function(
  method,
  trackingName,
  url,
  headers,
  data,
  responseType,
  incrementalUpdates,
  timeout,
  callback) {
    if (!LABUserAgent) {
      const config = DI.getConfig();
      if (config) {
        LABUserAgent = `LAB_DEV_${Platform.OS === 'ios' ? 'IOS' : 'Android'} LABAPP/${config.version}`;
      }
    }
    const oldUserAgent = headers['user-agent'];
    headers['user-agent'] = oldUserAgent ? `${oldUserAgent} ${LABUserAgent}` : LABUserAgent;
    
    return originalSendRequest.call(RCTNetworking, method, trackingName, url, headers, data, responseType, incrementalUpdates, timeout, callback);
};