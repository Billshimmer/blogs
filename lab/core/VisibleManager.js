'use strict';

import React, { Component, PropTypes } from 'react';
import EventEmitter from './emitter/EventEmitter';
import EmitterLeakDetection from './emitter/EmitterLeakDetection';

const VISIBLE_STATE_DID_HIDE = 0;
const VISIBLE_STATE_WILL_HIDE = 1;
const VISIBLE_STATE_WILL_SHOW = 2;
const VISIBLE_STATE_DID_SHOW = 3;

function eventToState(evt) {
  switch (evt) {
    case 'willShow':
      return VISIBLE_STATE_WILL_SHOW;
    case 'didShow':
      return VISIBLE_STATE_DID_SHOW;
    case 'willHide':
      return VISIBLE_STATE_WILL_HIDE;
    case 'didHide':
      return VISIBLE_STATE_DID_HIDE;
    default:
      if (__DEV__) {
        throw new Error('invalid event: ' + evt);
      }
  }
}

/**
 * 管理组件所处的组件树是否可见的上下文对象
 * 事件(对于没有动画的情况 允许只有did事件):
 * willShow: 将要可见 一般是动画开始 所以在这里不应该处理会引起动画卡顿的事
 * didShow: 已经可见 可以处理一些组件展示之后需要处理的事 比如 启动轮播图轮播
 * willHide: 组件将要不可见，一般是组件消失动画的开始 在这里可以处理一些简单的资源释放 比如轮播图的停止轮播
 * didHide: 组件已经不可见，这个事件可能不会调用 因为此时组件本身可能已经释放
 * 
 * 当前组件的事件，不考虑parent可见性
 * #willShow
 * #didShow
 * #willHide
 * #didHide
 */
export class VisibleManager {
  constructor(controller, key) {
    this._key = key;
    this._controller = controller;
    this._parent = controller.parent;
    controller.setManager(key, this);
    // 自己所处层次的visibleState
    this._visibleState = VISIBLE_STATE_DID_HIDE;
    // 组件最后一次emit的state
    this._emitedVisibleState = VISIBLE_STATE_DID_HIDE;
  }

  _emit(evt, data) {
    let nextState = eventToState(evt);
    if (nextState == this._visibleState) {
      //检查下一个state的合法性 这里只检查是否相等
      if (__DEV__) {
        console.warn('next visibleState equals current: ' + nextState);
      }
      return;
    }
    this._visibleState = nextState;

    let visibleState = this.getVisibleState();
    if (visibleState != this._emitedVisibleState) {
      this._emitedVisibleState = visibleState;
      this._emitter && this._emitter.emit(evt, evt, data);
    }

    //发送本层事件
    this._emitter && this._emitter.emit('#' + evt, evt, data);
  }

  _onParentEvent(evt, data) {
    let visibleState = this.getVisibleState();
    if (visibleState != this._emitedVisibleState) {
      this._emitedVisibleState = visibleState;
      if (this._emitter) {
        if (!this._emitter.emit(evt, evt, data)) {
          // 如果事件已经没有订阅者 则从parent移除
          this._parent.off(evt, this._onParentEvent);
          this['$$' + evt] = false;
        }
      }
    }
  }

  on(evt, fn, context, tag) {
    if (!this._emitter) {
      this._emitter = new EventEmitter();
      if (__DEV__) {
        EmitterLeakDetection.add(this._emitter);
      }
    }

    switch (evt) {
      case 'willShow':
      case 'didShow':
      case 'willHide':
      case 'didHide':
        if (this._parent) {
          let evtFlag = '$$' + evt;
          if (!this[evtFlag]) {
            // 按需向parent订阅
            this._parent.on(evt, this._onParentEvent, this);
            this[evtFlag] = true;
          }
        }
        break;
      case '#willShow':
      case '#didShow':
      case '#willHide':
      case '#didHide':
        break;
      default:
        if (__DEV__) {
          throw new Error('VisibleManager 非法事件类型!' + evt);
        }
        return;
    }

    this._emitter.on(evt, fn, context, tag);
  }

  off(evt, fn, context) {
    if (this._emitter) {
      this._emitter.off(evt, fn, context);
    }
  }

  offByTag(tag) {
    if (this._emitter) {
      this._emitter.offByTag(tag);
    }
  }

  /**
   * 是否可见
   * VISIBLE_STATE_WILL_SHOW 和 VISIBLE_STATE_DID_SHOW 为true
   */
  isVisible() {
    return this._parent
      ? this._parent._isVisible() &&
          this._visibleState > VISIBLE_STATE_WILL_HIDE
      : this._visibleState > VISIBLE_STATE_WILL_HIDE;
  }

  getVisibleState() {
    const parentVisibleState = this._parent
      ? this._parent.getVisibleState()
      : VISIBLE_STATE_DID_SHOW;
    return Math.min(this._visibleState, parentVisibleState);
  }

  /**
   * 获取顶层的visibleManager(navigation对应的那个)
   * 如果只关心最顶层navigation的是否可见则可用该方法
   */
  getTopManager() {
    let result = this;
    let parent = this._parent;
    while (parent) {
      result = parent;
      parent = parent._parent;
    }
    return result;
  }

  getParent() {
    return this._parent;
  }

  destroy() {
    if (
      this['$$willShow'] ||
      this['$$didShow'] ||
      this['$$willHide'] ||
      this['$$didHide']
    ) {
      this._parent.offByTag(this);
    }
    if (__DEV__ && this._emitter) {
      EmitterLeakDetection.remove(this._emitter);
    }
    if (this._emitter) {
      this._emitter.removeAllListeners();
    }
    this._controller.setManager(this._key, null);
  }
}

/**
 * 管理过个VisibleManager
 * 用于navigation viewPager等
 */
export class VisibleController {
  constructor(parent) {
    this.parent = parent;
    this._managers = Object.create(null);
  }

  emit(key, evt, data) {
    const manager = this._managers[key];
    if (manager) {
      manager._emit(evt, data);
    }
  }

  setManager(key, manager) {
    if (manager) {
      this._managers[key] = manager;
    } else {
      delete this._managers[key];
    }
  }
}

/**
 * 为子组件提供visibleManager context 并与VisibleController关联
 */
export class VisibleManagerProvider extends Component {
  static propTypes = {
    childKey: PropTypes.string,
    controller: PropTypes.object,
  };
  static childContextTypes = {
    visibleManager: PropTypes.object,
  };

  constructor(props, context) {
    super(props, context);
    this._childContext = {
      visibleManager: new VisibleManager(props.controller, props.childKey),
    };
  }

  getChildContext() {
    return this._childContext;
  }

  componentWillUnmount() {
    this._childContext.visibleManager.destroy();
  }

  render() {
    return this.props.children;
  }
}