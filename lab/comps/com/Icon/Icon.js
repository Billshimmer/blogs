'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, {
  View,
  Text,
  Image,
  Platform,
  StyleSheet,
} from 'react-native';
import LAB, { requireImage } from 'lab4';
import ResourceManager from 'lab4/core/ResourceManager';
import glyphMap from './glyphMap';

const ResTypes = ResourceManager.ResTypes;
const fontFamily = 'LABIcons';
const fontFile = 'LABIcons.ttf';

let fontReference = fontFamily;
// Android doesn't care about actual fontFamily name, it will only look in fonts folder.
if (Platform.OS === 'android' && fontFile) {
  fontReference = fontFile.replace(/\.(otf|ttf)$/, '');
}

if (Platform.OS === 'windows' && fontFile) {
  fontReference = `Assets/${fontFile}#${fontFamily}`;
}

// const IconNamePropType = PropTypes.oneOf(Object.keys(glyphMap));
const DEFAULT_ICON_SIZE = 12;
const DEFAULT_ICON_COLOR = 'black';

/**
 * 显示字体图标或者图片
 * 字体图标显示逻辑与 react-native-vector-icons@3.10.8 同步
 * 目前字体图标使用 Material Icons
 * TODO 支持可自定义配置
 * NOTE 使用Image 时不支持padding
 * NOTE 使用图片时必须确保用途是作为icon 不要将com.Icon件当成图片显示组件
 * 
 * style 属性支持Text 与 Image style 的交集，并额外扩展
 * color: 控制字体图标的颜色 对图片无效
 * tintColor: 控制图片的着色 对字体无效
 * fontSize: 控制字体的大小 对图片无效
 * iColor: 控制颜色 对图片和字体都有效 优先级高于coloe tintColor
 * iSize: 控制大小 对图片和字体都有效 优先级高于fontSize
 */
export default class Icon extends Component {
  static propTypes = {
    /**
     * icon name:
     * 1. 直接给出字体图标的名字
     * 2. 字体图标 @icon/xxx
     * 3. 本地图片 @image/xxx
     */
    name: PropTypes.string,
    /**
     * 图标大小 优先级低于style 中的定义
     */
    size: PropTypes.number,
    /**
     * 图标颜色 优先级低于 style 中的定义
     */
    color: PropTypes.string,
    /**
     * 图片样式 优先级最低
     */
    imageStyle: Image.propTypes.style,
    /**
     * 图标样式 优先级最低
     */
    textStyle: Text.propTypes.style,
  };

  // static defaultProps = {
  //   size: DEFAULT_ICON_SIZE,
  // };

  setNativeProps(nativeProps) {
    if (this.refs.root) {
      this.refs.root.setNativeProps(nativeProps);
    }
  }

  render() {
    let { name, size, color, ...props } = this.props;
    let {
      color: fontColor,
      tintColor,
      fontSize,
      iColor,
      iSize,
      ...style,
    } = StyleSheet.flatten(props.style) || {};

    const parsedDrawable = ResourceManager.parseDrawableUri(name);

    if (parsedDrawable.isDefaultType || parsedDrawable.type === ResTypes.ICON) {
      // icon font
      name = parsedDrawable.uri;
      let glyph = glyphMap[name] || '?';
      if (typeof glyph === 'number') {
        glyph = String.fromCharCode(glyph);
      }

      style.fontFamily = fontReference;
      style.fontWeight = 'normal';
      style.fontStyle = 'normal';
      iColor = iColor || fontColor || color;
      iSize = iSize || fontSize || size;
      if (iColor) {
        style.color = iColor;
      }
      if (iSize) {
        style.fontSize = iSize;
      }

      props.style = [props.textStyle, style];
      props.allowFontScaling = false;
      props.ref = 'root';

      return <Text {...props}>{glyph}</Text>;
    } else {
      // image
      iColor = iColor || tintColor || color;
      iSize = iSize || size;

      if (iColor) {
        style.tintColor = iColor;
      }
      if (iSize) {
        style.width = iSize;
        style.height = iSize;
      }

      props.style = [props.imageStyle, style];
      props.ref = 'root';
      props.source = requireImage(name);

      return <Image {...props} />;
    }
  }
}
