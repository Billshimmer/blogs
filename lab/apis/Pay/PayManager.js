/**
 * 支付
 */
'use strict';

import ReactNative, {
  NativeModules,
} from 'react-native';

const LABPayModule = NativeModules.LABPayModule;

export default {
  /**
   * options: {
   *   charge, //charge字符串 或 json object
   * }
   * @return Promise
   * resolve: {
   * 		pay_result: "success",
   * 		error_msg,
   * 		extra_msg,
   * }
   *
   * reject: {
   *   code,  // "cancel" | "fail" | "invalid"  cancel属于用户取消，一般不需要提示错误
   *   message,
   * }
   */
  pay(options) {
    if (typeof options.charge === 'object') {
      options = {
        ...options,
        charge: JSON.stringify(options.charge),
      };
    }
    return LABPayModule.pay(options);
  }
};
