'use strict';

/**
 * 不可见的元素样式 参考Navigator的实现 对position: 'absolute'元素有效
 * XXX 废弃
 */
import React, {
  Component,
  PropTypes,
} from 'react';
import ReactNative, {
  StyleSheet,
  Dimensions,
} from 'react-native';

const SCREEN_HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
  invisibleStyle: {
    top: SCREEN_HEIGHT,
    bottom: -SCREEN_HEIGHT,
  }
});

export default styles.invisibleStyle;
