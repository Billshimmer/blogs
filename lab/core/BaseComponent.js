'use strict';

import React, {
  Component,
  PropTypes,
} from 'react';

import BaseComponentMixin from './BaseComponentMixin';
import ComponentContextTypes from './ComponentContextTypes';
import EventEmitter from './emitter/EventEmitter';

export default class BaseComponent extends Component {
  static componentContextTypes = ComponentContextTypes;

  //事件总线相关的上下文
  static eventContextTypes = {
    //当前作用域的事件总线 可能就是pageEmitter
    emitter: PropTypes.object,
    //页面事件总线
    pageEmitter: PropTypes.object,
  };

  constructor(props, context) {
    super(props, context);
  }

  // TODO 移到BaseComponentMixin
  isMounted() {
    // XXX React内部使用的方式  接口可能会变
    return this.updater.isMounted(this);
  }

  /**
   * 使组件具有setNativeProps功能
   */
  setNativeProps(nativeProps) {
    // TODO 使用函数ref回调setCompMainRef
    if (__DEV__) {
      if (!this.refs._main) {
        console.warn('setNativeProps !this.refs._main');
      }
    }
    this.refs._main &&
      this.refs._main.setNativeProps &&
      this.refs._main.setNativeProps(nativeProps);
  }

  // get setCompMainRef() {
  //   if (!this._setCompMainRef) {
  //     this._setCompMainRef = function(ref) {
  //       this.__compMain = ref;
  //     }.bind(this);
  //   }
  //   return this._setCompMainRef;
  // }

  /**
   * 给事件加上当前组件所属的命名空间前缀
   * 以当前组件的eventId属性为命名空间
   */
  nsEvent(event) {
    return EventEmitter.nsEvent(this.props.eventId, event);
  }

  get emitter() {
    return this.context.emitter;
  }

  get pageEmitter() {
    return this.context.pageEmitter;
  }
}

BaseComponentMixin(BaseComponent.prototype);
// 参考ReactPureComponent Avoid an extra prototype jump for these methods.
Object.assign(BaseComponent.prototype, Component.prototype);
