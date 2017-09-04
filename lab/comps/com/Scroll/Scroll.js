'use strict';

import React, { PropTypes } from 'react';
import ReactNative, {
  StyleSheet,
  View,
  ScrollView,
  RefreshControl,
  Dimensions,
  Platform,
} from 'react-native';
import LAB from 'lab4';
import RefreshControlConfig from 'lab4/basiccomps/RefreshControlConfig';
import ScrollViewMixin from 'lab4/basiccomps/ScrollView/ScrollViewMixin';
import PageScrollExt from 'lab4/basiccomps/PageScrollExt';

export default class Scroll extends LAB.Component {
  static propTypes = {
    refreshable: PropTypes.bool,
    isRefreshing: PropTypes.bool,
    onRefresh: PropTypes.func,
    refreshControlProps: PropTypes.object,
    bindPageRefresh: PropTypes.bool,
    topBounceBgStyle: PropTypes.object, //顶部弹动时露出的背景的style
  };

  static defaultProps = {
    refreshControlProps: RefreshControlConfig.refreshControlProps,
  };

  static contextTypes = {
    //PageScrollExt需要
    page: PropTypes.object,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      isRefreshing: !!props.isRefreshing,
    };

    this._onRefresh = this._onRefresh.bind(this);
    this._setScrollViewRef = this._setScrollViewRef.bind(this);
  }

  componentDidMount() {
    this.pageScrollInit();
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

  _getTopBounceBgStyle() {
    let topBounceBg = this.getStyle('topBounceBg');
    if (topBounceBg || this.props.topBounceBgStyle) {
      return [topBounceBg, this.props.topBounceBgStyle];
    }
    return null;
  }

  setNativeProps(nativeProps) {
    this._scrollView && this._scrollView.setNativeProps(nativeProps);
  }

  _setScrollViewRef(scrollView) {
    this._scrollView = scrollView;
  }

  refreshStart() {
    if (this.props.isRefreshing != null) {
      if (__DEV__) {
        console.log('Scroll refreshStart this.props.isRefreshing != null');
      }
      return;
    }
    if (this.state.isRefreshing) {
      return;
    }
    this.setState({
      isRefreshing: true,
    });
  }

  refreshComplete() {
    if (this.props.isRefreshing != null) {
      if (__DEV__) {
        console.log('Scroll refreshComplete this.props.isRefreshing != null');
      }
      return;
    }
    if (!this.state.isRefreshing) {
      return;
    }
    this.setState({
      isRefreshing: false,
    });
  }

  _onRefresh() {
    this.props.onRefresh && this.props.onRefresh();
    this.pageScrollOnRefresh();
  }

  onPageRefreshStart() {
    this.refreshStart();
  }

  onPageRefreshComplete() {
    this.refreshComplete();
  }

  render() {
    const props = this.props;

    let topBounceBgStyle;
    if (Platform.OS === 'ios') {
      topBounceBgStyle = this._getTopBounceBgStyle();
    }
    let refreshControl;
    if (props.refreshable) {
      let refreshControlStyle = props.refreshControlProps.style;
      if (topBounceBgStyle) {
        if (refreshControlStyle) {
          topBounceBgStyle.unshift(refreshControlStyle);
        }
        refreshControlStyle = topBounceBgStyle;
      }
      refreshControl = (
        <RefreshControl
          {...props.refreshControlProps}
          refreshing={this.state.isRefreshing}
          onRefresh={this._onRefresh}
          style={refreshControlStyle}
        />
      );
    }
    return (
      <ScrollView
        ref={this._setScrollViewRef}
        {...props}
        refreshControl={refreshControl}
        contentContainerStyle={[
          this.getStyle('contentContainer'),
          props.contentContainerStyle,
        ]}
        style={[this.getStyle('container'), props.style]}
      >
        {topBounceBgStyle &&
          !props.refreshable &&
          <View style={[topBounceBgStyle, styles.headerTopBounce]} />}
        {props.children}
      </ScrollView>
    );
  }
}

Object.assign(Scroll.prototype, ScrollViewMixin, PageScrollExt);

const screenHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
  headerTopBounce: {
    position: 'absolute',
    left: 0,
    top: -screenHeight,
    right: 0,
    height: screenHeight,
  },
});
