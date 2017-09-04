'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, {
  StyleSheet,
  View,
  Text,
  CameraRoll,
  Modal,
  Platform,
  Alert,
} from 'react-native';
import LAB, { http, Toast, requireComp } from 'lab4';
import Qiniu from 'lab4/apis/Qiniu';

import img_placeholder from './img_placeholder.png';
import img_del from './del.png';
import img_add from './add.png';

const Touchable = requireComp('com.Touchable');
const HeaderBar = requireComp('com.HeaderBar');
const Icon = requireComp('com.Icon');
const Image = requireComp('com.Image');

export default class ImagePick extends LAB.Component {
  static propTypes = {
    type: PropTypes.string, //0在线缓存模式  1发送模式
    url: PropTypes.string, //发送模式subUrl
    name: PropTypes.string, //发送模式字段名

    maxImage: PropTypes.number, //最大图片数
    column: PropTypes.number, //每行图片数
    images: PropTypes.array, //初始图片数组
    imageHeight: PropTypes.number, //图片高度，默认不传显示正方形，根据列数计算
    whRatio: PropTypes.number, //宽高比
    onChange: PropTypes.func, //改变时回调函数
    disabled: PropTypes.bool,
    addImage: PropTypes.any, //添加图片按钮的图标
    emptyImageState: PropTypes.any,
    smallImageCloseImage: PropTypes.any,
    showIndex: PropTypes.bool,
    multiple: PropTypes.bool,
    maxSize: PropTypes.number,
  };

  static defaultProps = {
    type: '0',
    column: 3,
    whRatio: 1,
    maxImage: 999,
    //images:[],
    disabled: false,
    multiple: true,
    maxSize: 9,
  };

  static contextTypes = {
    ...LAB.Component.componentContextTypes,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      sum: this.props.images ? this.props.images.length : 0,
      num: this.props.images ? this.props.images.length : 0,
      images: this.props.images || [], //uri数组
      show: false,
      curTab: 0,
      width: null,
      imageWidth: null,
    };
    // console.log(this.props.images);
    //七牛初始化 //测试未配置时用
    // Qiniu.init({
    //   qiniuBaseUrl:'http://7xlydk.com1.z0.glb.clouddn.com/',
    //   uptokenUrl:'http://basic2.hz.backustech.com/Content/Index/test?LAB_JSON=1&LAB_NOTRANS=1',
    // });

