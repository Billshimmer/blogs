'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, { StyleSheet, View } from 'react-native';
import LAB, { Page, requireComp } from 'lab4';

export default class PhotoBrowserPage extends Page {
  /**
   * router,
   * options: {
   *   photos,
   *   currentIndex,
   *   renderHeader: Function(PhotoBrowserPage),
   *   closeOnTap: Bool,
   * }
   */
  static open = function(router, options) {
    const route = this.createRoute(options);
    router.push(route);
  };

  static createRoute = function(options) {
    return {
      data: {
        options: {
          photos: options.photos,
          currentIndex: options.currentIndex,
        },
        closeOnTap: options.closeOnTap !== false,
        renderHeader: options.renderHeader,
      },
      comp: PhotoBrowserPage,
    };
  };

  constructor(props, context) {
    super(props, context);
    this.state = {};
  }

  renderHeader() {
    if (this.props.route.data.renderHeader) {
      return this.props.route.data.renderHeader(this);
    }
  }

  renderContent() {
    return null;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
