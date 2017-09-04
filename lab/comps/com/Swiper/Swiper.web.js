'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, {
  StyleSheet,
  Text,
  View,
  Platform,
  Dimensions,
} from 'react-native';
import LAB from 'lab4';
import Slick from './react-slick/src/slider';
import RatioView from 'lab4/basiccomps/RatioView';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
  },

  pagination: {
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

export default class Swiper extends LAB.Component {
  static propTypes = {
    horizontal: PropTypes.bool,
    showPagination: PropTypes.bool,
    loop: PropTypes.bool,
    autoplay: PropTypes.bool,
    autoplayTimeout: PropTypes.number,
    autoplayDirection: PropTypes.bool,
    defaultIndex: PropTypes.number,
    whRatio: PropTypes.number,
  };

  static defaultProps = {
    horizontal: true,
    showPagination: true,
    loop: true,
    autoplay: false,
    autoplayTimeout: 2.5,
    autoplayDirection: true,
    defaultIndex: 0,
    whRatio: 2,
  };

  constructor(props, context) {
    super(props, context);
    this.state = this._initState(this.props);
    this.defaultStyles = styles;
    this._renderPagination = this._renderPagination.bind(this);
    this._updateIndex = this._updateIndex.bind(this);
  }

  _initState(props) {
    let initState = {};
    initState.index = props.defaultIndex;
    return initState;
  }

  _updateIndex(index) {
    this.setState({ index: index });
  }

  _renderPagination() {
    // By default, dots only show when `total` >= 2
    if (this.props.children.length <= 1 || !this.props.showPagination)
      return null;
    let dots = [];
    let ActiveDot = <View style={this.getStyle('activeDot')} />;
    let Dot = <View style={this.getStyle('dot')} />;
    for (let i = 0; i < this.props.children.length; i++) {
      dots.push(
        i === this.state.index
          ? React.cloneElement(ActiveDot, { key: i })
          : React.cloneElement(Dot, { key: i })
      );
    }

    return (
      <View pointerEvents="none" style={this.getStyle('pagination')}>
        {dots}
      </View>
    );
  }

  render() {
    let {
      loop,
      autoplay,
      autoplayTimeout,
      autoplayDirection,
      defaultIndex,
      ...props
    } = this.props;
    return (
      <RatioView {...props}>
        <View>
          <Slick
            dots={false}
            infinite={loop}
            autoplay={autoplay}
            autoplaySpeed={autoplayTimeout * 1000}
            rtl={!autoplayDirection}
            initialSlide={defaultIndex}
            arrows={false}
            afterChange={this._updateIndex}
          >
            {this.props.children}
          </Slick>
          {this._renderPagination()}
        </View>
      </RatioView>
    );
  }
}
