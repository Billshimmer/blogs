'use strict';

/**
 * 与native module 相关的工具
 */
export default {
  /**
   * 将 Function(options, callback: Function(error, data))
   * 类型的包装成Promise
   *  TODO optionsTest
   */
  callbackToPromise(func, options, optionsTest) {
    return new Promise((resolve, reject) => {
      func(options, (error, data) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      });
    });
  },
};
