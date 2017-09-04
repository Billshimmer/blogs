'use strict';

import React, {
  Component,
  PropTypes,
} from 'react';
import ReactNative, {
  StyleSheet,
  Platform,
  View,
  Text,
  ScrollView,
} from 'react-native';
import LAB, {
  requireComp,
} from 'lab4';
import SimplePage from 'lab4/demo/SimplePage';
import TestHelper from 'lab4/demo/TestHelper';

/**
 * 测试rn 各种css属性的效果
 */
export default class LayoutPropsTest extends SimplePage {

  constructor(props, context) {
    super(props, context);
    this.state = {
      displayNone: false,
    };
    // this.configPage({
    //   scrollable: true,
    // });
  }

  testToggleDisplayNode() {
    this.setState({
      displayNone: !this.state.displayNone,
    });
  }

  renderTest() {
    return (
      <View style={styles.container}>
        {this._renderDisplayTest()}
      </View>
    );
  }

  // 测试display node 0.43+ 支持
  _renderDisplayTest() {
    return (
      <View 
        onLayout={(e) => {
          console.log('display test onLayout', e.nativeEvent);
        }}
        style={{
          display: this.state.displayNone ? 'none' : 'flex',
          backgroundColor: '#80deea',
          width: 200,
          height: 100,
        }}>
        <Text>display none</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
