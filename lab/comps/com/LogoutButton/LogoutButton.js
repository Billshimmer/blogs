'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, { StyleSheet } from 'react-native';
import LAB, { globalEmitter, requireComp } from 'lab4';
import userActions from 'lab4/redux/actions/user';

const Button = requireComp('com.Button');

/**
 * 登出按钮
 * 
 * @export
 * @class LogoutButton
 * @extends {LAB.Component}
 */
export default class LogoutButton extends LAB.Component {
  static propTypes = {
    children: PropTypes.string,
    button_class: PropTypes.string,
    message: PropTypes.string,
  };

  static defaultProps = {
    message: '确定退出登录吗?',
  };

  static contextTypes = {
    ...LAB.Component.componentContextTypes,
  };

  constructor(props, context) {
    super(props, context);
    this._onPress = this._onPress.bind(this);
  }

  _onPress() {
    this.context.popup.confirm({
      message: this.props.message,
      buttons: [
        {
          text: '取消',
        },
        {
          text: '确定',
          onPress: () => {
            userActions
              .logout()
              .then(() => {
                globalEmitter.emit('LOGOUT_SUCCESS');
                // console.log('logout success');
              })
              .catch(e => {
                if (__DEV__) console.log('logout error', e);
              });
          },
        },
      ],
    });
  }

  render() {
    return (
      <Button style_class={this.props.button_class} onPress={this._onPress}>
        {this.props.children}
      </Button>
    );
  }
}
