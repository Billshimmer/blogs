'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, {
  StyleSheet,
  Dimensions,
  View,
  Platform,
  DrawerLayoutAndroid,
} from 'react-native';
import LAB, { globalEmitter, EventConstants } from 'lab4';
import InnerDrawerLayout from 'react-native-drawer-layout';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default class DrawerLayout extends LAB.Component {
  static propTypes = {
    drawerWidthPercent: PropTypes.number,
    navigationView: PropTypes.object,
    eventId: PropTypes.string,
    // ... 其他DrawerLayout属性
  };

  static defaultProps = {
    drawerWidthPercent: 0.8,
  };

  static childContextTypes = {
    drawerLayout: PropTypes.object,
  };

  constructor(props, context) {
    super(props, context);

    //this.defaultStyles = styles;

    this._renderNavigationView = this._renderNavigationView.bind(this);
  }

  getChildContext() {
    return {
      drawerLayout: this,
    };
  }

  componentDidMount() {
    if (!this.props.eventId) {
      return;
    }
    globalEmitter.on(
      EventConstants.DRAWER_LAYOUT_OPEN_DRAWER,
      e => {
        if (__DEV__) {
          console.log('DrawerLayout DRAWER_LAYOUT_OPEN_DRAWER');
        }
        if (e.data !== this.props.eventId) {
          return;
        }
        this.refs._main.openDrawer();
      },
      this
    );

    globalEmitter.on(
      EventConstants.DRAWER_LAYOUT_CLOSE_DRAWER,
      e => {
        if (__DEV__) {
          console.log('DrawerLayout DRAWER_LAYOUT_CLOSE_DRAWER');
        }
        if (e.data !== this.props.eventId) {
          return;
        }
        this.refs._main.closeDrawer();
      },
      this
    );
  }

  componentWillUnmount() {
    globalEmitter.offByTag(this);
  }

  _renderNavigationView() {
    if (this.props.renderNavigationView) {
      return this.props.renderNavigationView();
    }
    return LAB.render(this.props.navigationView);
  }

  openDrawer() {
    this.refs._main.openDrawer();
  }

  closeDrawer() {
    this.refs._main.closeDrawer();
  }

  getInnerDrawer() {
    return this.refs._main;
  }

  render() {
    let drawerWidth =
      this.props.drawerWidth ||
      Math.round(SCREEN_WIDTH * this.props.drawerWidthPercent) ||
      300;
    let drawerPosition = this.props.drawerPosition;
    if (Platform.OS === 'android') {
      if (drawerPosition === 'right') {
        drawerPosition = DrawerLayoutAndroid.positions.Right;
      } else {
        drawerPosition = DrawerLayoutAndroid.positions.Left;
      }
    }
    return (
      <InnerDrawerLayout
        {...this.props}
        ref="_main"
        drawerPosition={drawerPosition}
        drawerWidth={drawerWidth}
        keyboardDismissMode="on-drag"
        renderNavigationView={this._renderNavigationView}
        style={this.getStyle('container')}
      >
        {this.props.children}
      </InnerDrawerLayout>
    );
  }
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
// });
