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
import ImagePicker from 'lab4/apis/ImagePicker';
import Qiniu from 'lab4/apis/Qiniu';

const Touchable = requireComp('com.Touchable');
const HeaderBar = requireComp('com.HeaderBar');
const Icon = requireComp('com.Icon');
const PhotoBrowserPage = requireComp('com.PhotoBrowserPage');
const Image = requireComp('com.Image');

//接口在下面！！！不是这里
const options = {
  title: '选择图片', // specify null or empty string to remove the title
  cancelButtonTitle: '取消',
  takePhotoButtonTitle: '拍照', // specify null or empty string to remove this button
  chooseFromLibraryButtonTitle: '相册', // specify null or empty string to remove this button
  cameraType: 'back', // 'front' or 'back'
  mediaType: 'photo', // 'photo' or 'video'
  //videoQuality: 'high', // 'low', 'medium', or 'high'
  //durationLimit: 10, // video recording max time in seconds
  maxWidth: 1600, // photos only
  maxHeight: 1600, // photos only
  aspectX: 1, // android only - aspectX:aspectY, the cropping image's ratio of width to height
  aspectY: 1, // android only - aspectX:aspectY, the cropping image's ratio of width to height
  quality: 0.5, // 0 to 1, photos only  指定quality时图片会被重新缩放，这时maxWidth与maxHeight的处理有BUG
  //angle: 0, // android only, photos only
  //allowsEditing: true, // Built in functionality to resize/reposition the image after selection
  noData: true, // photos only - disables the base64 `data` field from being generated (greatly improves performance on large photos)
  storageOptions: true,
};

/**
 * 图片选择组件
 * 
 * @export
 * @class ImagePick
 * @extends {LAB.Component}
 */
