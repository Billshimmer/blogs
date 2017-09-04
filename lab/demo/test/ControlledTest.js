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
  TextInput,
  Switch,
} from 'react-native';

import {
  Page,
} from 'lab4';

import SimplePage from 'lab4/demo/SimplePage';
import TestHelper from 'lab4/demo/TestHelper';

export default class ControlledTest extends SimplePage {

  constructor(props, context) {
    super(props, context);
    this.state = {
      textInputValue: "111",
      switchValue: true,
    };
  }

  test1() {
  }

  test2() {
  }

  test3() {
  }

  renderContent() {
    return (
      <View>
        <TextInput
          defaultValue="xxx"
          onChangeText={(value) => {
          // this.setState({
          //   textInputValue: value
          // });
        }} style={{height: 50}} />
        <Switch
          value={this.state.switchValue}
          onValueChange={(value) => {
            this.setState({
              switchValue: value
            });
          }}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});
