'use strict';

/**
 * 设置异常守卫
 * @param type 'debug' 'beta' 'release'
 * 在debug下 不设置
 * 在beta模式下 弹出对话框同时上报异常
 * 在release 模式下静默上报异常
 * 
 * 参考 InitializeCore.js polyfills/error-guard.js ExceptionsManager.js
 */
export default function setupErrorGuard(type) {
  if (type === 'debug') {
    return;
  }
  // 由于没法比 react-native InitializeCore 更早调用 所以设置这个目前没有作用
  global.__fbDisableExceptionsManager = true;

  const handleError = (e, isFatal) => {
    if (type !== 'release') {
      require('react-native/Libraries/Alert/Alert').alert('错误!!!', `message: ${e.message}\nisFatal: ${isFatal}\nstack: ${e.stack}`);
    }
    const Logger = require('./').default;
    try {
      Logger.reportError(e, isFatal);
    } catch (ee) {
      console.log('Failed to report error: ', ee.message);
      throw e;
    }
  };

  ErrorUtils.setGlobalHandler(handleError);
};