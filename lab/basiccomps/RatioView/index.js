'use strict';

import React, {
  Component,
  PropTypes,
} from 'react';
import ReactNative, {
  View,
} from 'react-native';

/**
 * @DEPRECATED
 * 废弃 rn已经支持aspectRatio
 * TODO 在web 支持aspectRatio之后 显示warning
 */
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
    return (
      <View
        {...props}
        ref="container"
        style={[props.style, {
          aspectRatio,
        }]}>
        {props.children}
      </View>
    );
  }
}
