'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, { StyleSheet, View, Text } from 'react-native';
import LAB from 'lab4';
import LoadingView from 'lab4/basiccomps/LoadingView';

export default class LoadMoreListFooter extends LAB.Component {
  constructor(props, context) {
    super(props, context);
    this.defaultStyles = styles;
  }

  static propTypes = {
    loadingType: PropTypes.oneOf(['loading', 'noMore', 'normal']),
    noMoreText: PropTypes.string,
    loadingText: PropTypes.string,
    textStyle: PropTypes.any,
  };

  static defaultProps = {
    loadingType: 'normal',
  };

  render() {
    var { loadingType, noMoreText } = this.props;
    if (loadingType == 'normal') {
      return null;
    }
    if (loadingType == 'noMore' && !noMoreText) {
      return null;
    }
    var innerEle;
    if (loadingType == 'loading') {
      innerEle = <LoadingView />;
    } else {
      innerEle = (
        <Text style={(this.props.textStyle, this.getStyle('noMoreText'))}>
          {noMoreText}
        </Text>
      );
    }
    return (
      <View style={[this.getStyle('container'), this.props.style]}>
        {innerEle}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noMoreText: {
    fontSize: 12,
    color: '#727272',
  },
});
