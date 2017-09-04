'use strict';

import React, {
  PropTypes,
} from 'react';
import ReactNative, {
  StyleSheet,
  View,
} from 'react-native';
import LAB, {
  requireComp,
} from 'lab4';

/**
 * 
 */
export default class Drawable extends LAB.PureComponent {

  static propTypes = {
  };

  static defaultProps = {
  };

  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <View
        style={[this.getStyle('container'), this.props.style]}>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
Drawable.defaultStyles = styles;
