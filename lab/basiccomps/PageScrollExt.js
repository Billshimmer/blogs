'use strict';

import React, {
  Component,
  PropTypes,
} from 'react';
import ReactNative, {} from 'react-native';

import Page from 'lab4/core/Page';
import EventConstants from 'lab4/core/EventConstants';

/**
 * 封装了Scroll与Page交互相关的功能
 * 属性:
 * pageMainScroll: bool = false 是否作为Page的主scroll
 * bindPageRefresh: bool = false 是否将下拉刷新与页面绑定
 */
export default {

  pageScrollInit() {
    if (this.props.bindPageRefresh) {
      this.context.page.setPageMainScroll(this);
    }
  },

  pageScrollWillReceiveProps(nextProps) {
    if (this.props.bindPageRefresh && !nextProps.bindPageRefresh) {
      this.context.page.unsetPageMainScroll(this);
    }
  },

  pageScrollDeInit() {
    if (this.props.bindPageRefresh) {
      this.context.page.unsetPageMainScroll(this);
    }
  },

  pageScrollOnRefresh(options) {
    if (this.props.bindPageRefresh) {
      this.context.page.scrollRefreshPage(options);
      return true;
    }
    return false;
  },

  pageRefreshStart() {
    this.onPageRefreshStart();
  },

  pageRefreshComplete() {
    this.onPageRefreshComplete();
  },
};
