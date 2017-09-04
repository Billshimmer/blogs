'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, { StyleSheet, View, Text } from 'react-native';
import LAB from 'lab4';
import { connect } from 'react-redux';

/**
 * 消息红点容器，基于 store
 * 用于洄图消息模块
 * 
 * @class MessageSumView
 * @extends {LAB.Component}
 */
class MessageSumView extends LAB.Component {
  static propTypes = {
    type: PropTypes.oneOf(['system', 'im', 'null', 'all']),
    showNumber: PropTypes.bool, //是否展示数字
  };
  static defaultProps = {
    type: 'all',
    showNumber: false,
  };

  // static contextTypes = {
  //   ...LAB.Component.componentContextTypes,
  // };

  constructor(props, context) {
    super(props, context);
    // this.state = {};
    this.defaultStyles = styles;
  }

  // componentWillUnmount() {}

  render() {
    let temp = 0;
    switch (this.props.type) {
      case 'all':
        temp = this.props.systemCount + this.props.imCount;
        break;
      case 'system':
        temp = this.props.systemCount;
        break;
      case 'im':
        temp = this.props.imCount;
        break;
      default:
        temp = 0;
    }
    let { type, showNumber, systemCount, imCount, ...props } = this.props;
    return (
      <View style={this.getStyle('container')}>
        {this.props.children && LAB.render(this.props.children, ...props)}
        {temp != 0 &&
          this.props.badge &&
          LAB.render(this.props.badge, {
            text: this.props.showNumber ? temp.toString() : ' ',
          })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  // container: {},
});

export default connect(
  state => {
    return {
      systemCount: state.message.systemMessageUnreadCount,
      imCount: state.message.imMessageUnreadCount,
    };
  },
  null,
  null,
  { withRef: true }
)(MessageSumView);
