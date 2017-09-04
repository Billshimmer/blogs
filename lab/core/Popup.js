'use strict';

import React, {
  Component,
  PropTypes,
} from 'react';
// import ReactNative from 'react-native';
import PopupLayer from './PopupLayer';
import requireComp from './lab/requireComp';

let Dialog;
let Loading;

export default class Popup {
  constructor(stack) {
    this._stack = stack;
    this._isShowLoading = false;

    if (!Dialog) {
      Dialog = requireComp('com.Dialog');
      Loading = requireComp('com.Loading');
    }
  }

  _checkStack() {
    if (!this._stack) {
      if (__DEV__) {
        console.warn('Popup必须在componentDidMount之后调用');
      }
      return false;
    }
    return true;
  }

  alert(options) {
    // TODO 默认按钮
    return this.dialog(options);
  }

  confirm(options) {
    return this.dialog(options);
  }

  /**
   * options: {
   *   title: String,
   *   message: String,
   *   contentView, // 内容
   *   buttons: [{
   *     onPress,
   *   }],
   *   autoClose: Boolean, //点击按钮之后是否关闭
   *   onMaskPress,
   * }
   */
  dialog(options) {
    if (!this._checkStack()) {
      return;
    }

    options = {
      autoClose: true,
      ...options,
    };
    let layerId;
    if (options.autoClose) {
      options.buttons = options.buttons.map((button) => {
        return {
          ...button,
          onPress: () => {
            this.hide(layerId);
            button.onPress && button.onPress();
          },
        };
      });
    }

    const layer = (
      <PopupLayer
        renderCustomView={() => {
          return (
            <Dialog
              title={options.title}
              message={options.message}
              buttons={options.buttons}
              contentView={options.contentView}
            />
          );
        }}
        onMaskPress={options.onMaskPress}
      />
    );
    layerId =  this._stack.push(layer);
    return layerId;
  }

  /**
   * options: {
   *   showMask: Boolean, //是否显示遮罩
   *   component: ReactElement, //popup内容element
   *   render: () => ReactElement, //优先级高于component
   * }
   */
  addView(options) {
    if (!this._checkStack()) {
      return;
    }

    options = {
      showMask: true,
      ...options,
    };

    const layer = (
      <PopupLayer
        renderCustomView={options.render || (() => options.component)}
        onMaskPress={options.onMaskPress}
        showMask={options.showMask}
      />
    );
    return this._stack.push(layer);
  }

  /**
   * options: {
   *   showMask,
   *   ... com.Loading props
   * }
   * 
   * TODO 让Loading始终处于最上层?
   */
  showLoading(options) {
    if (!this._checkStack()) {
      return;
    }
    if (this._isShowLoading) return;

    const layer = (
      <PopupLayer
        renderCustomView={() => {
          return <Loading {...options} />;
        }}
        showMask={options && options.showMask}
      />
    );
    this._isShowLoading = this._stack.push(layer);
  }

  hideLoading(cb) {
    if (!this._isShowLoading) return;

    this.hide(this._isShowLoading, cb);
    this._isShowLoading = false;
  }

  hide(id, cb) {
    if (!this._stack) {
      return;
    }
    this._stack.pop(id, cb);
  }
}
