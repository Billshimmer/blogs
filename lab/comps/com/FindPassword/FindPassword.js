'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, {
  StyleSheet,
  Text,
  View,
  TextInput,
  Platform,
} from 'react-native';
import LAB, { http, requireComp } from 'lab4';

const Form = requireComp('com.form.Form');
const TextInputField = requireComp('com.form.TextInputField');
const Line = requireComp('com.Line');
const CodeInputField = requireComp('com.form.CodeInputField');
const PwdInputField = requireComp('com.form.PwdInputField');
const Button = requireComp('com.Button');

/**
 * 找回密码块
 * 
 * @export
 * @class FindPassword
 * @extends {LAB.Component}
 */
export default class FindPassword extends LAB.Component {
  static propTypes = {
    codeUrl: PropTypes.string,
    submitUrl: PropTypes.string,
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
    let result = this.refs.FindPassword.validate();
    if (result.isValid) {
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
        let res = this.refs.FindPassword.getValue();
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
                      this.context.router.pop();
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
          alert(result.error[p].message);
          return false;
        }
      }
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Form
          ref="FindPassword"
          onValueChange={value => {
            this.setState({
              disabled: !this._setButton(value),
            });
          }}
          validator={{
            mobile: {
              validator: 'isMobilePhone',
              arguments: 'zh-CN',
              message: '请输入正确的手机号码',
            },
            password: {
              validator: function(value) {
                if (/^\d{6}$/.test(value)) {
                  return true;
                }
              },
              message: '请输入六位数字密码',
            },
            mobile_code: {
              validator: function(value) {
                if (/^\d{4}$/.test(value)) {
                  return true;
                }
              },
              message: '请输入四位数字验证码',
            },
          }}
        >
          <TextInputField
            label="手机号码"
            enableClearBtn={false}
            name="mobile"
            placeholder="请输入11位手机号码"
          />
          <Line color="#E8E8E8" size={1} />
          <CodeInputField
            name="mobile_code"
            url={this.props.codeUrl}
            label="验证码"
            lname="mobile"
            placeholder="请输入4位数字码"
            maxLength={4}
          />
          <Line color="#E8E8E8" size={1} />
          <PwdInputField
            name="password"
            label="新密码"
            placeholder="请输入6位数字密码"
            maxLength={6}
          />
          <Line color="#E8E8E8" size={1} />
          <PwdInputField
            name="password2"
            label="确认密码"
            placeholder="请再输入6位数字密码"
            maxLength={6}
          />
          <Line color="#E8E8E8" size={1} />
        </Form>

        <Button
          style={styles.btn}
          disabled={this.state.disabled}
          style_class="default"
          onPress={this._handlePress.bind(this)}
        >
          确认修改
        </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 12,
  },
  btn: {
    marginTop: 40,
  },
});
