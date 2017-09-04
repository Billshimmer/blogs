'use strict';

import React, {
  PropTypes,
} from 'react';
import ReactNative, {
  View,
} from 'react-native';

import {
  VisibleManagerProvider,
} from 'lab4/core/VisibleManager';

export default class SceneComponent extends VisibleManagerProvider {

  static childContextTypes = {
    ...VisibleManagerProvider.childContextTypes,
    //将ViewPager的Context放在这里 使得ViewPager内的setState不会由于context的存在而跳过优化比较...
    viewPager: PropTypes.object,
  };
  constructor(props, context) {
    super(props, context);
    this._childContext.viewPager = props.viewPager;
  }
}