'use strict';

import React, {
  Component,
  PropTypes,
} from 'react';
import ReactNative, {
  View,
  StyleSheet,
} from 'react-native';

export default class RatioView extends Component {

  static propTypes = {
    whRatio: PropTypes.number,
    aspectRatio: PropTypes.number,
  };

  setNativeProps(props) {
    this.refs.container && this.refs.container.setNativeProps(props);
  }

  render() {
    const props = this.props;
    const aspectRatio = props.aspectRatio || props.whRatio;
    let children = props.children;
    let ratioView;
    if (aspectRatio > 0) {
      ratioView = (
        <div style={{paddingTop: `${(1 / aspectRatio) * 100}%`,}}></div>
      );
      children = children && React.cloneElement(
        React.Children.only(children),
        {
          style: [children.props.style, StyleSheet.absoluteFill],
        }
      );
    }

    return (
      <View
        {...props}
        ref="container">
        {ratioView}
        {children}
      </View>
    );
  }
}
