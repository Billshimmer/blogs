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
  ScrollView,
  Platform,
} from 'react-native';

import BaseTabBar from './BaseTabBar';

let TAB_EDGE_DIS = 60;

export default class ScrollableTabBar extends BaseTabBar {

  constructor(props, context) {
    super(props, context);
    this.state.lineOffset = {
      left: new Animated.Value(0),
      width: 100, //width固定为100 通过scaleX改变
      scaleX: new Animated.Value(0),
      tabContainerWidth: 0,
    };
    this._tabsMeasurements = [];
    this._scrollX = 0;

    this._onScroll = this._onScroll.bind(this);
    this._onTabContainerLayout = this._onTabContainerLayout.bind(this);
  }

  _measureTab(i, nativeEvent) {
    //console.log('_measureTab', i, nativeEvent.layout);
    let {
      x,
      width,
    } = nativeEvent.layout;
    let oldMeasurement = this._tabsMeasurements[i];
    if (!oldMeasurement || oldMeasurement.left != x || oldMeasurement.width != width) {
      this._tabsMeasurements[i] = {
        left: x,
        width,
      };
      this._updateScroll(this.getScrollValue());
    }
  }

  _onScroll(e) {
    this._scrollX = e.nativeEvent.contentOffset.x;
  }

  onScrollValueChange(e) {
    //console.log('onScrollValueChange ', e.value);
    this._updateScroll(e.value);
  }

  _updateScroll(scrollValue) {
    let tabCount = this.props.tabs && this.props.tabs.length;
    if(!(tabCount > 0)) {
      return;
    }

    if (scrollValue < 0) {
      scrollValue = 0;
    } else if (scrollValue > tabCount - 1) {
      scrollValue = tabCount - 1;
    }
    let position = Math.floor(scrollValue);
    let tabOffset = scrollValue - position;
    let nextPosition = position === tabCount - 1 ? position : position + 1;
    if(this._tabsMeasurements[position] && this._tabsMeasurements[nextPosition]) {
      this.updateLineAndPan(position, tabOffset, tabCount, this._tabsMeasurements[position], this._tabsMeasurements[nextPosition]);
    }
  }

  updateLineAndPan(position, tabOffset, tabCount, tabMeasurement, nextTabMeasurement) {
    let tabLeft = tabMeasurement.left,
      tabWidth = tabMeasurement.width,
      nextTabLeft = nextTabMeasurement.left,
      nextTabWidth = nextTabMeasurement.width,
      newLineLeft = tabLeft + (nextTabLeft - tabLeft) * tabOffset,
      newWidth = tabWidth + (nextTabWidth - tabWidth) * tabOffset;

    let lineOffset = this.state.lineOffset;
    lineOffset.left.setValue(newLineLeft + (newWidth - lineOffset.width) / 2);
    lineOffset.scaleX.setValue(newWidth / lineOffset.width);

    let containerWidth = this.state.containerWidth,
      newScrollX;
    if(!containerWidth || !this.refs.scrollView) {
      return;
    }
    if(newWidth >= containerWidth) {
      newScrollX = newLineLeft;
    } else if(newWidth + TAB_EDGE_DIS + TAB_EDGE_DIS >= containerWidth) {
      newScrollX = newLineLeft - (containerWidth - newWidth) / 2
    } else if(newLineLeft - TAB_EDGE_DIS < this._scrollX) {
      newScrollX = newLineLeft - TAB_EDGE_DIS;
    } else if(newLineLeft + newWidth + TAB_EDGE_DIS > this._scrollX + containerWidth) {
      newScrollX = newLineLeft + newWidth + TAB_EDGE_DIS - containerWidth;
    } else {
      return;
    }
    if(newScrollX > this.state.tabContainerWidth - this.state.containerWidth) {
      newScrollX = this.state.tabContainerWidth - this.state.containerWidth;
    }
    if(newScrollX < 0) {
      newScrollX = 0;
    }
    if(Math.round(newScrollX) != Math.round(this._scrollX)) {
      this._scrollX = newScrollX;
      this.refs.scrollView.scrollTo({x: newScrollX, animated: false});
    }
  }

  getLineOffset() {
    return this.state.lineOffset;
  }

  getTabContainerProps(i) {
    return {
      ref: 'tab_' + i,
      onLayout: (e) => { this._measureTab(i, e.nativeEvent) },
      style: styles.tabContainer,
    };
  }

  renderTabsContainer(tabsContainerStyle) {
    return (
      <View ref="tabsContainer" style={tabsContainerStyle}>
        {this.renderTabs()}
      </View>
    );
  }

  _onTabContainerLayout(e) {
    let width = e.nativeEvent.layout.width;
    if(width != this.state.tabContainerWidth) {
      //console.log('_onTabContainerLayout', this.state.tabContainerWidth, width);
      this.state.tabContainerWidth = width;
      this._updateScroll(this.getScrollValue());
    }
  }

  renderContainer(containerStyle, wrapperStyle, tabsContainerStyle, line) {
    return (
      <View
        onLayout={this._onContainerLayout}
        style={containerStyle}>
        <ScrollView
          ref="scrollView"
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          alwaysBounceVertical={false}
          directionalLockEnabled={true}
          onScroll={this._onScroll}
          scrollEventThrottle={16}>
            <View onLayout={this._onTabContainerLayout} style={wrapperStyle}>
              {this.renderTabsContainer(tabsContainerStyle)}
              {line}
            </View>
        </ScrollView>
      </View>
    );
  }
}

let styles = StyleSheet.create({
  tabContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
