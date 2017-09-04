'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, { StyleSheet, Text, View, TextInput } from 'react-native';
import LAB, { http, Toast, requireComp } from 'lab4';
import BaseFormField from 'lab4/basiccomps/Form/BaseFormField';

const Button = requireComp('com.Button');

export default class CodeInputField extends BaseFormField {
  static propTypes = {
    ...BaseFormField.propTypes,
    placeholder: PropTypes.string,
    placeholderTextColor: PropTypes.string,
    lname: PropTypes.string,
    url: PropTypes.string,
    btnClassName: PropTypes.string,
    maxLength: PropTypes.number,
    type: PropTypes.string,
  };

  static defaultProps = {
    ...BaseFormField.defaultProps,
    placeholder: '请输入验证码',
    placeholderTextColor: '#BCBCBC',
    maxLength: 6,
  };

  static contextTypes = {
    ...LAB.Component.componentContextTypes,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      disabled: true,
      msg: '发送验证码',
      num: 60,
    };
    this.doing = false; //防止连点
  }

  componentWillReceiveProps(nextProps) {
    super.componentWillReceiveProps(nextProps);
    let names = this.props.lname.split(',');
    let disabled = names && names.length ? false : true;
    for (let name of names) {
      if (
        this.props.form.getField(name) &&
        typeof this.props.form.getField(name).getValue() != 'undefined'
      ) {
        if (this.props.form.getField(name).getValue().length) {
          continue;
        } else {
          disabled = true;
          break;
        }
      } else {
        disabled = true;
        break;
      }
    }

    this.setState({
      disabled: disabled,
    });
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    clearInterval(this.timer);
  }

  componentWillUpdate() {
    if (this.state.num <= 0) {
      clearInterval(this.timer);
      this.setState({
        msg: '重新发送',
        num: 60,
        disabled: false,
      });
    }
  }

  send() {
    let names = this.props.lname.split(',');
    if (!names || !names.length) {
      return;
    }

    let mobile = this.props.form.getField(names[0]).getValue();
    mobile = mobile.trim();

    if (!/^1[34578]\d{9}$/.test(mobile)) {
      this.context.popup.alert({
        message: '请输入正确的手机号码',
        buttons: [
          {
            text: '确定',
          },
        ],
      });
      return false;
    }

    let data = {};
    for (let name of names) {
      data[name] = this.props.form.getField(name).getValue();
    }

    if (this.props.type) {
      data.type = this.props.type;
    }

    if (this.props.url) {
      if (!this.doing) {
        this.doing = true;
        http
          .post(this.props.url, {
            data,
          })
          .then(response => {
            // console.log(response);
            if (response.CODE == 'ok') {
              if (this.state.msg == '发送验证码' || this.state.msg == '重新发送') {
                this.setState({ disabled: true });
                clearInterval(this.timer);
                this.timer = setInterval(() => {
                  this.setState({
                    msg: this.state.num + 's',
                    num: this.state.num - 1,
                  });
                }, 1000);
              }
              Toast.show('验证码已发送，请注意查收', { position: Toast.Position.CENTER });
            } else {
              this.context.popup.alert({
                message: response.MESSAGE,
                buttons: [{ text: '确定' }],
              });
            }
          })
          .catch(error => {})
          .finally(() => {
            this.doing = false;
          });
      }
    } else {
      Toast.show('网络异常');
    }
  }

  renderContent() {
    let str = this.props.btnClassName ? this.props.btnClassName : 'CodeInput';
    return (
      <View style={styles.main}>
        <TextInput
          style={this.getStyle('textInput')}
          ref="CodeInput"
          onChangeText={this.onValueChange}
          placeholder={this.props.placeholder}
          maxLength={this.props.maxLength}
          autoCapitalize="none"
          placeholderTextColor={this.props.placeholderTextColor}
          underlineColorAndroid="transparent"
          keyboardType="numeric"
        />
        <Button
          disabled={this.state.disabled}
          style_class={str}
          onPress={this.send.bind(this)}
        >
          {this.state.msg}
        </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden',
  },
});
