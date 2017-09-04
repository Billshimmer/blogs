'use strict';
import { PixelRatio } from 'react-native';
import shallowEqual from 'fbjs/lib/shallowEqual';
import DI from 'lab4/core/DI';
import URI from 'urijs';
import { conversionTime, timeFormat } from './TimeUtils';

const hasOwnProp = Function.prototype.call.bind(
  Object.prototype.hasOwnProperty,
);

/**
 * 增强版的shallowEqual 在迭代比较每一个属性是可提供一个比较器
 * @param equals Function(propA, propB, key): boolean
 */
function shallowEqualEx(objA, objB, equals) {
  if (Object.is(objA, objB)) {
    return true;
  }

  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
    return false;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  equals = equals || Object.is;

  // Test for A's keys different from B.
  let key;
  for (let i = 0; i < keysA.length; i++) {
    key = keysA[i];
    if (!hasOwnProp(objB, key)) {
      return false;
    }
    if (!equals(objA[key], objB[key], key)) {
      return false;
    }
  }

  return true;
}

/**
 * shallowEqual 针对props比较特殊优化
 */
function shallowEqualProps(props1, props2) {
  if (props1 === props2) {
    return true;
  }

  if (typeof props1 !== 'object' || props1 === null || typeof props2 !== 'object' || props2 === null) {
    return false;
  }

  const keys1 = Object.keys(props1);
  const keys2 = Object.keys(props2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  let key;
  for (let i = 0; i < keys1.length; i++) {
    key = keys1[i];
    if (!hasOwnProp(props2, key)) {
      return false;
    }
    if (key === 'style') {
      // 优化前后style的比较
      if (!shallowEqual(props1[key], props2[key])) {
        return false;
      }
    } else if (!Object.is(props1[key], props2[key])) {
      return false;
    }
  }

  return true;
}

export {
  hasOwnProp,
  shallowEqual,
  shallowEqualEx,
  shallowEqualProps,
}

const utils = {
  hasOwnProp,
  shallowEqual,
  shallowEqualEx,
  shallowEqualProps,
  dp2px(dp) {
    return Math.round(dp * PixelRatio.get());
  },
  px2dp(px) {
    return px / PixelRatio.get();
  },
  /**
   * 获取相对于baseUrl的url, 如果不提供baseUrl,则使用全局配置的baseUrl
   * 如果url已是绝对的，则不会改变
   */
  getAbsoluteUrl(url, baseUrl) {
    baseUrl = baseUrl || DI.getBaseUrl();
    if (!baseUrl) {
      return url;
    }
    if (!url) {
      return baseUrl;
    }
    const urlObj = new URI(url);
    if (!urlObj.protocol()) {
      return urlObj.absoluteTo(baseUrl).toString();
    }
    return url;
  },

  // XXX 兼容 需要从utils中移除
  conversionTime,
  timeFormat,
};

export default utils;