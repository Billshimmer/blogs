'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, { StyleSheet, View } from 'react-native';
import LAB from 'lab4';
import RichText from 'lab4/basiccomps/RichText/RichText';
import WebView from 'lab4/basiccomps/WebView/WebView';

let styleSheetMap = {};

export default class Html extends LAB.Component {
  static propTypes = {
    src: PropTypes.string,
    html: PropTypes.string,
    scrollable: PropTypes.bool,
    useWebView: PropTypes.bool, //使用WebView展示数据 如果提供了src 则也会使用WebView
    fitContentHeight: PropTypes.bool, //使用WebView时是否使用fitContentHeight模式
    styleSheet: PropTypes.string, // 样式表字符串 只对使用webView 且提供html时有效
    styleSheetName: PropTypes.string, // 样式表名字
    loadingView: PropTypes.object,
    errorView: PropTypes.object,
  };

  static defaultProps = {
    useWebView: true,
  };

  static contextTypes = {
    labContext: PropTypes.object,
  };

  /**
   * 注册样式表，使得之后可以通过styleSheetName使用
   * styleSheetMap {
   *   name: styleSheet,
   *   ...
   * }
   */
  static registerStyleSheet = map => {
    styleSheetMap = map;
  };

  constructor(props, context) {
    super(props, context);

    this._renderError = this._renderError.bind(this);
    this._renderLoading = this._renderLoading.bind(this);
  }

  // componentWillReceiveProps(nextProps) {
  //
  // }

  _prepareHtml(html) {
    let styleSheet = this.props.styleSheet;
    if (!styleSheet && this.props.styleSheetName) {
      styleSheet = styleSheetMap[this.props.styleSheetName];
    }
    if (styleSheet) {
      return `<style>${styleSheet}</style><div class="lab-html-container">${html}</div>`;
    }
    return html;
  }

  _renderLoading() {
    if (this.props.renderLoading) {
      return this.props.renderLoading();
    }
    if (this.props.loadingView) {
      return LAB.render(this.props.loadingView);
    }
  }

  _renderError() {
    if (this.props.renderError) {
      return this.props.renderError();
    }
    if (this.props.errorView) {
      return LAB.render(this.props.errorView);
    }
  }

  render() {
    let {
      src,
      html,
      scrollable,
      useWebView,
      fitContentHeight,
      style,
      ...otherProps
    } = this.props;
    if (!useWebView && !src) {
      return (
        <RichText
          {...otherProps}
          style={[this.getStyle('container'), style]}
          text={html}
        />
      );
    }
    let source;
    if (html != null) {
      source = {
        baseUrl: this.context.labContext.getAbsoluteUrl(src),
        html: this._prepareHtml(html),
      };
    } else {
      source = {
        uri: this.context.labContext.getAbsoluteUrl(src),
      };
    }
    return (
      <WebView
        javaScriptEnabled={true}
        {...otherProps}
        fitContentHeight={fitContentHeight}
        source={source}
        renderError={this._renderError}
        renderLoading={
          (this.props.loadingView || this.props.renderLoading) &&
            this._renderLoading
        }
        style={[this.getStyle('container'), style]}
      />
    );
  }
}

// const styles = StyleSheet.create({
// });
