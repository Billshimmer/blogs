'use strict';

//https://github.com/chriso/validator.js
const validatorJs = {
  equals: require('validator/lib/equals'),
  isEmail: require('validator/lib/isEmail'),
  isURL: require('validator/lib/isURL'),
  isIP: require('validator/lib/isIP'),
  isFQDN: require('validator/lib/isFQDN'),
  isBoolean: require('validator/lib/isBoolean'),
  isAlpha: require('validator/lib/isAlpha'),
  isAlphanumeric: require('validator/lib/isAlphanumeric'),
  isNumeric: require('validator/lib/isNumeric'),
  isLowercase: require('validator/lib/isLowercase'),
  isUppercase: require('validator/lib/isUppercase'),
  isAscii: require('validator/lib/isAscii'),
  isInt: require('validator/lib/isInt'),
  isFloat: require('validator/lib/isFloat'),
  isDecimal: require('validator/lib/isDecimal'),
  isHexadecimal: require('validator/lib/isHexadecimal'),
  isHexColor: require('validator/lib/isHexColor'),
  isJSON: require('validator/lib/isJSON'),
  isEmpty: require('validator/lib/isEmpty'),
  isLength: require('validator/lib/isLength'),
  isByteLength: require('validator/lib/isByteLength'),
  isDate: require('validator/lib/isDate'),
  isAfter: require('validator/lib/isAfter'),
  isBefore: require('validator/lib/isBefore'),
  isIn: require('validator/lib/isIn'),
  isMobilePhone: require('validator/lib/isMobilePhone'),
  isCurrency: require('validator/lib/isCurrency'),
  isWhitelisted: require('validator/lib/isWhitelisted'),
};

//扩展的验证器
const extValidator = {
  //密码类型1，长度大于6 且小于18
  password1(value) {
    if (!value || value.length < 6) {
      return {
        isValid: false,
        message: '密码长度必须大于6位',
      };
    }
    if (!value || value.length > 18) {
      return {
        isValid: false,
        message: '密码长度必须小于18位',
      };
    }
    return true;
  },
  notNull(value) {
    return value !== null && value !== undefined &&
      (
        value.length > 0
        || (Object.prototype.toString.call(value) === '[object Object]' && Object.keys(value).length > 0)
        || (Object.prototype.toString.call(value) === '[object Date]')
        || (Object.prototype.toString.call(value) === '[object Number]')
      );
  },
  notEquals(value, comparsion) {
    return value !== comparsion;
  },
};

function callValidatorFunc(func, args, config) {
  let result = func.apply(null, args);
  if (!result) {
    result = {
      isValid: false,
    };
  } else if (typeof result !== 'object') {
    result = {
      isValid: true,
    };
  }
  if (config.message) {
    result.message = config.message;
  }
  return result;
}

function doValidator(value, config) {
  let validatorType = config.validator;
  let args;
  if (!config.arguments) {
    args = [value];
  } else if (Array.isArray(config.arguments)) {
    args = [value].concat(config.arguments);
  } else {
    args = [value, config.arguments];
  }
  if (typeof validatorType == 'function') {
    return callValidatorFunc(validatorType, args, config);
  }
  if (typeof extValidator[validatorType] == 'function') {
    return callValidatorFunc(extValidator[validatorType], args, config);
  }
  if (typeof validatorJs[validatorType] == 'function') {
    //validatorJs 要求为字符串
    if (args[0] == null) {
      args[0] = '';
    } else if (typeof args[0] !== 'string') {
      args[0] = String(args[0]);
    }
    let isValid;
    try {
      isValid = validatorJs[validatorType].apply(null, args);
    } catch (e) {
      isValid = false;
    }
    return {
      isValid,
      message: config.message
    };
  }
  if (__DEV__) console.warn('doValidator 未知的validator类型', config);
  return {
    isValid: true,
  };
}

/**
 * 验证value
 * @param value: any
 * @param configs: Array | Object
 * [
 *   {
 *     validator: String | Function,
 *     arguments: Array | any,
 *     message: String,
 *   }
 * ]
 * @return {isValid: bool, message: string}
 */
module.exports = function(value, configs) {
  if (!configs) {
    return {
      isValid: true,
    };
  }
  let validatorResult;
  if (Array.isArray(configs)) {
    for (let i = 0; i < configs.length; ++i) {
      validatorResult = doValidator(value, configs[i]);
      if (!validatorResult.isValid) {
        return validatorResult;
      }
    }
    return {
      isValid: true,
    };
  }
  return doValidator(value, configs);
};
