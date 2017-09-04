'use strict';

import React, { PropTypes, Component } from 'react';
import ReactNative, {
  StyleSheet,
  Image,
  createWebCoreElement,
  RWServerUrl,
} from 'react-native';
import { requireImage } from 'lab4';
import ResourceManager from 'lab4/core/ResourceManager';
import glyphMap from './glyphMap';

const ResTypes = ResourceManager.ResTypes;

const DEFAULT_ICON_SIZE = 12;

let isInit = false;
let baseUrl = RWServerUrl.getUrl(RWServerUrl.FONT_PATH) + '/';

//设置字体文件baseUrl  必须在初始化之前设置
// 默认使用 当前目录下的icons目录
// function setFontBaseUrl(url) {
//   if (isInit) {
//     throw new Error('style sheet已经初始化!');
//   }
//   if (url && url[url.length - 1] !== '/') {
//     url += '/';
//   }
//   baseUrl = url;
// }

function createStyleSheet() {
  isInit = true;
  const styleEl = document.createElement('style');
  const fontFile = 'LABIcons';
  const fontFamily = fontFile;
  styleEl.innerHTML =
`@font-face {
  font-family: 'LABIcons';
  font-style: normal;
  font-weight: 400;
  src: url(${baseUrl}${fontFile}.woff) format('woff'),
  url(${baseUrl}${fontFile}.ttf) format('truetype');
}
.material-icons {
  font-family: '${fontFamily}' !important;
  font-weight: normal;
  font-style: normal;
  font-size: ${DEFAULT_ICON_SIZE} px;
  display: inline-block;
  line-height: 1;
  text-transform: none;
  letter-spacing: normal;
  word-wrap: normal;
  white-space: nowrap;
  direction: ltr;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  -moz-osx-font-smoothing: grayscale;
}`;
  document.documentElement.firstElementChild.appendChild(styleEl);
}

createStyleSheet();

/**
 * TODO tintColor支持
 */
export default class Icon extends Component {
  // static setFontBaseUrl = setFontBaseUrl;

  static propTypes = {
    name: PropTypes.string,
    size: PropTypes.number,
    color: PropTypes.string,
    // imageStyle: Image.propTypes.style,
    // textStyle: Text.propTypes.style,,
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

      iColor = iColor || fontColor || color;
      iSize = iSize || fontSize || size;
      if (iColor) {
        style.color = iColor;
      }
      if (iSize) {
        style.fontSize = iSize;
      }

      props.style = [props.textStyle, style];
      props.ref = 'root';
      // TODO 可配置
      props.className = 'material-icons';

      return createWebCoreElement('i', props, glyph);
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
