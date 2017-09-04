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
  MapView,
} from 'react-native';

import LAB, {
  Page,
  Link,
} from 'lab4';

import SimplePage from 'lab4/demo/SimplePage';
import TestHelper from 'lab4/demo/TestHelper';

import TestView from './views/TestView';

export default class ViewManagerTest extends SimplePage {

  constructor(props, context) {
    super(props, context);
    this.state = {
      rotationY: 5,
      testViewKey: 1,
      prop1: 'xxx',
      shadowNodeProp1: 'xxx',
    };
    // this.configPage({
    //   scrollable: true, //页面可滚动
    // });
  }

  test1() {
    this.setState({
      prop1: 'xxx' + Date.now(),
    });
  }

  test2() {
    this.setState({
      shadowNodeProp1: 'xxx' + Date.now(),
    });
  }

  test3() {
    this.setState({
      testViewKey: this.state.testViewKey + 1,
    });
  }

  test4() {
    this.setState({
      rotationY: 60,
    });
  }

  test5() {
    this.setState({
      height: 100 + Math.random() * 50,
    });
  }

  renderContent() {
    return (
      <View style={{flexDirection: 'column', flex: 1, alignSelf: 'stretch', backgroundColor: '#9DCAF0',}}>
        <TestView
          key={this.state.testViewKey}
          ref={(ref) => {
            //console.log('TestView ref=', ref, ' findNodeHandle=', ReactNative.findNodeHandle(ref));
          }}
          labViewId="view1"
          backgroundColor="#E9A29B"
          rotationY={this.state.rotationY}
          obj1={{
            aaa: {
              bbb: 1,
            },
          }}
          prop1={this.state.prop1}
          shadowNodeProp1={this.state.shadowNodeProp1}
          onLayout={(e) => {
            console.log('TestView view1 onLayout', e.nativeEvent);
          }}
          style={{height: this.state.height, flex: 1, marginTop: 30}}/>
        {/* <TestView
          ref={(ref) => {
            //console.log('TestView ref=', ref, ' findNodeHandle=', ReactNative.findNodeHandle(ref));
          }}
          labViewId="view2"
          backgroundColor="#E9A29B"
          obj1={{
            aaa: {
              bbb: 1,
            },
          }}
          shadowNodeProp1="view2"
          style={{marginTop: 30, alignSelf: 'stretch',}}/> */}
        {this.renderTestBtns()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
