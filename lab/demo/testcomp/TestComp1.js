'use strict';

import React, { 
  Component,
  PropTypes,
} from 'react';
import ReactNative, {
  StyleSheet,
  View,
  Text,
} from 'react-native';

import BaseTestComponent from 'lab4/demo/BaseTestComponent';

export default class TestComp1 extends BaseTestComponent {

  static contextTypes = {
    page: PropTypes.object,
    xxx: PropTypes.string,
  };

  constructor(props, context) {
    super(props, context);
    this._id = Date.now();
  }

  render() {
    this.log('render');
    return (
      <Text style={styles.text}>{this.props.name} id: {this._id}</Text>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    backgroundColor: '#B1C130',
  },
  text: {
    fontSize: 18,
  }
});
