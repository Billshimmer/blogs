'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, { StyleSheet, View } from 'react-native';
import LAB, { utils } from 'lab4';

let styleSheetMap;
let isStyleInit = false;

function initStyleSheet() {
  if (isStyleInit) {
    return;
  }
  if (!styleSheetMap) {
    return;
  }
  isStyleInit = true;
  const styles = [];
  let style;
  for (let styleSheetName in styleSheetMap) {
    if (utils.hasOwnProp(styleSheetMap, styleSheetName)) {
      style = styleSheetMap[styleSheetName];
      if (style) {
        // TODO 更好的匹配css 选择器的方法
        styles.push(
          style.replace(
            /(^|\}\s*)([^\{\}]+\{)/g,
            `$1.lab-html-ss-${styleSheetName} $2`
          )
        );
      }
    }
  }
  if (styles.length) {
    const styleEl = document.createElement('style');
    styleEl.innerHTML = styles.join('\n');
    document.documentElement.firstElementChild.appendChild(styleEl);
  }
}

//TODO
//1. iframe加载之后高度改变
//2. 内部链接 onLoadRequest
//3. scrollable dangerouslySetInnerHTML
//不支持padding left right
export default class Html extends LAB.Component {
  static propTypes = {
    src: PropTypes.string,
    html: PropTypes.string,
    scrollable: PropTypes.bool, //可滚动 意味着高度由外部指定
    fitContentHeight: PropTypes.bool, //使用iframe时是否自动适应内容高度(src必须同域)
    useIframe: PropTypes.bool, //使用iframe展示内容 不支持提供html
    styleSheet: PropTypes.string, // 样式表字符串 只对不使用iframe时有效
    styleSheetName: PropTypes.string, // 样式表名字
  };

  static defaultProps = {
    scrollable: false,
    fitContentHeight: true,
    useIframe: true,
  };

  /**
   * 注册样式表，是的之后可以通过styleSheetName 使用
   * styleSheetMap {
   *   name: styleSheet,
   *   ...
   * }
   */
  static registerStyleSheet = map => {
    styleSheetMap = map;
    if (!isStyleInit) {
      requestAnimationFrame(() => {
        initStyleSheet();
      });
    }
  };

  constructor(props, context) {
    super(props, context);
    this._onLoad = this._onLoad.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.src !== this.props.src ||
      nextProps.html !== this.props.html
    ) {
      this._iframeHeight = null;
    }
  }

  _onLoad(e) {
    if (this.props.scrollable) {
      return;
    }
    let iframe = e.target;
    try {
      this._iframeHeight = iframe.contentWindow.document.body.scrollHeight;
      iframe.style.height = this._iframeHeight + 'px';
    } catch (e) {
      if (__DEV__) {
        console.log('Html iframe onload err');
      }
      this._iframeHeight = null;
    }
  }

  _prepareHtml(html) {
    //TODO 支持内联styleSheet
    // let styleSheet = this.props.styleSheet;
    // if (!styleSheet && this.props.styleSheetName) {
    //   styleSheet = styleSheetMap[this.props.styleSheetName];
    // }
    // if (styleSheet) {
    //   return `<style>${styleSheet}</style>${html}`;
    // }
    return `<div class="lab-html-container">${html}</div>`;
  }

  render() {
    if (!this.props.useIframe || this.props.html != null) {
      let className = 'lab-html-view';
      if (this.props.styleSheetName) {
        className += ' lab-html-ss-' + this.props.styleSheetName;
      }
      return (
        <View
          className={className}
          style={[this.getStyle('container'), this.props.style]}
          dangerouslySetInnerHTML={{
            __html: this._prepareHtml(this.props.html),
          }}
        />
      );
    }

    const iframeStyle = {
      border: 'none',
      width: '1px',
      minWidth: '100%',
    };
    if (this._iframeHeight) {
      iframeStyle.height = this._iframeHeight;
    } else if (this.props.scrollable) {
      iframeStyle.flex = 1;
      iframeStyle.height = '100%';
    }

    return (
      <View style={[this.getStyle('container'), this.props.style]}>
        <iframe
          className="lrnw-html-iframe"
          src={this.props.src}
          frameBorder="0"
          scrolling={this.props.scrollable ? 'auto' : 'no'}
          onLoad={this._onLoad}
          style={iframeStyle}
        />
      </View>
    );
  }
}
// const styles = StyleSheet.create({
// });
