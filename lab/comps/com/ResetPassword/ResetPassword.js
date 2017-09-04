'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, {
  StyleSheet,
  Text,
  View,
  TextInput,
  Platform,
} from 'react-native';
import LAB, { http, globalEmitter, requireComp } from 'lab4';

const Button = requireComp('com.Button');

/**
 * 找回密码表单，包含提交逻辑
 * App内找回密码原型
 * 
 * @export
 * @class ResetPassword
 * @extends {LAB.Component}
 */
export default class ResetPassword extends LAB.Component {
  static propTypes = {
    codeUrl: PropTypes.string,
    submitUrl: PropTypes.string,
    placeholder: PropTypes.string,
    btnClassName: PropTypes.string,
    reg: PropTypes.string,
    type: PropTypes.string,
    itemContent: PropTypes.object,
    message: PropTypes.string,
  };

  static defaultProps = {
    placeholder: '请设置密码',
    btnClassName: 'default',
  };

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
    let result = this.refs.ResetPassword.validate();
    if (result.isValid) {
      if (this.props.submitUrl) {
        let res = this.refs.ResetPassword.getValue();

        //密码的验证
        if (res['password'].length < 6) {
          // console.log(res['password'].length);
          this.context.popup.alert({
            message: this.props.message || '请输入正确格式的密码',
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
              message: this.props.message || '请输入正确格式的密码',
              buttons: [
                {
                  text: '确定',
                },
              ],
            });
            return false;
          }
        }

        //是否存在type
        if (this.props.type && this.props.type != undefined) {
          res.type = this.props.type;
        }

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
                    onPress: () => {
                      this.context.router.pop();
                    },
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
      <View style={styles.container}>

        {LAB.render(this.props.itemContent, {
          ref: 'ResetPassword',
          style: {
            backgroundColor: '#FFFFFF',
            paddingLeft: 12,
            paddingRight: 12,
          },
          onValueChange: value => {
            this.setState({
              disabled: !this._setButton(value),
            });
          },
          validator: {
            mobile: {
              validator: 'isMobilePhone',
              arguments: 'zh-CN',
              message: '请输入正确的手机号码',
            },
            mobile_code: {
              validator: function(value) {
                if (/^\d{4}$/.test(value)) {
                  return true;
                }
              },
              message: '请输入正确的数字验证码',
            },
          },
        })}

        <Button
          style={styles.btn}
          disabled={this.state.disabled}
          style_class={this.props.btnClassName}
          onPress={this._handlePress.bind(this)}
        >
          确定
        </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  btn: {
    marginTop: 30,
    marginLeft: 12,
    marginRight: 12,
  },
});
