'use strict';

import React, {
  PropTypes,
} from 'react';
import ReactNative, {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import BaseComponent from '../BaseComponent';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'red',
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default function getNotFoundErrorComp(compId) {
  return class NotFoundErrorComp extends BaseComponent {
    render() {
      return (
        <View style={[this.props.style, styles.container]}>
          <Text style={styles.errorText}>未找到组件:{compId}</Text>
        </View>
      );
    }
  };
}
