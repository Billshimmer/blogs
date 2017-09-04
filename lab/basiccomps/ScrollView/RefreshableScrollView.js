'use strict';

import React, {
  Component,
  PropTypes,
} from 'react';
import ReactNative, {
  StyleSheet,
  View,
  Text,
  ScrollView,
  RefreshControl,
} from 'react-native';

import RefreshControlConfig from 'lab4/basiccomps/RefreshControlConfig';
import ScrollViewMixin from './ScrollViewMixin';
import PageScrollExt from 'lab4/basiccomps/PageScrollExt';

if (__DEV__) {
  console.warn('RefreshableScrollView 已废弃 请使用com.Scroll!');
}

//废弃 使用com.Scroll
export default class RefreshableScrollView extends Component {

  static propTypes = {
    refreshable: PropTypes.bool,
    isRefreshing: PropTypes.bool,
    onRefresh: PropTypes.func,
    refreshControlProps: PropTypes.object,
    bindPageRefresh: PropTypes.bool,
    topBounceBgStyle: PropTypes.object, //顶部弹动时露出的背景的style
    emptyFillContent: PropTypes.bool, //数据为空时是否让emptyView 填充content
  };

  static defaultProps = {
    refreshControlProps: RefreshControlConfig.refreshControlProps,
  };

  static contextTypes = {
    //PageScrollExt需要
    pageEmitter: PropTypes.object,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      isRefreshing: props.isRefreshing,
    };

    this.refreshStart = this.refreshStart.bind(this);
    this.refreshComplete = this.refreshComplete.bind(this);
    this._onRefresh = this._onRefresh.bind(this);
    this._setScrollViewRef = this._setScrollViewRef.bind(this);
  }

  componentDidMount() {
    this.pageScrollInit(this.refreshStart, this.refreshComplete);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isRefreshing != null) {
      this.state.isRefreshing = nextProps.isRefreshing;
    }
    this.pageScrollWillReceiveProps(nextProps);
  }

  componentWillUnmount() {
    this.pageScrollDeInit();
  }

  setNativeProps(nativeProps) {
    this._scrollView && this._scrollView.setNativeProps(nativeProps);
  }

  _setScrollViewRef(scrollView) {
    this._scrollView = scrollView;
  }

  refreshStart() {
    if(this.props.isRefreshing != null) {
      if (__DEV__) console.log('refreshStart this.props.isRefreshing');
      return;
    }
    if (this.state.isRefreshing) {
      return;
    }
    this.setState({
      isRefreshing: true
    });
  }

  refreshComplete() {
    if (this.props.isRefreshing != null) {
      if (__DEV__) console.log('refreshComplete this.props.isRefreshing');
      return;
    }
    if (!this.state.isRefreshing) {
      return;
    }
    this.setState({
      isRefreshing: false
    });
  }

  _onRefresh() {
    if (this.props.onRefresh) {
      this.props.onRefresh.call(null);
    }
    this.pageScrollOnRefresh();
  }

  render() {
    let refreshControl;
    if (this.props.refreshable) {
      refreshControl = (
        <RefreshControl
          {...this.props.refreshControlProps}
          refreshing={this.state.isRefreshing}
          onRefresh={this._onRefresh}
          style={{backgroundColor: 'transparent'}}/>
      );
    }
    return (
      <ScrollView
        ref={this._setScrollViewRef}
        {...this.props}
        refreshControl={refreshControl}>
        {this.props.children}
      </ScrollView>
    );
  }
}

Object.assign(RefreshableScrollView.prototype, ScrollViewMixin, PageScrollExt);

// const styles = StyleSheet.create({
//   container: {
//
//   },
// });
