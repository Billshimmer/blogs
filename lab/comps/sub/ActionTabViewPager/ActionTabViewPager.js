'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, {
  StyleSheet,
  ScrollView,
  View,
  PanResponder,
  Text,
  Platform,
} from 'react-native';
import LAB, { requireComp } from 'lab4';

const ViewPager = requireComp('com.ViewPager');
const ActionTab = requireComp('com.ActionTab');

export default class ActionTabViewPager extends LAB.Component {
  static propTypes = {
    tabData: PropTypes.array,
    initialPage: PropTypes.number,
    activeOpacity: PropTypes.number,
    multiple: PropTypes.number, //选中状态下Tab内容放大倍数
    showText: PropTypes.bool,
  };
  static defaultProps = {
    activeOpacity: 0.8,
    tabData: [],
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      curTab: this.props.initialPage || 0,
    };
    this.defaultStyles = styles;
    this.goToPage = this.goToPage.bind(this);
  }
  componentWillMount() {}
  componentDidMount() {}

  render() {
    return (
      <View style={this.getStyle('container')}>
        <ActionTab
          ref="action_tab"
          tabData={this.props.tabData}
          multiple={this.props.multiple}
          showText={this.props.showText}
          onChange={this.goToPage}
        />
        <ViewPager
          ref="view_pager"
          locked={false}
          initialPage={this.props.initialPage}
          scrollWithoutAnimation={false}
          onChangeTab={(i, tab) => {
            this.refs.action_tab && this.refs.action_tab.setValue(i);
          }}
        >
          {this.props.children}
        </ViewPager>
      </View>
    );
  }

  goToPage(i) {
    // console.log(i);
    this.refs.view_pager && this.refs.view_pager.goToPage(i);
  }
  onChangePage(i) {
    // this.refs.scroll.scrollTo({
    //   x:this.state.widthItem * i,
    //   y:0,
    //   animated:true});
    // this.setState({curTab:i});
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 0,
  },
  actionText: {
    textAlign: 'center',
  },
});
