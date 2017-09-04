'use strict';

import React, { PropTypes } from 'react';
import ReactNative, { StyleSheet, Text, View } from 'react-native';
import LAB from 'lab4';

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

export default class Error extends LAB.Component {
  render() {
    return (
      <View style={[this.props.style, styles.container]}>
        <Text style={styles.errorText}>{this.props.message}</Text>
      </View>
    );
  }
}
