'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, {
  StyleSheet,
  Text,
  View,
  TextInput,
  Platform,
} from 'react-native';

import LAB, { http, globalEmitter, EventConstants } from 'lab4';

export default class UpdatePassword extends LAB.Component {
  static propTypes = {
    submitUrl: PropTypes.string,
    itemContent: PropTypes.object,
  };

  // static defaultProps = {};

  static contextTypes = {
    ...LAB.Component.componentContextTypes,
  };

  constructor(props, context) {
    super(props, context);
    // this.state = {};
  }

  componentDidMount() {
    globalEmitter.on('LAB_UPDATEPASSWORD', this._handlePress, this);
  }

  _handlePress() {
    let res = this.refs.FindPassword && this.refs.FindPassword.getValue();
    if (res == undefined) {
      return false;
    }
    if (res['old_password'] == undefined || res['password'] == undefined) {
      this.context.popup.alert({
        message: '请输入密码',
        buttons: [
          {
            text: '确定',
          },
        ],
      });
      return false;
    }

    if (this.props.reg) {
      if (!eval(this.props.reg).test(res['password'])) {
        this.context.popup.alert({
          message: '请输入正确格式的密码',
          buttons: [
            {
              text: '确定',
            },
          ],
        });
        return false;
      }
    }

    if (
      this.refs.FindPassword.getField('password').getValue() !=
      this.refs.FindPassword.getField('password2').getValue()
    ) {
      this.context.popup.alert({
        message: '前后密码不一致',
        buttons: [
          {
            text: '确定',
          },
        ],
      });
      return false;
    }

    if (this.props.submitUrl) {
      http
        .post(this.props.submitUrl, {
          data: res,
        })
        .then(response => {
          if (response.CODE == 'ok') {
            this.context.popup.alert({
              message: '操作成功',
              buttons: [
                {
                  text: '确定',
                  onPress: function() {
                    this.context.router.popToTop();
                    globalEmitter.emit(EventConstants.LOGGED_OUT);
                  }.bind(this),
                },
              ],
            });
          } else {
            this.context.popup.alert({
              message: response.MESSAGE,
              buttons: [
                {
                  text: '确定',
                },
              ],
            });
          }
        })
        .catch(error => {
          this.context.popup.alert({
            message: '请求超时',
            buttons: [
              {
                text: '确定',
              },
            ],
          });
        });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {LAB.render(this.props.itemContent, { ref: 'FindPassword' })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 12,
    paddingRight: 12,
    backgroundColor: '#ffffff',
  },
});
