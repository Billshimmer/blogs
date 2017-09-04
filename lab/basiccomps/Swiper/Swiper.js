'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ViewPagerAndroid,
  Platform,
  Dimensions,
} from 'react-native';

import TimerMixin from 'lab4/utils/TimerMixin';

let screenWidth = Dimensions.get('window').width;

/**
 * Default styles
 * @type {StyleSheetPropType}
 */
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
  },

  wrapper: {
    backgroundColor: 'transparent',
  },

  slide: {
    backgroundColor: 'transparent',
  },

  pagination_x: {
    position: 'absolute',
    bottom: 25,
    left: 0,
    right: 0,
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },

  pagination_y: {
    position: 'absolute',
    right: 15,
    top: 0,
    bottom: 0,
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3,
    backgroundColor: 'rgba(0,0,0,.2)',
  },

  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3,
    backgroundColor: '#007aff',
  },
});

export default class Swiper extends Component {
  static propTypes = {
    horizontal: React.PropTypes.bool,
    style: View.propTypes.style,
    activeDotStyle: View.propTypes.style,
    dotStyle: View.propTypes.style,
    paginationStyle: View.propTypes.style,
    showPagination: React.PropTypes.bool,
    loop: React.PropTypes.bool,
    autoplay: React.PropTypes.bool,
    autoplayTimeout: React.PropTypes.number,
    autoplayDirection: React.PropTypes.bool,
    defaultIndex: React.PropTypes.number,
    whRatio: React.PropTypes.number,
    renderPagination: React.PropTypes.func,
  };

  static defaultProps = {
    horizontal: true,
    pagingEnabled: true,
    showsHorizontalScrollIndicator: false,
    showsVerticalScrollIndicator: false,
    bounces: false,
    scrollsToTop: false,
    removeClippedSubviews: true,
    automaticallyAdjustContentInsets: false,
    showPagination: true,
    loop: true,
    autoplay: false,
    autoplayTimeout: 2.5,
    autoplayDirection: true,
    defaultIndex: 0,
    whRatio: 2,
  };

  static autoplayTimer = null;

  constructor(props, context) {
    super(props, context);
    this.state = this._initState(this.props);
    this._onScrollBegin = this._onScrollBegin.bind(this);
    this._onScrollEnd = this._onScrollEnd.bind(this);
    this._updateIndex = this._updateIndex.bind(this);
    this._onPageScrollStateChanged = this._onPageScrollStateChanged.bind(this);
    this._calContainer = this._calContainer.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const state = this.state;
    const total = nextProps.children ? nextProps.children.length || 1 : 0;
    if (total != this.state.total) {
      state.index = Math.max(
        Math.min(Math.floor(this.state.index), total - 1),
        0
      );
    }

    state.dir = nextProps.horizontal == false ? 'y' : 'x';
    this._whRatio = nextProps.whRatio <= 0 ? 2 : nextProps.whRatio;

    state.offset = {};
    if (state.total > 1) {
      const setup = nextProps.loop ? state.index + 1 : state.index;
      state.offset[state.dir] = state.dir == 'y'
        ? state.height * setup
        : state.width * setup;
    }
    this._viewPagerIndex = nextProps.loop ? state.index + 1 : state.index;
  }

  componentDidMount() {
    this._autoplay();
  }

  componentWillUnmount() {
    this._clearTimers();
  }

  _initState(props) {
    let initState = {
      isScrolling: false,
      autoplayEnd: false,
    };

    initState.total = props.children ? props.children.length || 1 : 0;
    initState.index = Math.max(
      Math.min(Math.floor(props.defaultIndex), initState.total - 1),
      0
    );

    initState.dir = props.horizontal == false ? 'y' : 'x';
    initState.width = screenWidth;
    this._whRatio = props.whRatio <= 0 ? 2 : props.whRatio;
    initState.height = Math.round(screenWidth / this._whRatio);
    initState.offset = {};

    if (initState.total > 1) {
      let setup = props.loop ? initState.index + 1 : initState.index;
      initState.offset[initState.dir] = initState.dir == 'y'
        ? initState.height * setup
        : initState.width * setup;
    }
    this._viewPagerIndex = props.loop ? initState.index + 1 : initState.index;
    return initState;
  }

