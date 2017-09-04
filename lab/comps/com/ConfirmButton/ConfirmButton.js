'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, { StyleSheet, View, ScrollView, Text } from 'react-native';
import LAB, { Toast, http, globalEmitter, requireComp } from 'lab4';

const Button = requireComp('com.Button');
const Icon = requireComp('com.Icon');

/**
 * 一个提交按钮 基于Button 封装了一些提交简单的处理逻辑
 * 
 * @export
 * @class ConfirmButton
 * @extends {LAB.Component}
 */
export default class ConfirmButton extends LAB.Component {
  static propTypes = {
    text: PropTypes.string,
    iconRight: PropTypes.string,
    message: PropTypes.string,
    btnClass: PropTypes.string,
    subUrl: PropTypes.string,
    data: PropTypes.object,

    reload: PropTypes.bool,
    pop: PropTypes.bool,
    emit: PropTypes.string,
  };

  static defaultProps = {
    btnClass: 'default',
    message: '',
  };

  static contextTypes = {
    ...LAB.Component.componentContextTypes,
  };

  constructor(props, context) {
    super(props, context);
    // this.state = {};
    this.defaultStyles = styles;
    this.onPress = this.onPress.bind(this);
  }

  render() {
    return (
      <Button
        onPress={this.onPress}
        type={this.props.btnType}
        style_class={this.props.btnClass}
      >
        {this.props.text}
      </Button>
    );
  }

  onPress() {
    this.context.popup.confirm({
      title: this.props.title,
      message: this.props.message,
      buttons: [
        {
          text: '取消',
        },
        {
          text: '确定',
          onPress: () => {
            this.props.subUrl &&
              http
                .post(
                  this.props.subUrl,
                  this.props.data && {
                    data: this.props.data,
                  }
                )
                .then(res => {
                  // console.log(res);
                  if (res.CODE == 'ok') {
                    res.MESSAGE && Toast.show(res.MESSAGE);
                    res.DATA.skip_url &&
                      this.context.router.push({
                        url: res.DATA.skip_url,
                      });
                    this.props.reload && this.context.page.loadPageData(true);
                    this.props.pop && this.context.router.pop();
                    this.props.emit && globalEmitter.emit(this.props.emit);
                  } else {
                    res.MESSAGE && Toast.show(res.MESSAGE);
                  }
                })
                .catch(err => {
                  // console.log(err);
                  Toast.show('系统异常');
                });
          },
        },
      ],
    });
  }
}

const styles = StyleSheet.create({});
