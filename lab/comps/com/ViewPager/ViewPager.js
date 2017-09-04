'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, { StyleSheet, Text, View } from 'react-native';
import BaseViewPager from 'lab4/basiccomps/ViewPager/ViewPager';
import LAB, { EventConstants } from 'lab4';

//TODO 向子页面传递ViewPager相关事件，比如item可见与不可见等
export default class ViewPager extends LAB.Component {
  static contextTypes = {
    ...LAB.Component.eventContextTypes,
  };

  static propTypes = {
    tabBar: PropTypes.object,
    tabBarPosition: BaseViewPager.propTypes.tabBarPosition,
    initialPage: PropTypes.number,
    eventId: PropTypes.string,
  };

  static defaultProps = {
    tabBarPosition: 'top',
  };

  constructor(props, context) {
    super(props, context);
    this._renderTabBar = this._renderTabBar.bind(this);
    this._onChangeTab = this._onChangeTab.bind(this);
    this._onScroll = this._onScroll.bind(this);
  }

  componentDidMount() {
    if (this.props.eventId != null) {
      this.emitter.on(
        EventConstants.TAB_BAR_TAB_CHANGE,
        (e, i) => {
          if (__DEV__) {
            console.log('ViewPager onTabChanged i:', i);
          }
          if (e.target.props.eventId !== this.props.eventId) {
            return;
          }
          if (
            this.refs.view_pager &&
            this.refs.view_pager.state.currentPage != i
          ) {
            this.refs.view_pager.goToPage(i);
          }
        },
        this
      );
    }
  }

  componentWillUnmount() {
    if (this.props.eventId != null) {
      this.emitter.offByTag(this);
    }
  }

  goToPage(index) {
    this.refs.view_pager.goToPage(index);
  }

  setCurrentPage(index) {
    return this.refs.view_pager.goToPage(index);
  }

  _onChangeTab(e) {
    //TODO ScrollableTabView 的onChangeTab可能会调多次
    this.props.onChangeTab && this.props.onChangeTab(e.i);
    if (this.props.eventId != null) {
      this.emitCurrent(EventConstants.VIEW_PAGER_PAGE_CHANGE, e.i);
    }
  }

  _onScroll(value) {
    //TODO 暂时不发送scroll事件
    // if(this.props.eventId == null) {
    //   return;
    // }
    // this.emitter.emit(this.nsEvent(EventConstants.VIEW_PAGER_PAGE_SCROLL), value);
  }

  _renderTabBar() {
    if (this.props.renderTabBar) {
      return this.props.renderTabBar();
    }
    return this.props.tabBar && LAB.render(this.props.tabBar);
  }

  render() {
    return (
      <BaseViewPager
        {...this.props}
        ref="view_pager"
        renderTabBar={
          this.props.tabBar || this.props.renderTabBar
            ? this._renderTabBar
            : false
        }
        onChangeTab={this._onChangeTab}
        onScroll={this._onScroll}
        style={[this.getStyle('container'), this.props.style]}
      >
        {this.props.children}
      </BaseViewPager>
    );
  }
}

// const styles = StyleSheet.create({
// });
