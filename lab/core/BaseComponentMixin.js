'use strict';

import { getStyles, EMPTY_STYLES } from './lab/StyleManager';
import CompEvent from './emitter/CompEvent';
import globalEmitter from './GlobalEventEmitter';

let tempStyleArray = [];

/**
 * TODO
 * 增加一个在componentWillReceiveProps 的时候判断style_class 或者props.styles 是否改变
 * props.styles 具有最高优先级?
 */
const Mixin = {
  __propStyleClass: ':)',
  __propStyles: EMPTY_STYLES,
  __styles: EMPTY_STYLES,

  __initCompStyles() {
    this.__propStyleClass = this.props.style_class;
    this.__styles = getStyles(
      this.constructor.comp_name,
      this.__propStyleClass
    );

    // XXX 可能存在内存泄漏
    this.__propStyles = this.props.styles;

    // defaultStyles设置为静态应作为默认行为
    if (!this.defaultStyles) {
      this.defaultStyles = this.constructor.defaultStyles;
    }
  },

  /**
   * 获取当前组件style_class 对应的样式表
   */
  getStyles() {
    if (this.props.style_class != this.__propStyleClass) {
      this.__initCompStyles();
    }
    return this.__styles;
  },

  /**
   * 获取组合之后的样式
   * defaultStyles < props.styles < style_class(this.getStyles())
   */
  getStyle(name) {
    const props = this.props;
    if (props.style_class != this.__propStyleClass || props.styles != this.__propStyles) {
      this.__initCompStyles();
    }
    if (arguments.length > 1) {
      return this.__getStyleByNames(arguments);
    } else if (Array.isArray(name)) {
      return this.__getStyleByNames(name);
    }
    let result = tempStyleArray;
    let tempStyle;
    if (this.defaultStyles && (tempStyle = this.defaultStyles[name])) {
      result.push(tempStyle);
    }
    if (this.__propStyles && (tempStyle = this.__propStyles[name])) {
      result.push(tempStyle);
    }
    if (tempStyle = this.__styles[name]) {
      result.push(tempStyle);
    }
    if (result.length > 1) {
      tempStyleArray = [];
      return result;
    }
    result = result[0];
    tempStyleArray.length = 0;
    return result;
  },

  __getStyleByNames(names) {
    let result = tempStyleArray;
    let i;
    let len = names.length;
    let stylesObj;
    let tempStyle;
    if (stylesObj = this.defaultStyles) {
      for (i = 0; i < len; ++i) {
        if (tempStyle = stylesObj[names[i]]) {
          result.push(tempStyle);
        }
      }
    }
    if (stylesObj = this.__propStyles) {
      for (i = 0; i < len; ++i) {
        if (tempStyle = stylesObj[names[i]]) {
          result.push(tempStyle);
        }
      }
    }
    stylesObj = this.__styles;
    for (i = 0; i < len; ++i) {
      if (tempStyle = stylesObj[names[i]]) {
        result.push(tempStyle);
      }
    }
    if (result.length > 1) {
      tempStyleArray = [];
      return result;
    }
    result = result[0];
    tempStyleArray.length = 0;
    return result;
  },

  //在当前事件总线作用域中发送事件
  emitCurrent(event, ...args) {
    this.emitter.emit(event, new CompEvent(this, null, args), ...args);
  },

  //在页面事件总线作用域中发送事件
  emitPage(event, ...args) {
    this.pageEmitter.emit(event, new CompEvent(this, null, args), ...args);
  },

  //在全局事件总线作用域中发送事件
  emitGlobal(event, ...args) {
    globalEmitter.emit(event, new CompEvent(this, null, args), ...args);
  },
  
  //指定事件总线 发送事件
  emit(emitter, event, ...args) {
    emitter.emit(event, new CompEvent(this, null, args), ...args);
  },
};

/**
 * TODO 使用注解实现mixin
 */
export default function BaseComponentMixin(componentPrototype) {
  Object.assign(componentPrototype, Mixin);
  // TODO 废弃styles?
  Object.defineProperty(componentPrototype, 'styles', {
    get: Mixin.getStyles,
  });
}
