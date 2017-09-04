'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, { StyleSheet } from 'react-native';

let stylesMap;

export const EMPTY_STYLES = Object.create(null);
if (__DEV__ && Object.freeze) {
  Object.freeze(EMPTY_STYLES);
}

/**
 * 样式表继承
 * 参数为需要继承的任意多个styles 对象(StyleSheet.create产生)
 */
export function extendStyles() {
  let len = arguments.length;
  if (!len) {
    return EMPTY_STYLES;
  }
  if (len === 1) {
    return arguments[0];
  }
  let result = Object.create(null);
  let arg;
  let key;
  let resultValue;
  for (let i = 0; i < len; ++i) {
    arg = arguments[i];
    for (key in arg) {
      resultValue = result[key];
      if (!resultValue) {
        result[key] = arg[key];
      } else if (Array.isArray(resultValue)) {
        resultValue.push(arg[key]);
      } else {
        result[key] = [resultValue, arg[key]];
      }
    }
  }
  for (key in result) {
    if (Array.isArray(result[key])) {
      result[key] = StyleSheet.flatten(result[key]);
    }
  }
  return result;
}

/**
 * 配置框架build产生的stylesMap
 */
export function configStyles(map) {
  stylesMap = map;
}

/**
 * 获取对应名字与类型的样式表
 * @param name 名字
 * @param styleClass 样式类型
 */
export function getStyles(name, styleClass) {
  styleClass = styleClass || 'default';
  let key = `${name}:${styleClass}`, result = stylesMap[key];
  if (result) {
    return result;
  }
  if (styleClass.indexOf(',') < 0) {
    return EMPTY_STYLES;
  }
  let i = 0;
  result = [];
  styleClass = styleClass.split(',');
  for (; i < styleClass.length; ++i) {
    result.push(stylesMap[`${name}:${styleClass[i]}`]);
  }
  result = extendStyles.apply(null, result);
  // 缓存结果 XXX 直接设置在配置对象上
  // TODO 设置一个缓存上限
  stylesMap[key] = result;
  if (__DEV__ && Object.freeze) {
    Object.freeze(result);
  }
  return result;
}
