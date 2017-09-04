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
  TouchableOpacity,
} from 'react-native';

import LAB, {
  Page,
  Link,
} from 'lab4';

import SimplePage from 'lab4/demo/SimplePage';
import TestHelper from 'lab4/demo/TestHelper';

const SHOW_TOUCH_EVENT = true;

export default class ResponderEventTest extends SimplePage {

  constructor(props, context) {
    super(props, context);
    this.state = {
    };
    // this.configPage({
    //   scrollable: true, //页面可滚动
    // });
  }

  test1() {
  }

  test2() {
  }

  test3() {
  }

  test4() {
  }

  test5() {
  }

  renderContent() {
    return (
      <View style={styles.container}>
        <View
          onStartShouldSetResponderCapture={(e) => {
            console.log('onStartShouldSetResponderCapture ', SHOW_TOUCH_EVENT && e.nativeEvent);
            //return true;
          }}
          onMoveShouldSetResponderCapture={(e) => {
            console.log('onMoveShouldSetResponderCapture ', SHOW_TOUCH_EVENT && e.nativeEvent);
            //return true;
          }}
          onStartShouldSetResponder={(e) => {
            console.log('onStartShouldSetResponder ', SHOW_TOUCH_EVENT && e.nativeEvent);
            //return false;
            return true;
          }}
          onMoveShouldSetResponder={(e) => {
            console.log('onMoveShouldSetResponder ', SHOW_TOUCH_EVENT && e.nativeEvent);
            //return false;
            return true;
          }}
          onResponderGrant={(e) => {
            console.log('onResponderGrant ', SHOW_TOUCH_EVENT && e.nativeEvent);
          }}
          onResponderMove={(e) => {
            console.log('onResponderMove ', SHOW_TOUCH_EVENT && e.nativeEvent);
            //e.nativeEvent.preventDefault();
          }}
          onResponderReject={(e) => {
            console.log('onResponderReject ', SHOW_TOUCH_EVENT && e.nativeEvent);
          }}
          onResponderRelease={(e) => {
            console.log('onResponderRelease ', SHOW_TOUCH_EVENT && e.nativeEvent);
          }}
          onResponderTerminate={(e) => {
            console.log('onResponderTerminate ', SHOW_TOUCH_EVENT && e.nativeEvent);
          }}
          onResponderTerminationRequest={(e) => {
            console.log('onResponderTerminationRequest ', SHOW_TOUCH_EVENT && e.nativeEvent);
            return true;
            //return false;
          }}

          onTouchMove={(e) => {
            console.log('onTouchMove', SHOW_TOUCH_EVENT && e.nativeEvent);
            //android 4.4.4之前 touchmove bug
            //http://wilsonpage.co.uk/touch-events-in-chrome-android/
            //e.preventDefault();
          }}
          onTouchStart={(e) => {
            console.log('onTouchStart', SHOW_TOUCH_EVENT && e.nativeEvent);
          }}
          onTouchCancel={(e) => {
            console.log('onTouchCancel', SHOW_TOUCH_EVENT && e.nativeEvent);
          }}
          onTouchEnd={(e) => {
            console.log('onTouchEnd', SHOW_TOUCH_EVENT && e.nativeEvent);
          }}

          onClick={() => {console.log('onClick');}}
          style={{width: 300, height: 200, backgroundColor: '#16C3F4'}}>

          <TouchableOpacity
            onPress={() => {
              console.log('TouchableOpacity onPress');
            }}
            onPressIn={() => {
              console.log('TouchableOpacity onPressIn');
            }}
            onPressOut={() => {
              console.log('TouchableOpacity onPressOut');
            }}
            style={{padding: 20, backgroundColor: '#E6AEC2'}}>
            <Text>TouchableOpacity</Text>
          </TouchableOpacity>

        </View>
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
