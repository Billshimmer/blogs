'use strict';

import React, {
  Component,
  PropTypes,
} from 'react';
import ReactNative, {
  Platform,
  ActivityIndicator,
} from 'react-native';

export default class LoadingView extends Component {

  static defaultProps = {
    size: Platform.OS === 'ios' ? 'small' : 'large',
  };

  render() {
    return (
      <ActivityIndicator {...this.props}/>
    );
  }
}
