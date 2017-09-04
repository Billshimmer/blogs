'use strict';

/**
 * 组件事件对象，组件间通过事件总线通信时，事件回调函数的第一个参数
 * 目前只有target data属性
 */
export default function CompEvent(comp, data, args) {
  this.target = comp;
  this.data = data || (args && args[0]);
  this.args = args;
};
