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
import LAB, { http, Toast, User, requireComp } from 'lab4';
import { connect } from 'react-redux';
import userActions from 'lab4/redux/actions/user';

const Button = requireComp('com.Button');

/**
 * 绑定手机模块（手机号、验证码） 基本通用 特殊需求可以根据这份扩展
 * 
 * @export
 * @class BindMoblie
 * @extends {LAB.Component}
 */
export default class BindMoblie extends LAB.Component {
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
      let hasProp = false;
      for (let prop in obj) {
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
    // console.log(this.props.submitUrl);
    let result = this.refs.registerForm.validate();
    if (result.isValid) {
      if (this.props.submitUrl) {
        let res = this.refs.registerForm.getValue();
        if (this.props.type && this.props.type != undefined) {
          res.type = this.props.type;
        }
        http
          .post(this.props.submitUrl, {
            data: {
              ...res,
              ...this.props.data,
            },
          })
          .then(response => {
            // console.log(JSON.stringify(response));
            if (response.CODE == 'ok') {
              this.context.popup.alert({
                message: '绑定成功',
                buttons: [
                  {
                    text: '确定',
                    onPress: () => {
                      if (response.DATA.user) {
                        User.unsafeUpdateCurrentUser(response.DATA.user)
                          .then(user => {
                            userActions.dispatchLogin(user);
                            // this.props.linkUrl
                            // console.log(this.props.linkUrl);
                            this.props.linkUrl &&
                              this.context.router.resetTo({
                                url: this.props.linkUrl,
                              });
                          })
                          .catch(e => {
                            //保存本地数据失败，一般不会发生
                            Toast.show('系统错误');
                            // console.log('unsafeUpdateCurrentUser error', e);
                          });
                      } else {
                        Toast.show('系统错误');
                        this.context.router.pop();
                      }
                    },
                  },
                ],
              });
            } else {
              Toast.show(response.MESSAGE.toString(), {
                position: Toast.Position.CENTER,
              });
            }
          })
          .catch(error => {
            Toast.show('系统错误');
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
          contentContainerStyle={{ justifyContent: 'space-around', flex: 1 }}
        >
          <View style={this.getStyle('Viewmain')}>
            <View style={this.getStyle('header')}>
              {this.props.itemHeader &&
                LAB.render(this.props.itemHeader, {
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
              绑定
            </Button>
          </View>
          <View style={this.getStyle('footer')}>
            {this.props.itemFooter &&
              <Text style={this.getStyle('footerText')}>
                轻触上面的“绑定”按钮，即表示你同意
              </Text>}
            {this.props.itemFooter && LAB.render(this.props.itemFooter)}
          </View>
        </ScrollView>
      </View>
    );
  }
}

// const styles = StyleSheet.create({});
