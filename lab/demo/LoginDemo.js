'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, {
  StyleSheet,
  Platform,
  View,
  Text,
  ScrollView,
  Image,
  PixelRatio,
} from 'react-native';

import LAB, { Page, Link, requireComp } from 'lab4';
import SimplePage from 'lab4/demo/SimplePage';
import TestHelper from 'lab4/demo/TestHelper';

const Login = requireComp('com.Login');

export default class LoginDemo extends SimplePage {
  constructor(props, context) {
    super(props, context);
    this.state = {};
  }

  test1() {}

  test2() {}

  test3() {}

  renderContent() {
    return (
      <Login
        itemContent={{
          ui_type: 'com.form.Form',
          validator: {},
          children: [
            {
              ui_type: 'com.form.TextInputField',
              name: 'login_name',
              label: '+86',
              placeholder: '请输入你的手机号码',
            },
            {
              ui_type: 'com.Line',
              color: '#E8E8E8',
              size: 1,
              marginRight: -12,
            },
            {
              ui_type: 'com.form.PwdInputField',
              name: 'password',
              label: '登录密码',
              placeholder: '请输入六位密码',
            },
            {
              ui_type: 'com.Line',
              color: '#E8E8E8',
              size: 1,
              marginRight: -12,
            },
          ],
        }}
        itemHeader={{
          ui_type: 'com.Image',
          uri: 'http://facebook.github.io/react/img/logo_og.png',
        }}
        itemFooterLeft={{ ui_type: 'com.Text', children: '无法登录?' }}
        itemFooterRight={{ ui_type: 'com.Text', children: '新用户' }}
        submitUrl="/User/Index/login"
        btnClassName="default"
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
