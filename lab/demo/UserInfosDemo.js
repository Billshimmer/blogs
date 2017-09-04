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

const HeadImagePicker = requireComp('com.HeadImagePicker');
const Button = requireComp('com.Button');
const MultiImagePicker = requireComp('com.MultiImagePicker');
const Line = requireComp('com.Line');
const UserInfos = requireComp('com.UserInfos');

export default class UserInfosDemo extends SimplePage {
  constructor(props, context) {
    super(props, context);
  }

  test1() {}

  test2() {}

  ceshi() {
    console.log(this.refs.imgsPicker.getValue());
  }

  renderContent() {
    return (
      <View>
        <HeadImagePicker
          ref="imgPicker"
          value="http://facebook.github.io/react/img/logo_og.png"
        />
        <Line size={1} color="#E8E8E8" marginLeft={12} />
        <UserInfos
          submitUrl="#"
          itemContent={{
            ui_type: 'com.form.Form',
            validator: {
              email: {
                validator: 'isEmail',
                message: '请输入正确的邮箱',
              },
            },
            children: [
              {
                ui_type: 'com.form.TextInputField',
                name: 'nickname',
                label: '昵称',
                placeholder: '请输入',
                defaultValue: '121',
              },
              {
                ui_type: 'com.Line',
                color: '#E8E8E8',
                size: 1,
                marginRight: -12,
              },
              {
                ui_type: 'com.form.TextInputField',
                name: 'email',
                label: '邮箱',
                defaultValue: 'mc1960@126.com',
              },
              {
                ui_type: 'com.Line',
                color: '#E8E8E8',
                size: 1,
                marginRight: -12,
              },
            ],
          }}
        />
        <MultiImagePicker
          ref="imgsPicker"
          value={[
            'http://facebook.github.io/react/img/logo_og.png',
            'http://facebook.github.io/react/img/logo_og.png',
          ]}
        />
        <Button
          onPress={this.ceshi.bind(this)}
          style={{ marginTop: 10 }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({});