  /**
   * Automatic srolling
   */
  _autoplay() {
    if (
      !Array.isArray(this.props.children) ||
      !this.props.autoplay ||
      this.state.isScrolling ||
      this.state.autoplayEnd
    )
      return;

    this.clearTimeout(this.autoplayTimer);

    this.autoplayTimer = this.setTimeout(() => {
      if (
        !this.props.loop &&
        (this.props.autoplayDirection
          ? this.state.index == this.state.total - 1
          : this.state.index == 0)
      ) {
        return this.setState({
          autoplayEnd: true,
        });
      }
      this._scrollTo(this.props.autoplayDirection ? 1 : -1);
    }, this.props.autoplayTimeout * 1000);
  }

  /**
   * Scroll begin handle
   * @param  {object} e native event
   */
  _onScrollBegin(e) {
    // update scroll state
    this.setState({
      isScrolling: true,
    });

    this.setTimeout(() => {
      this.props.onScrollBeginDrag &&
        this.props.onScrollBeginDrag(e, this.state);
    });
  }

  /**
   * Scroll end handle
   * @param  {object} e native event
   */
  _onScrollEnd(e) {
    //console.log('onScrollEnd ', e.nativeEvent);

    // update scroll state
    this.setState({
      isScrolling: false,
    });

    // making our events coming from android compatible to updateIndex logic
    if (!e.nativeEvent.contentOffset) {
      if (this.state.dir == 'x') {
        e.nativeEvent.contentOffset = {
          x: e.nativeEvent.position * this.state.width,
        };
      } else {
        e.nativeEvent.contentOffset = {
          y: e.nativeEvent.position * this.state.height,
        };
      }
    }

    this._updateIndex(e.nativeEvent.contentOffset, this.state.dir);

    // Note: `this.setState` is async, so I call the `onMomentumScrollEnd`
    // in setTimeout to ensure synchronous update `index`
    this.setTimeout(() => {
      this._autoplay();

      // if `onMomentumScrollEnd` registered will be called here
      this.props.onMomentumScrollEnd &&
        this.props.onMomentumScrollEnd(e, this.state);
    });
  }

  _onPageScrollStateChanged(scrollState) {
    if (scrollState == 'idle') {
      // console.log('_onPageScrollStateChanged idle index:', this.state.index);
      if (this.state.isScrolling) {
        this.setState({
          isScrolling: false,
        });
      }
      this._onScrollEnd({
        nativeEvent: {
          position: this._viewPagerIndex,
        },
      });
      if (this.props.loop) {
        if (this._viewPagerIndex < 1) {
          this._viewPagerIndex = this.state.total;
          this.refs.scrollView.setPageWithoutAnimation(this._viewPagerIndex);
        } else if (this._viewPagerIndex > this.state.total) {
          this._viewPagerIndex = 1;
          this.refs.scrollView.setPageWithoutAnimation(1);
        }
      }
    } else {
      if (!this.state.isScrolling) {
        this.setState({
          isScrolling: true,
        });
      }
    }
  }

  /**
   * Update index after scroll
   * @param  {object} offset content offset
   * @param  {string} dir    'x' || 'y'
   */
  _updateIndex(offset, dir) {
    //console.log('updateIndex offset:', offset);

    let state = this.state;
    let index = state.index;
    let diff = offset[dir] - state.offset[dir];
    let step = dir == 'x' ? state.width : state.height;

    // Do nothing if offset no change.
    if (!diff) return;

    // Note: if touch very very quickly and continuous,
    // the variation of `index` more than 1.
    //index = index + diff / step;

    index = Math.round(offset[dir] / step);

    if (this.props.loop) {
      --index;
      if (index < 0) {
        index = state.total - 1;
        offset[dir] = step * state.total;
      } else if (index > state.total - 1) {
        index = 0;
        offset[dir] = step;
      }
    }

    this.setState({
      index: index,
      offset: offset,
    });
  }

