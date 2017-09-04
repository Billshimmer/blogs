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

import { Page, requireComp } from 'lab4';

import SimplePage from 'lab4/demo/SimplePage';
import TestHelper from 'lab4/demo/TestHelper';

const Register = requireComp('com.Register');

export default class RegisterDemo extends SimplePage {
  constructor(props, context) {
    super(props, context);
    this.state = {};
  }

  test1() {}

  test2() {}

  renderContent() {
    return (
      <Register
        itemContent={{
          ui_type: 'com.form.Form',
          validator: {
            phone: {
              validator: 'isMobilePhone',
              arguments: 'zh-CN',
              message: '请输入正确的手机号码',
            },
            password1: {
              validator: 'password1',
            },
            email: {
              validator: 'isEmail',
              message: '请输入正确的邮箱',
            },
            code: {
              validator: function(value) {
                if (/^\d{4}$/.test(value)) {
                  return true;
                }
              },
              message: '请输入四位数字验证码',
            },
          },
          children: [
            {
              ui_type: 'com.form.TextInputField',
              name: 'phone',
              label: '+86',
              placeholder: '请输入你的手机号码',
            },
            { ui_type: 'com.Line', color: '#E8E8E8', size: 1 },
            {
              ui_type: 'com.form.CodeInputField',
              name: 'code',
              label: '验证码',
              lname: 'phone',
              url: '#',
              placeholder: '请输入四位数字码',
            },
            { ui_type: 'com.Line', color: '#E8E8E8', size: 1 },
            {
              ui_type: 'com.form.TextInputField',
              name: 'nickName',
              label: '昵称',
              placeholder: '请输入你的昵称',
            },
            { ui_type: 'com.Line', color: '#E8E8E8', size: 1 },
            {
              ui_type: 'com.form.TextInputField',
              name: 'email',
              label: '邮箱',
              placeholder: '免费收取文献和指南',
            },
            { ui_type: 'com.Line', color: '#E8E8E8', size: 1 },
            {
              ui_type: 'com.form.PwdInputField',
              name: 'password1',
              label: '登录密码',
              placeholder: '请输入六位数字密码',
            },
            { ui_type: 'com.Line', color: '#E8E8E8', size: 1 },
            {
              ui_type: 'com.form.PwdInputField',
              name: 'password2',
              label: '确认密码',
              placeholder: '请再输入六位数字密码',
            },
            { ui_type: 'com.Line', color: '#E8E8E8', size: 1 },
          ],
        }}
        itemHeader={{
          ui_type: 'com.Image',
          uri: 'http://facebook.github.io/react/img/logo_og.png',
        }}
        itemFooter={{
          ui_type: 'com.Link',
          children: { ui_type: 'com.Text', children: '风湿届服务协议' },
          type: 'pop',
        }}
        submitUrl="#"
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
