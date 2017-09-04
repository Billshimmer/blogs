'use strict';

import DI from './DI';
import qsStringify from 'qs/lib/stringify';
import exAxios from 'ex-axios';

/**
 * lab ex-axios
 * 扩展配置
 * requestDataType: String 请求data类型 'json' 'qs' 默认'qs' 只对data为纯Object有效
 * data: Object 如果requestDataType为'qs' 且请求类型为没有body的 则会自动加到params
 * fullResponse: Boolean 是否返回完整数据 默认false,如果需要header等其他数据则应该设为true
 * body: 与data相同
 * LAB_JSON: 控制是否需要LAB_JSON参数 如果传false 则不需要
 * 
 * TODO 兼容php后端api接口的返回格式
 */
const axios = exAxios.create({
  paramsSerializer: qsStringify,
  xsrfCookieEnabled: false,
});

Object.defineProperty(axios.defaults, 'baseURL', {
  enumerable: true,
  get: function() {
    return DI.getBaseUrl();
  },
});

axios.interceptors.request.use((config) => {
  config.method = config.method.toUpperCase();
  config.requestDataType = config.requestDataType || 'qs';

  if (config.LAB_JSON !== false) {
    config.params = Object.assign({ LAB_JSON: 1 }, config.params);
  }

  const data = config.data = (config.data || config.body);
  const qsObject = config.requestDataType === 'qs' && data != null && (typeof data === 'object')
    && (data.constructor == null || data.constructor === Object);

  if (config.method === 'GET' || config.method === 'DELETE' || config.method === 'HEAD' || config.method === 'OPTIONS') {
    if (config.requestDataType === 'json') {
      throw new Error('method 为 GET DELETE HEAD OPTIONS时，不支持requestDataType json');
    }
    if (qsObject) {
      config.params = Object.assign(config.params, data);
      delete config.data;
    }
  } else if (qsObject) {
    config.headers.set('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    config.data = qsStringify(data);
  }

  return config;
});

axios.setLogResponseInterceptor = function(inst, tag) {
  if (__DEV__) {
    inst.interceptors.response.use((res) => {
      if (__DEV__) {
        res.responseText = res.request._response;
        console.log(tag + ' response:\n', res);
      }
      return res;
    }, (res) => {
      if (__DEV__) {
        console.log(tag + ' error:\n', {
          config: res.config,
          response: res.response,
          responseText: res.response && res.response.request._response,
        }, res);
      }
      return Promise.reject(res);
    });
  }
};

if (__DEV__) {
  axios.setLogResponseInterceptor(axios, 'http-axios');
}

axios.interceptors.response.use((res) => {
  if (res.config.fullResponse) {
    return res;
  }
  return res.data;
}, (res) => {
  if (res.response) {
    res.data = res.response.data;
  }
  return Promise.reject(res);
});

axios.fetch = axios;

export default axios;