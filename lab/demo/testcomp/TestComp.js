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

export default class TestComp extends BaseTestComponent {

  static contextTypes = {
    page: PropTypes.object,
    xxx: PropTypes.string,
  };

  static propTypes = {
    aaa: PropTypes.string,
    bbb: PropTypes.object,
    ccc: PropTypes.number,
  };

  static defaultProps = {
    aaa: 'aaa',
    bbb: {bbb: 1},
    ccc: 3,
  };

  constructor(props, context) {
    super(props, context);
    this._id = Date.now();

    props.abc.xxx = 1;

    console.log('TestComp constructor props:', props);
  }

  componentWillReceiveProps(...args) {
    super.componentWillReceiveProps(...args);
    setImmediate(() => {
      this.log('componentWillReceiveProps setImmediate');
    });
    setTimeout(() => {
      this.log('componentWillReceiveProps setTimeout');
    });
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
