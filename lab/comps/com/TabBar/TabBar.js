'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, { StyleSheet, Text, View, Animated } from 'react-native';

import LAB, { EventConstants } from 'lab4';

import ScrollableTabBar from 'lab4/basiccomps/TabBar/ScrollableTabBar';
import LABTabBar from 'lab4/basiccomps/TabBar/TabBar';

export default class TabBar extends LAB.Component {
  static contextTypes = {
    ...LAB.Component.eventContextTypes,
  };

  static propTypes = {
    items: PropTypes.array,
    scrollable: PropTypes.bool,
    eventId: PropTypes.string, //作为当前组件发出的事件的id 同时也作为接收事件的筛选条件 当前组件作为构造参数 后续改变无效
  };

  // static defaultProps = {};

  constructor(props, context) {
    super(props, context);
    if (props.eventId) {
      this.state = {
        activeTab: props.defaultActiveTab == null
          ? props.initialTab
          : props.defaultActiveTab,
        //scrollValue: new Animated.Value(props.initialTab),
      };
    }
    this._renderTab = this._renderTab.bind(this);
    this._onChangeTab = this._onChangeTab.bind(this);
    if (__DEV__ && props.items && props.tabs && props.items.length != props.tabs.length) {
      console.warn('TabBar item数与ViewPager页面数不符!');
      return;
    }
  }

  componentDidMount() {
    if (this.props.eventId) {
      this.emitter.on(
        EventConstants.VIEW_PAGER_PAGE_CHANGE,
        (e, page) => {
          if (__DEV__) console.log('TabBar onPageChanged page:', page);
          if (e.target.props.eventId !== this.props.eventId) {
            return;
          }
          this.setState({
            activeTab: page,
          });
        },
        this
      );
      // this.emitter.on(EventConstants.VIEW_PAGER_PAGE_SCROLL, (offset) => {
      //   //console.log("TabBar onPageScroll offset:", offset);
      //   this.state.scrollValue.setValue(offset);
      // }, this);
    }
  }

  componentWillUnmount() {
    if (this.props.eventId) {
      this.emitter.offByTag(this);
    }
  }

  get activeTab() {
    return this.refs.tab_bar.getCurrentTab();
  }

  set activeTab(value) {
    this.refs.tab_bar.setCurrentTab(value);
  }

  getCurrentTab() {
    return this.refs.tab_bar.getCurrentTab();
  }

  setCurrentTab(i) {
    this.refs.tab_bar.setCurrentTab(i);
  }

  _onChangeTab(i) {
    this.emitCurrent(EventConstants.TAB_BAR_TAB_CHANGE, i);
    this.props.onChangeTab && this.props.onChangeTab(i);
  }

  _renderTab(tab, i, isActive) {
    if (this.props.renderTab) {
      return this.props.renderTab(tab, i, isActive);
    }
    return LAB.render(this.props.items[i]);
  }

  render() {
    let TabBarClass = this.props.scrollable ? ScrollableTabBar : LABTabBar,
      exProps;
    if (this.props.eventId) {
      exProps = {
        onChangeTab: this._onChangeTab,
        //scrollValue: this.state.scrollValue,
        activeTab: this.state.activeTab,
      };
    }
    return (
      <TabBarClass
        {...this.props}
        {...exProps}
        ref="tab_bar"
        tabs={this.props.items || this.props.tabs}
        renderTab={this._renderTab}
        style={[this.getStyle('container'), this.props.style]}
        lineStyle={this.getStyle('line')}
      />
    );
  }
}
// const styles = StyleSheet.create({
// });
