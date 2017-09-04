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

export default class Nmmixin extends Component {

  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <View>
        <Text>nmmixin</Text>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {

  },
});
