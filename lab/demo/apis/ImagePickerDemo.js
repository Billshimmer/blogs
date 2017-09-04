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

import ImagePicker from 'lab4/apis/ImagePicker';
import Qiniu from 'lab4/apis/Qiniu';

//const ImagePicker = require('react-native-image-picker');

export default class ImagePickerDemo extends SimplePage {

  constructor(props, context) {
    super(props, context);
    this.state = {
      image1: {},
    };
    this.configPage({
      scrollable: true, //页面可滚动
    });
  }

  testPicker() {
    var options = {
      title: '选择图片', // 选择对话框标题 Android 没有对话框
      cancelButtonTitle: '取消', // 取消按钮文本
      takePhotoButtonTitle: '拍照', // 拍照按钮文本
      chooseFromLibraryButtonTitle: '相册', // 相册按钮文本
      customButtons: [ // 自定义按钮(一般不需要!!!!!)
        {
          name: 'custom',
          title: '自定义按钮',
        }
      ],
      cameraType: 'back', // 启用后摄像头 默认back
      mediaType: 'photo', // 'photo' or 'video'
      videoQuality: 'high', // 'low', 'medium', or 'high'
      durationLimit: 10, // video recording max time in seconds
      // maxWidth: 1500, // 图片最大宽度 当指定cropWidth 时忽略此值
      // maxHeight: 1500, // 图片最大高度
      //quality: 0.8, // 0 to 1, photos only
      noData: true, // 是否不需要返回图片的base64
      storageOptions: false, //是否要将选择之后的图片保存到图片文件夹(默认false 图片会放入cache,程序关闭之后可能会被删除，原来的uri就会无效)

      multiple: true, //是否多选
      // cropping: true, // 是否需要裁剪
      // cropWidth: 500,  //裁剪宽度 如果原始图片小于该值则不需要放大(提供时忽略maxWidth)
      // cropHeight: 500,  //裁剪高度 同上
      // cropAspectRatio: 1, //裁剪区域宽高比 如果提供cropWidth cropHeight 则忽略此值
    };

    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        // 用户点击了自定义的按钮 Android 不支持
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        if (Array.isArray(response)) {
          response = response[0];
        }
        this.setState({
          response: response,
        });
      }
    });
  }

  testQiniuUpload() {
    if (!this.state.response) {
      alert('清先选择图片');
      return;
    }
    Qiniu.upload({
      file: {
        uri: this.state.response.uri,
      }
    }).then((res) => {
      console.log('Qiniu.upload success: ', res);
    }, (error) => {
      console.log('Qiniu.upload error: ', error);
    });
  }

  test3() {
  }

  test4() {

  }

  test5() {
  }

  renderContent() {
    return (
      <View style={styles.container}>
        {this.renderTestBtns()}
        <Image source={this.state.response && {uri: this.state.response.uri}} style={{width: 150, height: 150}}/>
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
