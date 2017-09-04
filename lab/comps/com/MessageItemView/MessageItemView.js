'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, { StyleSheet, View, Text } from 'react-native';
import LAB, { http, globalEmitter, requireComp } from 'lab4';
import { connect } from 'react-redux';

const Touchable = requireComp('com.Touchable');
const Badge = requireComp('com.Badge');

/**
 * 消息红点容器，用于车险
 * 
 * @export
 * @class MessageItemView
 * @extends {LAB.Component}
 */
export default class MessageItemView extends LAB.Component {
  static propTypes = {
    flag: PropTypes.bool, //初始状态
    badge: PropTypes.object,
    checkUrl: PropTypes.string, //通知后台已点击
    linkUrl: PropTypes.string, //点击转跳
    beReadEmit: PropTypes.string, //订阅事件 如全部已读 取消红点
    readEmit: PropTypes.string, //发送事件 点击checkUrl后拿到res触发
  };

  // static defaultProps = {};

  static contextTypes = {
    ...LAB.Component.componentContextTypes,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      flag: this.props.flag,
    };

    this.defaultStyles = styles;
    this.onPress = this.onPress.bind(this);
    this._beRead = this._beRead.bind(this);
  }

  componentWillUnmount() {
    globalEmitter.offByTag(this);
  }

  componentDidMount() {
    globalEmitter.on(this.props.beReadEmit, this._beRead, this);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.flag != this.props.flag) {
      this.setState({
        flag: newProps.flag,
      });
    }
  }

  render() {
    let {
      flag,
      checkUrl,
      linkUrl,
      beReadEmit,
      children,
      badge,
      ...props
    } = this.props;
    return (
      <Touchable
        style={this.getStyle('container')}
        disableLinkEmit={true}
        onPress={this.onPress}
      >
        {this.props.children && LAB.render(this.props.children, ...props)}
        {this.state.flag && this.props.badge && LAB.render(this.props.badge)}
      </Touchable>
    );
  }

  onPress() {
    if (this.state.flag) {
      this.setState({ flag: false });
      this.props.checkUrl &&
        http
          .fetch(this.props.checkUrl)
          .then(res => {
            // console.log(res);
            res.CODE == 'ok' &&
              this.props.readEmit &&
              globalEmitter.emit(this.props.readEmit, res.DATA);
          })
          .catch(err => {
            if (__DEV__) console.log(err);
          });
    }

    this.props.linkUrl &&
      this.context.router.push({
        url: this.props.linkUrl,
      });
  }

  _beRead() {
    this.setState({
      flag: false,
    });
  }
}

const styles = StyleSheet.create({
  // container: {},
});
