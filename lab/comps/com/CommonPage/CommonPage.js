'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, { StyleSheet, View, Text } from 'react-native';
import LAB, { Page } from 'lab4';

export default class CommonPage extends Page {
  static propTypes = {
    header: PropTypes.object,
    content: PropTypes.object,
    footer: PropTypes.object,
    dialogs: PropTypes.arrayOf(
      PropTypes.shape({
        event: PropTypes.string,
        dialog: PropTypes.object,
        onMaskClose: PropTypes.bool,
      })
    ),
  };

  constructor(props, context) {
    super(props, context);
    this._initDialog();
  }

  componentWillReceiveProps(nextProps) {
    super.componentWillReceiveProps(nextProps);
    if (this.props.dialogs != nextProps.dialogs) {
      this._initDialog();
    }
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    if (__DEV__) {
      //由于使用页面的事件总线，订阅者与事件总线本身生命周期相同，所以为了效率考虑只在dev模式取消绑定(为了方便检查内存泄漏)
      this._unBindDialogEmit();
    }
  }

  _unBindDialogEmit() {
    if (this._dialogEmitTag) {
      this.pageEmitter.offByTag(this._dialogEmitTag);
      this._dialogEmitTag = null;
    }
  }

  _initDialog() {
    this._unBindDialogEmit();
    if (this.props.dialogs) {
      this._dialogEmitTag = Object.create(null);
      this.props.dialogs.forEach((data, index) => {
        this.pageEmitter.on(
          data.event,
          () => {
            this.context.popup.addView({
              component: LAB.render(data.dialog),
              onMaskPress: () => {
                if (data.onMaskClose !== false) {
                  this.context.popup.hide();
                }
              },
            });
          },
          this,
          this._dialogEmitTag
        );
      });
    }
  }

  onLoadResponse(response) {
    if (__DEV__) {
      if (!this.props.pageContainer) {
        throw new Error('CommonPage必须使用PageContainer加载');
      }
    }
    this.props.pageContainer && this.props.pageContainer.changeData(response);
  }

  renderHeader() {
    return this.props.header && LAB.render(this.props.header);
  }

  renderContent() {
    return this.props.content && LAB.render(this.props.content);
  }

  renderFooter() {
    return this.props.footer && LAB.render(this.props.footer);
  }
}
