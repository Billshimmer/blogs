'use strict';

import React, {
  Component,
  PropTypes,
} from 'react';
import ReactNative, {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
} from 'react-native';

import BaseTabBar from './BaseTabBar';

export default class TabBar extends BaseTabBar {

  constructor(props, context) {
    super(props, context);
    this.state.lineOffset = {
      left: new Animated.Value(0),
      width: 0,
    };
  }

  componentWillReceiveProps(nextProps) {
    super.componentWillReceiveProps(nextProps);
    let tabCount = this.props.tabs && this.props.tabs.length;
    let newTabCount = nextProps.tabs && nextProps.tabs.length;
    if (tabCount != newTabCount) {
      this._updateScroll(this.getScrollValue(), nextProps);
    }
  }

  _updateScroll(scrollValue, props) {
    if(this.props.linePosition == 'none') {
      return;
    }
    this.state.lineOffset.left.setValue(scrollValue * this._getLineWidth(props || this.props));
  }

  onScrollValueChange(e) {
    this._updateScroll(e.value);
  }

  onSetNewScrollValue() {
    this._updateScroll(this.getScrollValue());
  }

  onContainerWidthChange(newWidth) {
    let tabCount = this.props.tabs && this.props.tabs.length;
    if(!tabCount) {
      return;
    }
    this._updateScroll(this.getScrollValue());
  }

  _getLineWidth(props) {
    let tabCount = props.tabs && props.tabs.length;
    if (!tabCount) {
      return 0;
    }
    return this.state.containerWidth / tabCount;
  }

  getLineOffset() {
    this.state.lineOffset.width = this._getLineWidth(this.props);
    if (!this.state.lineOffset.width) {
      return null;
    }
    return this.state.lineOffset;
  }

  renderTabsContainer(tabsContainerStyle) {
    return (
      <View style={tabsContainerStyle}>
        {this.renderTabs()}
      </View>
    );
  }

  renderContainer(containerStyle, wrapperStyle, tabsContainerStyle, line) {
    return (
      <View onLayout={this._onContainerLayout} style={[containerStyle, wrapperStyle]}>
        {this.renderTabsContainer(tabsContainerStyle)}
        {line}
      </View>
    );
  }
}