export default class ImagePick extends LAB.Component {
  static propTypes = {
    type: PropTypes.string, //0在线缓存模式  1发送模式  2离线缓存模式
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

  onPress() {
    if (this.props.maxImage > this.state.sum) {
      ImagePicker.showImagePicker(
        {
          ...options,
          multiple: this.props.multiple,
          maxSize: this.props.maxSize,
        },
        response => {
          if (response.didCancel) {
            console.log('User cancelled image picker');
          } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
          } else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton);
          } else {
            let key = this.state.num;

            if (this.props.type == '2') {
              this.context.popup.showLoading({
                message: '图片上传中...',
              });
              //离线模式 优先七牛
              if (this.props.multiple) {
                let uploads = response.map((item, key) => {
                  return Qiniu.upload({
                    file: {
                      uri: item.uri,
                    },
                  });
                });
                Promise.all(uploads)
                  .then(res => {
                    let images = this.state.images.concat(res);
                    this.setState({
                      sum: this.state.sum + 1,
                      num: this.state.num + 1,
                      images,
                    });
                    this.props.onChange && this.props.onChange(images);
                  })
                  .catch(e => {
                    let images = this.state.images;
                    for (let index = 0; index < response.length; index++) {
                      images.push(response[index].uri);
                    }

                    this.setState({
                      sum: this.state.sum + 1,
                      num: this.state.num + 1,
                      images,
                    });
                    this.props.onChange && this.props.onChange(images);
                  })
                  .finally(() => {
                    this.context.popup.hideLoading();
                  });
              } else {
                Qiniu.upload({
                  file: {
                    uri: response.uri,
                  },
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
                    //保存本地路径
                    let images = this.state.images;
                    images.push(response.uri);
                    this.setState({
                      sum: this.state.sum + 1,
                      num: this.state.num + 1,
                      images,
                    });
                    this.props.onChange && this.props.onChange(images);
                  })
                  .finally(() => {
                    this.context.popup.hideLoading();
                  });
              }
            } else {
              this.context.popup.showLoading({
                message: '图片上传中...',
              });
              //保存七牛路径
              if (this.props.multiple) {
                let uploads = response.map((item, key) => {
                  return Qiniu.upload({
                    file: {
                      uri: item.uri,
                    },
                  });
                });
                Promise.all(uploads)
                  .then(res => {
                    let images = this.state.images.concat(res);
                    this.setState({
                      sum: this.state.sum + 1,
                      num: this.state.num + 1,
                      images,
                    });
                    this.props.onChange && this.props.onChange(images);
                  })
                  .catch(e => {
                    Toast.show('图片上传失败');
                  })
                  .finally(() => {
                    this.context.popup.hideLoading();
                  });
              } else {
                Qiniu.upload({
                  file: {
                    uri: response.uri,
                  },
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
                    Toast.show('图片上传失败');
                  })
                  .finally(() => {
                    this.context.popup.hideLoading();
                  });
              }
            }
          }
        }
      );
    }
  }

  onImage(i) {
    this._openPhotoBrowser(Number(i));
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
          {
            // this.props.images.length != 0?(
            //   <View style={{position:'absolute',left:0,top:0, justifyContent:'center', alignItems:'center',width:this.state.imageWidth + 9, height:(this.props.imageHeight||(this.state.imageWidth/this.props.whRatio)) + 9}}>
            //     <Text>载入中</Text>
            //   </View>
            // ):null
          }
          {this._renderThumbImageViews()}
          {this.props.maxImage > this.state.sum && !this.props.disabled
            ? <Touchable
                onLayout={this.getImage}
                onPress={this.onPress}
                style={[
                  this.getStyle('add'),
                  this.props.smallImageCloseImage
                    ? {
                        width: this.state.imageWidth + 9,
                        height:
                          (this.props.imageHeight ||
                            this.state.imageWidth / this.props.whRatio) + 9,
                      }
                    : {
                        width: this.state.imageWidth,
                        height:
                          this.props.imageHeight ||
                            this.state.imageWidth / this.props.whRatio,
                      },
                ]}
              >
                <Image
                  source={
                    this.props.addImage == null
                      ? require('./add.png')
                      : this.props.addImage
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
              </Touchable>
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
            this.props.smallImageCloseImage
              ? {
                  paddingLeft: 9,
                  paddingTop: 9,
                  width: this.state.imageWidth + 9,
                  height:
                    (this.props.imageHeight ||
                      this.state.imageWidth / this.props.whRatio) + 9,
                }
              : {
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
            placeholderSource={
              !this.props.placeholderUri && require('./img_placeholder.png')
            }
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
    if (this.props.smallImageCloseImage) {
      return (
        <Touchable
          style={this.getStyle('deleteThumbButtonContainer')}
          onPress={() => {
            this.delete(index);
          }}
        >
          <Image
            source={this.props.smallImageCloseImage}
            style={this.getStyle('deleteThumbButton')}
          />
        </Touchable>
      );
    }
  }

  _openPhotoBrowser(currentIndex) {
    PhotoBrowserPage.open(this.context.router, {
      photos: this.state.images.slice(),
      currentIndex,
      renderHeader: photoBrowserPage => {
        return !this.props.disabled
          ? <HeaderBar
              title="查看大图"
              left={{ icon: 'arrow-back' }}
              right={{ icon: 'delete-forever' }}
              onLeftPress={() => {
                this.context.router.pop();
              }}
              onRightPress={() => {
                Alert.alert('删除', '确定删除?', [
                  {
                    text: '取消',
                  },
                  {
                    text: '确定',
                    onPress: () => {
                      this.delete(photoBrowserPage.getCurrentIndex());
                      if (!this.state.images.length) {
                        this.context.router.pop();
                        return;
                      }
                      photoBrowserPage.updateOptions({
                        photos: this.state.images.slice(),
                        currentIndex: Math.min(
                          photoBrowserPage.getCurrentIndex(),
                          this.state.images.length - 1
                        ),
                      });
                    },
                  },
                ]);
              }}
            />
          : <HeaderBar
              title="查看大图"
              left={{ icon: 'arrow-back' }}
              onLeftPress={() => {
                this.context.router.pop();
              }}
            />;
      },
    });
  }

  getContainer(e) {
    let temp = e.nativeEvent.layout.width;
    if (temp !== this.state.width) {
      let block =
        (StyleSheet.flatten(this.getStyle('container')).padding || 0) +
        (this.props.smallImageCloseImage ? 9 : 0);
      this.setState({
        width: temp,
        imageWidth: (temp - block * 2) / this.props.column - block * 2,
      });
      console.log(temp, (temp - block * 2) / this.props.column - block * 2);
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
    left: 0,
  },
  deleteThumbButton: {
    width: 18,
    height: 18,
  },
});
