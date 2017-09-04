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
  Image,
} from 'react-native';

import LAB, {
  Page,
} from 'lab4';

import SimplePage from 'lab4/demo/SimplePage';
import TestHelper from 'lab4/demo/TestHelper';

import Qiniu from 'lab4/apis/Qiniu';

export default class QiniuDemo extends SimplePage {

  constructor(props, context) {
    super(props, context);
    this.state = {

    };
    this.configPage({
      scrollable: true,
    });
  }

  //通过七牛key 获取url
  testGetUrl() {
    let key = 'xxxxx';
    let url = Qiniu.getUrl(key);
    console.log(url);
  }

  //判断是否为七牛url
  testIsQiniuUrl() {
    let urls = [
      'http://www.baidu.com',
      'http://78re52.com1.z0.glb.clouddn.com/resource/gogopher.jpg?imageView2/1/w/200/h/200',
    ];
    for (let i = 0; i < urls.length; ++i) {
      console.log('testIsQiniuUrl url:', urls[i], 'isQiniuUrl:', Qiniu.isQiniuUrl(urls[i]));
    }
  }

  //添加图片裁剪参数 http://developer.qiniu.com/code/v6/api/kodo-api/image/imageview2.html
  testImageView2() {
    let url = Qiniu.imageView2({
      mode: 1, //裁剪模式
      // w: 200,  //裁剪宽高的像素值
      // h: 200,
      wdp: 100, //裁剪宽高的dp值 会自动根据当前设备的像素密度计算实际的像素值 推荐使用
      hdp: 100,
      //q: 90, //指定图片质量 可选 一般不用配置
      //format: 'jpg', //指定图片格式 可选 一般不用配置
      url: 'http://78re52.com1.z0.glb.clouddn.com/resource/gogopher.jpg', //url 和key二选一
      //key: 'xxxx',
    });

    console.log(url);
  }

  testUpload() {
    console.log('参考ImagePickerDemo');
    alert('参考ImagePickerDemo');
  }

  renderContent() {
    return (
      <View style={styles.container}>
        {this.renderTestBtns()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
