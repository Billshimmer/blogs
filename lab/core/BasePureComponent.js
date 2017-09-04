'use strict';

import React, {
  Component,
} from 'react';

import BaseComponentMixin from './BaseComponentMixin';
import BaseComponent from './BaseComponent';
import { shallowEqualProps, shallowEqual } from '../utils';

export default class BasePureComponent extends BaseComponent {

  constructor(props, context) {
    super(props, context);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !shallowEqualProps(this.props, nextProps) || !shallowEqual(this.state, nextState);
  }
  
}

// XXX 最好使用Object.assign(BasePureComponent.prototype, BaseComponent.prototype);
// 但由于 有get set属性 导致不能简单的assign
BaseComponentMixin(BasePureComponent.prototype);
Object.assign(BasePureComponent.prototype, Component.prototype);
// 参考ReactPureComponent
// BasePureComponent.prototype.isPureReactComponent = true;
