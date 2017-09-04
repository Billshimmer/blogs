'use strict';

import React, { Component, PropTypes } from 'react';
import globalEmitter from 'lab4/core/GlobalEventEmitter';
import CompEvent from 'lab4/core/emitter/CompEvent';
import DI from 'lab4/core/DI';

// TODO 与route对应的属性公用检查代码
const linkPropTypes = {
  type: PropTypes.oneOf([
    'push',
    'pop',
    'replace',
    'reload',
    'navigate',
    'popToTop',
    'link',
    '',
  ]),
  id: PropTypes.string,
  url: PropTypes.string,
  comp: PropTypes.any,
  compData: PropTypes.any,
  tpl: PropTypes.string,
  data: PropTypes.object,
  config: PropTypes.object,
};
const linkShape = PropTypes.oneOfType([
  PropTypes.shape(linkPropTypes),
  PropTypes.string,
]);
const emitShape = PropTypes.shape({
  event: PropTypes.string, //事件名
  scope: PropTypes.oneOf(['page', 'global', 'current', '']), //事件作用域 默认为current 代表当前事件总线上下文范围
  data: PropTypes.any, //事件数据
});

function _handleLink(link) {
  link = link || this.props.link;
  if (!link) {
    return;
  }
  if (typeof link === 'string') {
    // 支持link为字符串 方便 pop reload popToTop 的使用
    link = {
      type: link,
    };
  }
  if (
    link.type !== 'pop' &&
    link.type !== 'popToTop' &&
    !link.url &&
    !link.comp &&
    !link.tpl &&
    !link.compData
  ) {
    // 空链接不处理
    return;
  }
  const router = this.context && this.context.router;
  if (!router) {
    if (__DEV__) console.warn('context.router 不存在');
    return;
  }
  let { type, ...route } = link;
  type = type || 'push';
  switch (type) {
    case 'push':
      if (DI.getExternalLinkManager().isExternalLink(link.url)) {
        DI.getExternalLinkManager().handleExternalLink(link);
      } else {
        router.push(route);
      }
      break;
    case 'pop':
      router.pop();
      break;
    case 'replace':
      router.replace(route);
      break;
    case 'reload':
      //TODO
      break;
    case 'navigate':
      router.navigate(route);
      break;
    case 'popToTop':
      router.popToTop();
      break;
    case 'link':
      DI.getExternalLinkManager().handleExternalLink(link);
      break;
  }
}

function _handleEmit(emit, ...args) {
  emit = emit || this.props.emit;
  if (!emit) {
    return;
  }
  const compEvent = new CompEvent(this, emit.data);
  switch (emit.scope) {
    case 'page':
      this.context.pageEmitter.emit(emit.event, compEvent, ...args);
      break;
    case 'global':
      globalEmitter.emit(emit.event, compEvent, ...args);
      break;
    default:
      this.context.emitter.emit(emit.event, compEvent, ...args);
      break;
  }
}

/**
 * 处理link 或者emit
 * @return 是否处理了 link 或者emit
 */
function handleLinkEmitAction() {
  if (this.props.emit) {
    this._handleEmit(this.props.emit);
  }
  if (this.props.link) {
    this._handleLink(this.props.link);
  }
  return !!(this.props.emit || this.props.link);
}

export default {
  enhance: function(CompClass, link = true, emit = true) {
    //添加 link emit需要的上下文 router emitter pageEmitter
    if (CompClass.contextTypes) {
      CompClass.contextTypes.router = PropTypes.object;
      CompClass.contextTypes.emitter = PropTypes.object;
      CompClass.contextTypes.pageEmitter = PropTypes.object;
    } else {
      CompClass.contextTypes = {
        router: PropTypes.object,
        emitter: PropTypes.object,
        pageEmitter: PropTypes.object,
      };
    }

    //添加propTypes
    if (!CompClass.propTypes) {
      CompClass.propTypes = {};
    }
    if (link) {
      CompClass.propTypes.link = linkShape;
    }
    if (emit) {
      CompClass.propTypes.emit = emitShape;
    }

    //添加处理方法
    const proto = CompClass.prototype;
    proto._handleLink = _handleLink;
    proto._handleEmit = _handleEmit;
    proto.handleLinkEmitAction = handleLinkEmitAction;
  },
  linkPropTypes,
};
