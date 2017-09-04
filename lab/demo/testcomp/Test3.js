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

export default class Test3 extends BaseTestComponent {

  constructor(props, context) {
    super(props, context);
  }

  render() {
    this.log('render');
    return (
      <View style={styles.container}>
        <Text>{this.logTag()}</Text>
        <View style={{padding: 10, backgroundColor: '#7BA163'}}>
          {this.props.children}
          {this.props.ele}
        </View>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    backgroundColor: '#4A73D7',
  },
});
