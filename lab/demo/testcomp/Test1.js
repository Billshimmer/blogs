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
import Test2 from './Test2';

export default class Test1 extends BaseTestComponent {

  static contextTypes = {
    page: PropTypes.object,
    xxx: PropTypes.string,
  };

  constructor(props, context) {
    super(props, context);

    this.log('constructor context:', context);
  }

  componentWillMount() {
    this.log('componentWillMount context:', this.context);
  }

  componentDidMount() {
    this.log('componentDidMount context:', this.context);
  }

  // shouldComponentUpdate() {
  //   this.log('shouldComponentUpdate');
  //   return false;
  // }

  render() {
    this.log('render');
    return (
      <View style={styles.container}>
        <Text ref="text1">Test1</Text>
        <Test2
          ref="test2"
          cwrpcbk={() => {
            this.log('cwrpcbk refs=', this.refs);
          }}
          test1={this}
          renderContent={() => {
            // XXX ref
            // return (
            //   <Text ref="test_content">Test2 content render in Test1</Text>
            // );
            return (
              <Text ref={(comp) => {console.log('xxxxx test1: ', comp);}}>Test2 content render in Test1</Text>
            );
          }}/>
      </View>
    );
  }
}

Object.assign(Test1.prototype, {});

var styles = StyleSheet.create({
  container: {
    backgroundColor: '#B1C130',
  },
});
