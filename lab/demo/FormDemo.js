'use strict';

import React, {
  Component,
  PropTypes,
} from 'react';
import ReactNative, {
  
  StyleSheet,
  Platform,
  View,
  Text,
  ScrollView,
  TextInput,
  Picker
} from 'react-native';

import LAB, {
  Page,
  utils,
  requireComp,
} from 'lab4';

import SimplePage from 'lab4/demo/SimplePage';
import TestHelper from 'lab4/demo/TestHelper';

const Form = LAB.requireComp('com.form.Form');
const TextInputField = LAB.requireComp('com.form.TextInputField');
const PwdInputField = LAB.requireComp('com.form.PwdInputField');
const CodeInputField = LAB.requireComp('com.form.CodeInputField');
const TextareaField = LAB.requireComp('com.form.TextareaField');

export default class FormDemo extends SimplePage {

  constructor(props, context) {
    super(props, context);

    this.configPage({
      scrollable: true,
    });

    this.state = {
      value: {

      },
      defaultValue: {
        phone: '',
        pwd: '',
        textarea: '',
      },
    };
  }

  _generateRandomStr() {
    if (Math.random() > 0.5) {
      return '';
    }
    return String(Math.random());
  }

  _generateRandomNum() {
    if (Math.random() > 0.5) {
      return '';
    }
    return String(Math.round(Math.random() * 100000000));
  }

  testUpdateFieldDefaultValue() {
    this.setState({
      defaultValue: {
        phone: this._generateRandomNum(),
        pwd: this._generateRandomStr(),
        textarea: this._generateRandomStr(),
      },
    });
  }

  testGetValue() {
    console.log(this.refs.form.getValue());
  }

  testGetError() {
    console.log(this.refs.form.getError());
  }

  testValidate() {
    console.log(this.refs.form.validate());
  }

  testSetError() {
    this.refs.form.setError({
      phone: {
        isValid: false,
        message: 'xxxx set xxxx'
      }
    });
  }

  renderContent() {
    let a = (
      <View style={styles.container}>
        <Form
          ref="form"
          onValueChange={(value) => {
            console.log('onChange value:', value);
          }}
          defaultValue={this.state.defaultValue}
          onValidationChange={(error) => {
            console.log('onValidationChange error', error);
          }}
          validator={{
            phone: {
              validator: 'isMobilePhone', //验证为手机号类型  更多可用的验证器参考 lab4/basiccomps/Form/Validator //https://github.com/chriso/validator.js
              arguments: 'zh-CN',
              message: '手机号码不合法!',
            },
            pwd: {
              validator: 'password1', //使用扩展的password1 类型验证密码大于6且小于18
            },
            textarea: {
              validator: 'notNull', //扩展的不为空验证
              message: '不能为空!',
            },
            input1: {
              validator: (value) => {  //使用自定义函数作为验证器
                if (!value) {
                  return {
                    isValid: false,
                    message: '不能为空!'
                  };
                }
                return {
                  isValid: true,
                };
              },
            },
          }}
          style={{}}>
          <View><Text>xxxx</Text></View>
          <TestComp />
          <View style={{borderTopWidth:1,borderColor:'#d9d9d9'}}></View>
          <TextInputField
            name="phone"
            label="手机号"
            defaultValue={this.state.defaultValue.phone}
            />
          <View style={{borderTopWidth:1,borderColor:'#d9d9d9'}}></View>
          <PwdInputField
            name="pwd"
            label="密 码"
            defaultValue={this.state.defaultValue.pwd}
            />
          <View style={{borderTopWidth:1,borderColor:'#d9d9d9'}}></View>
          <CodeInputField
            name="code"
            label="验证码"
            lname='phone'
            url=''/>
          <View style={{borderTopWidth:1,borderColor:'#d9d9d9'}}></View>
          <TextareaField
            defaultValue={this.state.defaultValue.textarea}
            name='textarea'
            maxLength={200}
            placeholder='请输入评论'/>
          <TextInputField
            name="input1"
            label="input1"
            />

        </Form>
        {this.renderTestBtns()}
      </View>
    );
    console.log(a);
    return a;
  }
}

class TestComp extends Component {

  constructor() {
    super();
    console.log('TestComp constructor');
  }

  render() {
    return null;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
