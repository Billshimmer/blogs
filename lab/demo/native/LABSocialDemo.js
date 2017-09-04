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
  Picker,
  ScrollView,
  TouchableOpacity,
  DeviceEventEmitter,
} from 'react-native';



import {
  Page,
  Link,
  globalEmitter,
} from 'lab4';

import SimplePage from 'lab4/demo/SimplePage';
import TestHelper from 'lab4/demo/TestHelper';

import LABSocial from 'lab4/apis/Social';

export default class LABSocialDemo extends SimplePage {

  constructor(props, context) {
    super(props, context);

    this.state = {
    };

    DeviceEventEmitter.addListener('LAB_SOCIAL_CLICKED', (data) => {
      console.log(data);
    });
  }

  // 登录
  testLoginQQ() {
    LABSocial.login({
      platform: 'qq',
    })
    .then((data) => {
      //用户登录成功返回的数据，主要包括openid nickname avatarurl等
      console.log('login qq success:', data);
    })
    .catch((error) => {
      console.log('error: ', error);
      if (error.code === 'cancel') {
        //用户取消授权 不需要提示错误
      } else {
        alert(JSON.stringify(error));
      }
    });
  }

  testLoginWX() {
    LABSocial.login({
      platform: 'wx',
    })
    .then((data) => {
      //用户登录成功返回的数据，主要包括openid nickname avatarurl等
      console.log('login wx success:', data);
    })
    .catch((error) => {
      console.log('error: ', error);
      if (error.code === 'cancel') {
        //用户取消授权 不需要提示错误
      } else {
        alert(JSON.stringify(error));
      }
    });
  }

  // 显示分享面板
  testShareBoard() {
    LABSocial.share({
      platforms: [ // platforms 可不给 默认为['wx', 'wx_circle', 'wb', 'qq', 'qzone']
        "qq",
        "wb",
        "qzone",
        "wx",
        "wx_circle",
        "wx_fav",
        "sms"
      ],
      informations: {
        title: 'title',
        content: 'content',
        imageUrl: 'https://facebook.github.io/react/img/logo_og.png',
        url: 'http://www.baidu.com',
      },
    }, (error, data) => {
      console.log('share callback error:', error, 'data:', data);
    });
  }

  //直接分享
  testDirectShare() {
    LABSocial.share({
      platform: 'qq',
      informations: {
        title: 'title',
        content: 'content',
        imageUrl: 'https://facebook.github.io/react/img/logo_og.png',
        url: 'http://www.baidu.com',
      },
    }, (error, data) => {
      console.log('share callback error:', error, 'data:', data);
    });
  }

}

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   justifyContent: 'center',
  // },
});