  /**
   * Scroll by index
   * @param  {number} index offset index
   */
  _scrollTo(index) {
    if (this.state.isScrolling || this.state.total < 2) return;
    let state = this.state;
    let diff = (this.props.loop ? 1 : 0) + index + this.state.index;
    let x = 0;
    let y = 0;
    if (state.dir == 'x') x = diff * state.width;
    if (state.dir == 'y') y = diff * state.height;
    if (this.refs.scrollView) {
      if (Platform.OS == 'ios') {
        this.refs.scrollView.scrollTo({
          y,
          x,
        });
      } else {
        this._viewPagerIndex = diff;
        this.refs.scrollView.setPage(diff);
      }
    }

    // update scroll state
    this.setState({
      isScrolling: true,
      autoplayEnd: false,
    });
  }

  /**
   * Render pagination
   * @return {object} react-dom
   */
  _renderPagination() {
    // By default, dots only show when `total` >= 2
    if (this.state.total <= 1) return null;
    let dots = [];
    let ActiveDot = (
      <View style={[styles.activeDot, this.props.activeDotStyle]} />
    );
    let Dot = <View style={[styles.dot, this.props.dotStyle]} />;
    for (let i = 0; i < this.state.total; i++) {
      dots.push(
        i === this.state.index
          ? React.cloneElement(ActiveDot, { key: i })
          : React.cloneElement(Dot, { key: i })
      );
    }

    return (
      <View
        pointerEvents="none"
        style={[
          styles['pagination_' + this.state.dir],
          this.props.paginationStyle,
        ]}
      >
        {dots}
      </View>
    );
  }

  _renderTitle() {
    return (
      this.props.renderTitle &&
      this.props.renderTitle(
        this.state.index,
        this.props.children[this.state.index]
      )
    );
  }

  _renderScrollView(pages) {
    if (Platform.OS === 'ios') {
      return (
        <ScrollView
          ref="scrollView"
          {...this.props}
          contentContainerStyle={styles.wrapper}
          contentOffset={this.state.offset}
          onScrollBeginDrag={this._onScrollBegin}
          onMomentumScrollEnd={this._onScrollEnd}
          style={{ aspectRatio: this.props.whRatio }}
        >
          {pages}
        </ScrollView>
      );
    }
    return (
      <ViewPagerAndroid
        ref="scrollView"
        onPageSelected={e => {
          this._viewPagerIndex = e.nativeEvent.position;
        }}
        onPageScrollStateChanged={this._onPageScrollStateChanged}
        initialPage={this.props.loop ? this.state.index + 1 : this.state.index}
        style={[{ aspectRatio: this.props.whRatio }, styles.wrapper]}
      >
        {pages}
      </ViewPagerAndroid>
    );
  }

  _calContainer(e) {
    //if width isn't equal to screenWidth after layout, it need re-init
    if (this.state.width != e.nativeEvent.layout.width) {
      let offset = {};
      let width = e.nativeEvent.layout.width;
      let height = Math.round(width / this._whRatio);

      if (this.state.total > 1) {
        let setup = this.props.loop ? this.state.index + 1 : this.state.index;
        offset[this.state.dir] = this.state.dir == 'y'
          ? height * setup
          : width * setup;
      }
      this.setState({
        width: width,
        height: height,
        offset: offset,
      });
    }
  }

  render() {
    if (!this.props.children) {
      return;
    } else {
      let state = this.state;
      let props = this.props;
      let children = props.children;
      let total = state.total;
      let loop = props.loop;

      let pages = [];
      let pageStyle = [
        { width: state.width, height: state.height },
        styles.slide,
      ];

      // For make infinite at least total > 1
      if (total > 1) {
        // Re-design a loop model for avoid img flickering
        pages = Object.keys(children);
        if (loop) {
          pages.unshift(total - 1);
          pages.push(0);
        }

        pages = pages.map((page, i) =>
          <View style={pageStyle} key={i}>
            {React.cloneElement(children[page], {
              style: [children[page].props.style, StyleSheet.absoluteFill],
            })}
          </View>
        );
      } else {
        pages = <View style={pageStyle}>{children}</View>;
      }

      return (
        <View
          style={[styles.container, this.props.style]}
          onLayout={this._calContainer}
        >
          {this._renderScrollView(pages)}
          {props.showPagination &&
            (props.renderPagination
              ? this.props.renderPagination(state.index, state.total)
              : this._renderPagination())}
          {this._renderTitle()}
        </View>
      );
    }
  }
}

Object.assign(Swiper.prototype, TimerMixin);
