'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, { StyleSheet, View } from 'react-native';
import LAB, { Page, requireComp } from 'lab4';
import PhotoBrowserView from 'lab4/basiccomps/PhotoBrowserView';

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
    this.state = {
      options: this.props.route.data.options,
      currentIndex: this.props.route.data.options.currentIndex || 0,
    };
  }

  updateOptions(options) {
    this.setState({
      options,
      currentIndex: options.currentIndex || 0,
    });
  }

  getCurrentIndex() {
    return this.state.currentIndex;
  }

  getPhotos() {
    return this.state.options.photos;
  }

  renderHeader() {
    if (this.props.route.data.renderHeader) {
      return this.props.route.data.renderHeader(this);
    }
  }

  renderContent() {
    return (
      <PhotoBrowserView
        options={this.state.options}
        style={styles.container}
        onPhotoTap={() => {
          if (this.props.route.data.closeOnTap) {
            this.router.pop();
          }
        }}
        onPhotoSelected={e => {
          this.state.currentIndex = e.nativeEvent.index;
        }}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
