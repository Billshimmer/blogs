'use strict';

import React, {
  Component,
  PropTypes,
} from 'react';
import ReactNative, {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Animated,
  Platform,
  findNodeHandle,
} from 'react-native';

import {
  Page,
} from 'lab4';

import SimplePage from '../SimplePage';
import TestHelper from '../TestHelper';

export default class ReactTest extends Component {

  // static childContextTypes = {
  //   aaa: PropTypes.object,
  // };

  // getChildContext() {
  //   return {
  //     aaa: this,
  //   };
  // }

  constructor(props, context) {
    super(props, context);
    this.state = {
    };

    //console.log('constructor findNodeHandle:', findNodeHandle(this));
  }

  testSetState() {
    this.setState({});
  }

  testForceUpdate() {
    this.forceUpdate();
  }

  testForceUpdate1() {
    setTimeout(() => {
      this.forceUpdate();
    });
  }

  testUpdateAAA() {
    this.refs.aaa.forceUpdate();
  }

  testFindNodeHandle() {
    console.log('test findNodeHandle:', findNodeHandle(this));
    console.log('test findNodeHandle aaa ', findNodeHandle(this.refs.aaa));
  }

  render() {
    console.log('ReactTest render');
    // if (!this._comp1EleCache) {
    //   this._comp1EleCache = (
    //     <Comp1 key="xxx" />
    //   );
    // }
    return (
      <View style={styles.container}>
        {this.renderTestBtns()}
        <AAA ref="aaa"/>
      </View>
    );
  }
}

TestHelper.assignHelpers(ReactTest.prototype);

class AAA extends Component {
  render() {
    console.log('AAA render');
    if (!this._comp1EleCache) {
      this._comp1EleCache = (
        <Comp1 key="xxx" />
      );
    }
    return (
      <BBB>{this._comp1EleCache}</BBB>
    )
  }
}

class BBB extends Component {
  // static childContextTypes = {
  //   aaa: PropTypes.object,
  // };

  // getChildContext() {
  //   return {
  //     aaa: this,
  //   };
  // }

  render() {
    console.log('BBB render');
    return this.props.children;
  }
}

class Comp1 extends Component {

  render() {
    console.log('Comp1 render');
    return (
      <Text>Comp1</Text>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 48,
  },
});
