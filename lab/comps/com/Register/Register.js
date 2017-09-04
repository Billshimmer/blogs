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
import LAB, { http, Parse, User, requireComp } from 'lab4';
import { connect } from 'react-redux';
import userActions from 'lab4/redux/actions/user';

const Button = requireComp('com.Button');

/**
 * 注册模块表单，包含提交逻辑
 * App内注册原型
 * 
 * @export
 * @class Register
 * @extends {LAB.Component}
 */
export default class Register extends LAB.Component {
  static propTypes = {
    itemHeader: PropTypes.object,
    itemContent: PropTypes.object,
    itemFooter: PropTypes.object,
    submitUrl: PropTypes.string,
    btnClassName: PropTypes.string,
    linkUrl: PropTypes.string,
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

  _handlePress() {
    //按钮提交的验证
    let result = this.refs.registerForm.validate();
    if (result.isValid) {
      //验证前后密码
      if (this.refs.registerForm.getField('password2') != undefined) {
        if (
          this.refs.registerForm.getField('password2').getValue() !=
          this.refs.registerForm.getField('password').getValue()
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
      }

      if (this.props.submitUrl) {
        let res = this.refs.registerForm.getValue();
        if (this.props.type && this.props.type != undefined) {
          res.type = this.props.type;
        }
        http
          .post(this.props.submitUrl, {
            data: res,
          })
          .then(response => {
            // console.log(JSON.stringify(response));
            if (response.CODE == 'ok') {
              this.context.popup.alert({
                message: '注册成功',
                buttons: [
                  {
                    text: '确定',
                    onPress: function() {
                      if (response.DATA.user_info) {
                        User.unsafeUpdateCurrentUser(response.DATA.user_info)
                          .then(user => {
                            userActions.dispatchLogin(user);
                          })
                          .catch(e => {
                            //保存本地数据失败，一般不会发生
                            if (__DEV__) console.log('unsafeUpdateCurrentUser error', e);
                          });
                      }
                      if (this.props.linkUrl && this.props.linkUrl != '') {
                        this.context.router.push({ url: this.props.linkUrl });
                      } else {
                        this.context.router.pop();
                      }
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
          style={this.getStyle('container')}
          keyboardShouldPersistTaps="always"
          contentContainerStyle={ this.getStyle('containerScrollStyle') }
        >
          <View style={this.getStyle('Viewmain')}>
            <View style={this.getStyle('header')}>
              {LAB.render(this.props.itemHeader, {
                style: this.getStyle('headerContent'),
              })}
            </View>

            {LAB.render(this.props.itemContent, {
              ref: 'registerForm',
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
              注册
            </Button>
          </View>
          <View style={this.getStyle('footer')}>
            <Text style={this.getStyle('footerText')}>轻触上面的“注册”按钮，即表示你同意</Text>
            {LAB.render(this.props.itemFooter)}
          </View>
        </ScrollView>
      </View>
    );
  }
}

// const styles = StyleSheet.create({});
