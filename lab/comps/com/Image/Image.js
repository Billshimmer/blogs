'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, {
  StyleSheet,
  PixelRatio,
  Image as RNImage,
  Platform,
  View,
  UIManager,
  findNodeHandle,
} from 'react-native';
import LAB, { requireImage } from 'lab4';

let pixelRatio = PixelRatio.get();
if (pixelRatio > 2 && Platform.OS === 'web') {
  pixelRatio = 2;
} else if (pixelRatio > 3) {
  pixelRatio = 3;
}

const EMPTY_SOURCE = [];

let extraChecker = function() {
  return false;
};
function defaultQiniuImageChecker(uri) {
  return uri.indexOf('clouddn.com') > 0 || uri.indexOf('qiniucdn.com') > 0;
}

//判断图片是否来自七牛
function isQiniuImage(uri) {
  if (!uri) {
    return false;
  }
  if (defaultQiniuImageChecker(uri)) {
    return true;
  }
  return extraChecker(uri);
}

function setExtraQiniuImageChecker(checker) {
  extraChecker = checker;
}

function getPropsUri(props) {
  return props.source ? props.source.uri : props.uri;
}

/**
 * 使用LAB.requireImage引用图片，如果图片来自七牛则会自动添加裁剪参数
 * TODO
 * 对从style中获取的宽高要减去padding
 * onLayout在不需要的时候可以不给 之后使用mesureLayout
 * native 实现裁剪参数拼接
 * style_class 最外层样式名字改为 container ？
 * 
 *
 * NOTE: uri 不变的情况下，只会取第一次获取的宽高作为七牛裁剪参数
 * 
 * state: {
 *  w, h, //当前七牛参数使用的宽高
 *  nw, nh, // handleOnLayout 获取到的最新宽高
 * }
 */
export default class Image extends LAB.Component {
  static propTypes = {
    uri: PropTypes.string, //使用LAB.requireImage 引用图片
    quality: PropTypes.number, //图片质量 用于七牛图片
    enableQiniuCompress: PropTypes.bool, //是否启用七牛图片压缩
    placeholderSource: RNImage.propTypes.source, //加载过程的占位图
    placeholderUri: PropTypes.string, //加载过程的占位图uri 请给本地图片
  };

  static defaultProps = {
    enableQiniuCompress: true,
  };

  static setExtraQiniuImageChecker = setExtraQiniuImageChecker;

  constructor(props, context) {
    super(props, context);
    this.state = {};
    this._init(props);
    if (
      this._enableQiniuCompress &&
      this._imgStyle.width > 0 &&
      this._imgStyle.height > 0
    ) {
      this.state.w = this._imgStyle.width;
      this.state.h = this._imgStyle.height;
    }
    this._handleOnLayout = this._handleOnLayout.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const oldEnableQiniuCompress = this._enableQiniuCompress;
    this._init(nextProps);
    if (this._enableQiniuCompress) {
      const state = this.state;
      if (
        getPropsUri(this.props) !== getPropsUri(nextProps) ||
        !state.w ||
        !state.h
      ) {
        // uri 有改变或者原来没有w h 时 更新w h
        if (this._imgStyle.width > 0 && this._imgStyle.height > 0) {
          state.w = this._imgStyle.width;
          state.h = this._imgStyle.height;
        } else if (oldEnableQiniuCompress) {
          // 原来启用了七牛压缩 所以nw nh 也许是有效的
          state.w = state.nw;
          state.h = state.nh;
        } else {
          state.w = state.h = 0;
        }
      }
      if (!oldEnableQiniuCompress) {
        // 从不启用七牛压缩到启用 调用measure 获取到nw nh (因为onLayout 只在layout 改变时才会调用)
        this.forceUpdate(() => {
          UIManager.measure(
            findNodeHandle(this.refs._main),
            (x, y, width, height) => {
              this._onLayoutChange(width, height);
            }
          );
        });
      }
    }
  }

  _init(props) {
    this._isQinniuImage = isQiniuImage(getPropsUri(props));
    this._enableQiniuCompress =
      this._isQinniuImage && props.enableQiniuCompress;
    this._imgStyle = StyleSheet.flatten([this.getStyle('img'), props.style]);
  }

  _handleOnLayout(e) {
    if (this.props.onLayout) {
      this.props.onLayout(e);
    }
    const { width, height } = e.nativeEvent.layout;
    this._onLayoutChange(width, height);
  }

  _onLayoutChange(width, height) {
    if (!width || !height) {
      return;
    }
    this.state.nw = width;
    this.state.nh = height;
    if (!this._enableQiniuCompress || (this.state.w && this.state.h)) {
      // 如果不启用七牛压缩 或者宽高已经存在 则不更新
      return;
    }

    this.setState({
      w: width,
      h: height,
    });
  }

  _getQinniuSource() {
    const props = this.props;
    let uri = getPropsUri(props);
    const width = this.state.w;
    const height = this.state.h;
    if (!width || !height) {
      return null;
    }

    const resizeMode =
      this.props.resizeMode || this._imgStyle.resizeMode || 'cover';

    if (uri.indexOf('?') > 0) {
      uri += '|'; // TODO 需要判断原来是否有七牛参数
    } else {
      uri += '?';
    }
    const imgWidth = Math.round(width * pixelRatio);
    const imgHeight = Math.round(height * pixelRatio);
    if (resizeMode === 'cover') {
      uri += `imageView2/1/w/${imgWidth}/h/${imgHeight}`;
    } else {
      uri += `imageView2/2/w/${imgWidth}/h/${imgHeight}`;
    }
    if (this.props.quality) {
      uri += '/q/' + this.props.quality;
    }
    //console.log('_getQinniuSource', uri);
    if (typeof props.source === 'object') {
      return {
        ...props.source,
        uri,
      };
    }
    return {
      uri,
    };
  }

  render() {
    const placeholderSource =
      this.props.placeholderSource ||
      (this.props.placeholderUri && requireImage(this.props.placeholderUri));
    let source;
    if (!this._enableQiniuCompress) {
      source =
        this.props.source || (this.props.uri && requireImage(this.props.uri));
    } else {
      source = this._getQinniuSource();
    }
    return (
      <RNImage
        ref="_main"
        {...this.props}
        source={source || EMPTY_SOURCE}
        defaultSource={placeholderSource}
        loadingIndicatorSource={placeholderSource}
        onLayout={
          this._enableQiniuCompress ? this._handleOnLayout : this.props.onLayout
        }
        style={this._imgStyle}
      />
    );
  }
}