    this.defaultStyles = styles;
    this.onPress = this.onPress.bind(this);
    this.delete = this.delete.bind(this);
    this.getContainer = this.getContainer.bind(this);
    this.onChange = this.onChange.bind(this);
    this._renderThumbImageViews = this._renderThumbImageViews.bind(this);
    this._renderDeleteThumbButton = this._renderDeleteThumbButton.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.images != this.props.images) {
      this.setState({
        sum: nextProps.images ? nextProps.images.length : 0,
        num: nextProps.images ? nextProps.images.length : 0,
        images: nextProps.images || [],
      });
    }
  }

  getValue() {
    return this.state.images;
  }

  onChange() {
    this.props.onChange && this.props.onChange(this.state.images);
    let arg = {};
    arg[this.props.name] = this.state.images;
    if (this.props.type == '1') {
      http
        .post(this.props.url, {
          data: arg,
        })
        .then(response => {
          // console.log(response);
          //刷新页面
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
          if (__DEV__) console.warn(error);
        });
    }
  }

  onPress(event) {
    let file = event.target.files[0];
    this.refs.fileInput.value = '';
    if (this.props.maxImage > this.state.sum) {
      let key = this.state.num;
      this.context.popup.showLoading({
        message: '图片上传中...',
      });
      //保存七牛路径
      Qiniu.upload({
        file: file,
      })
        .then(res => {
          let images = this.state.images;
          images.push(res);
          this.setState({
            sum: this.state.sum + 1,
            num: this.state.num + 1,
            images,
          });
          this.props.onChange && this.props.onChange(images);
        })
        .catch(err => {
          // console.log(err);
          Toast.show('图片上传失败');
        })
        .finally(() => {
          this.context.popup.hideLoading();
        });
    }
  }

  onImage(i) {
    wx.previewImage({
      current: this.state.images[i], // 当前显示图片的http链接
      urls: this.state.images, // 需要预览的图片http链接列表
    });
  }

  delete(i) {
    this.state.images.splice(i, 1);
    this.setState({
      show: false,
      sum: this.state.sum - 1,
    });
    this.props.onChange && this.props.onChange(this.state.images);
  }

  _renderEmptyState() {
    return (
      <Touchable onPress={this.onPress}>
        {this.props.emptyImageState}
      </Touchable>
    );
  }

  render() {
    if (!this.state.images.length && this.props.disabled) {
      return null;
    }
    if (this.state.images.length == 0 && this.props.emptyImageState) {
      return this._renderEmptyState();
    }

    return (
      <View>
        <View
          style={[this.getStyle('container'), this.props.style]}
          onLayout={this.getContainer}
        >
          {this._renderThumbImageViews()}
          {this.props.maxImage > this.state.sum && !this.props.disabled
            ? <View
                onLayout={this.getImage}
                //onPress={this.onPress}
                style={[
                  this.getStyle('add'),
                  {
                    width: this.state.imageWidth,
                    height:
                      this.props.imageHeight ||
                        this.state.imageWidth / this.props.whRatio,
                  },
                ]}
              >
                <input
                  style={{
                    position: 'absolute',
                    opacity: 0,
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    width: this.state.imageWidth,
                    zIndex: 99,
                  }}
                  type="file"
                  ref="fileInput"
                  onChange={this.onPress}
                />
                <Image
                  source={
                    this.props.addImage == null ? img_add : this.props.addImage
                  }
                  style={[
                    this.getStyle('addImage'),
                    this.props.addImage && {
                      width: this.state.imageWidth,
                      height:
                        this.props.imageHeight ||
                          this.state.imageWidth / this.props.whRatio,
                    },
                  ]}
                />
              </View>
            : null}
        </View>
        {this._renderIndexView()}
      </View>
    );
  }

  _renderIndexView() {
    if (this.props.showIndex) {
      return (
        <Text style={this.getStyle('indexText')}>
          {this.state.images.length} / {this.props.maxImage}
        </Text>
      );
    }
  }

  _renderThumbImageViews() {
    let imageSmall = [];
    for (let i in this.state.images) {
      imageSmall.push(
        <Touchable
          key={i}
          onLayout={this.getImage}
          onPress={() => {
            this.onImage(i);
          }}
          style={[
            this.getStyle('imageView'),
            {
              width: this.state.imageWidth,
              height:
                this.props.imageHeight ||
                  this.state.imageWidth / this.props.whRatio,
            },
          ]}
        >
          <Image
            resizeMode="cover"
            uri={this.state.images[i]}
            placeholderSource={!this.props.placeholderUri && img_placeholder}
            placeholderUri={this.props.placeholderUri}
            style={[
              this.getStyle('image'),
              {
                width: this.state.imageWidth,
                height:
                  this.props.imageHeight ||
                    this.state.imageWidth / this.props.whRatio,
              },
            ]}
          />
          {this._renderDeleteThumbButton(i)}
        </Touchable>
      );
    }
    return imageSmall;
  }

  _renderDeleteThumbButton(index) {
    return (
      <Touchable
        style={this.getStyle('deleteThumbButtonContainer')}
        onPress={() => {
          this.delete(index);
        }}
      >
        <Image
          //uri={this.props.smallImageCloseImage}
          source={!this.props.smallImageCloseImage && img_del}
          style={this.getStyle('deleteThumbButton')}
        />
      </Touchable>
    );
  }

  getContainer(e) {
    let temp = e.nativeEvent.layout.width;
    if (temp !== this.state.width) {
      let block = StyleSheet.flatten(this.getStyle('container')).padding || 0;
      this.setState({
        width: temp,
        imageWidth: (temp - block * 2) / this.props.column - block * 2,
      });
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  add: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabView: {
    flex: 1,
    backgroundColor: 'blue',
  },
  indexText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 12,
    padding: 15,
  },
  deleteThumbButtonContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  deleteThumbButton: {
    width: 18,
    height: 18,
  },
  fileInput: {
    position: 'absolute',
    opacity: 0.5,
    backgroundColor: 'red',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 99,
  },
});
