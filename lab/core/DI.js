'use strict';

import { Platform } from 'react-native';

const holder = {
  //web 下 BASE_URL 可以为空
  BASE_URL: undefined,
};

//Dependency Injection
export default {
  BASE_URL: 'BASE_URL',
  get: function(key) {
    if (holder.hasOwnProperty(key)) {
      return holder[key];
    }
    throw new Error('Configuration key not found: ' + key);
  },
  set: function(key, value) {
    holder[key] = value;
  },
  setConfig(config) {
    this._config = config;
  },
  /**
   * config: {
   *   extra,
   * }
   */
  getConfig() {
    return this._config;
  },
  getBaseUrl() {
    return holder['BASE_URL'];
  },
  /**
   * 获取真实的baseUrl
   * native 中与 getBaseUrl 相同
   * web 下如果配置的baseUrl 不为undefined 则返回配置的 否则返回当前网页的url location.origin
   */
  getRealBaseUrl() {
    const baseUrl = this.getBaseUrl();
    if (Platform.OS === 'web' && baseUrl === undefined) {
      return location.origin;
    }
    return baseUrl;
  },
  setStore(store) {
    this._store = store;
  },
  getStore() {
    return this._store;
  },
  setExternalLinkManager(manager) {
    this._ExternalLinkManager = manager;
  },
  getExternalLinkManager() {
    return this._ExternalLinkManager;
  },
};
