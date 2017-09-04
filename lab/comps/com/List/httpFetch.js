'use strict';

import LAB, { axios } from 'lab4';

function httpFetch(options) {
  // TODO cache: options.type === 'load', //刷新和加载更多都不应该使用缓存
  return axios(options.url);
}

// 创建一个带转换函数的httpFetch
httpFetch.convert = function(c) {
  return options => {
    return httpFetch(options).then(data => {
      if (!data.CODE || data.CODE === 'ok') {
        return c(data);
      }
      return data;
    });
  };
};

export default httpFetch;
