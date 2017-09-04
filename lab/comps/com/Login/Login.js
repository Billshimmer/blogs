'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  PixelRatio,
  ScrollView,
} from 'react-native';
import LAB, { http, Toast, globalEmitter, requireComp } from 'lab4';
import { connect } from 'react-redux';
import userActions from 'lab4/redux/actions/user';

const Button = requireComp('com.Button');

/**
 * 登陆表单模块 包含提交
 * App内登录原型
 * 
 * @export
 * @class Login
 * @extends {LAB.Component}
 */
export default class Login extends LAB.Component {

  static propTypes = {
    itemHeader: PropTypes.object,
    itemContent: PropTypes.object,
    itemFooterLeft: PropTypes.object,
    itemFooterRight: PropTypes.object,
    submitUrl: PropTypes.string,
    btnClassName: PropTypes.string,
    type: PropTypes.string,
  };

  // static defaultProps = {};

  static contextTypes = {
    ...LAB.Component.componentContextTypes,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      disabled: true,
    };
  }

  //判断button的disabled属性
  _setButton(obj) {
    //判断是否为空
    if (typeof obj === 'object' && !(obj instanceof Array)) {
      var hasProp = false;
      for (var prop in obj) {
        hasProp = true;
        break;
      }
      if (hasProp) {
      } else {
        return false;
      }
    }
    //判断所有字段
    let flag = true;
    for (let p in obj) {
      if (obj[p] == undefined || obj[p] == '') {
        flag = false;
      }
    }
    return flag;
  }

  loginSuccess(user) {
    let flag = this.context.page.props.route.redirect;
    globalEmitter.emit('LOGIN_SUCCESS', user);
    if (flag == undefined || flag.navType == 'push') {
      this.context.router.pop();
    }
    if (flag && flag.navType == 'replace') {
      flag.originalRoute.url &&
        !flag.originalRoute.comp &&
        this.context.router.replace({ url: flag.originalRoute.url });
      flag.originalRoute.comp &&
        this.context.router.replace({ comp: flag.originalRoute.comp });
    }
  }

  _handlePress() {
    //按钮提交的验证
    let result = this.refs.loginForm.validate();
    if (result.isValid) {
      let res = this.refs.loginForm.getValue();
      if (this.props.type && this.props.type != undefined) {
        res.type = this.props.type;
      }

      userActions
        .login(res)
        .then(user => {
          this.loginSuccess(user);
        })
        .catch(e => {
          // console.log(e);
          this.context.popup.alert({
            message: e.isErrorResponse ? e.message : '请查看网络连接',
            buttons: [
              {
                text: '确定',
              },
            ],
          });
        });
    } else {
      for (let p in result.error) {
        if (!result.error[p].isValid) {
          this.context.popup.alert({
            message: result.error[p].message,
            buttons: [
              {
                text: '确定',
              },
            ],
          });
          return false;
        }
      }
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView
          style={this.getStyle('main')}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="always"
          contentContainerStyle={{ flex: 1 }}
        >
          <View style={this.getStyle('Viewmain')}>
            <View style={this.getStyle('header')}>
              {LAB.render(this.props.itemHeader, {
                style: this.getStyle('headerContent'),
              })}
            </View>

            {LAB.render(this.props.itemContent, {
              ref: 'loginForm',
              style: { paddingLeft: 12, paddingRight: 12 },
              onValueChange: value => {
                this.setState({
                  disabled: !this._setButton(value),
                });
              },
            })}

            <Button
              disabled={this.state.disabled}
              style_class={this.props.btnClassName}
              style={this.getStyle('btn')}
              onPress={this._handlePress.bind(this)}
            >
              登录
            </Button>
            {this.props.itemThirdParty && LAB.render(this.props.itemThirdParty)}
          </View>
          <View style={this.getStyle('itemFooter')}>
            {this.props.itemFooterLeft
              ? LAB.render(this.props.itemFooterLeft)
              : null}
            {this.props.itemFooterRight
              ? LAB.render(this.props.itemFooterRight)
              : null}
          </View>
        </ScrollView>
      </View>
    );
  }
}

// const styles = StyleSheet.create({});

// export default connect()(Login);
