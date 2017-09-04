'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, {
  StyleSheet,
  Platform,
  Text,
  View,
  Image,
} from 'react-native';
import LAB, { http, Toast, User, requireComp } from 'lab4';
import { connect } from 'react-redux';
import userActions from 'lab4/redux/actions/user';

const Form = requireComp('com.form.Form');
const TextInputField = requireComp('com.form.TextInputField');
const Button = requireComp('com.Button');

/**
 * 一个跳页输入表单组件
 * 嵌入 CenterInputPage 与 LinkInputField 组合使用
 * 
 * @export
 * @class CenterInput
 * @extends {LAB.Component}
 */
export default class CenterInput extends LAB.Component {
  static defaultProps = {
    multiline: false,
  };

  static contextTypes = {
    ...LAB.Component.componentContextTypes,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      disabled: true,
    };

    this._onPress = this._onPress.bind(this);
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

  _onPress() {
    let res = this.refs.CenterInput.getValue();

    if (this.props.reg && this.props.reg != undefined) {
      if (!eval(this.props.reg).test(res[this.props.name])) {
        Toast.show('输入有误', { position: Toast.Position.CENTER });
        return false;
      }
    }

    if (this.props.submitUrl && this.props.submitUrl.length) {
      http
        .post(this.props.submitUrl, {
          data: res,
        })
        .then(response => {
          if (response.CODE == 'ok') {
            Toast.show('操作成功');
            let value = this.refs.CenterInput.getValue();
            this.props.setValue && this.props.setValue(value[this.props.name]);

            if (!User.isLoggedIn()) {
              // console.log('!isLoggedIn');
              this.context.router.pop();
              return;
            }
            let user = User.current();
            user.set(res);
            user
              .save()
              .then(user => {
                // console.log('save success');
                userActions.dispatchUpdateUser(user);
              })
              .catch(e => {
                if (__DEV__) console.warn('save error', e);
              });

            this.context.router.pop();
          } else {
            this.context.popup.alert({
              message: response.message,
              buttons: [
                {
                  text: '确定',
                },
              ],
            });
          }
        })
        .catch(error => {
          if (__DEV__) console.warn(error);
        });
    } else {
      let value = this.refs.CenterInput.getValue();
      this.props.setValue && this.props.setValue(value[this.props.name]);
      this.context.router.pop();
    }
  }

  render() {
    return (
      <View>
        <Form
          onValueChange={value => {
            this.setState({
              disabled: !this._setButton(value),
            });
          }}
          ref="CenterInput"
          style={styles.form}
        >
          <TextInputField
            label={this.props.label}
            name={this.props.name}
            placeholder={this.props.placeholder}
            defaultValue={this.props.defaultValue}
            multiline={this.props.multiline}
            style_class={this.props.styleClass}
          />
        </Form>
        {this.props.submitUrl && this.props.submitUrl.length
          ? <Button
              style_class="long-default"
              disabled={this.state.disabled}
              style={styles.button}
              onPress={this._onPress.bind(this)}
            >
              保存
            </Button>
          : <Button
              style_class="long-default"
              disabled={this.state.disabled}
              style={styles.button}
              onPress={this._onPress.bind(this)}
            >
              确定
            </Button>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    margin: 12,
  },
  form: {
    paddingLeft: 12,
    marginTop: 12,
    backgroundColor: '#FFFFFF',
  },
});
