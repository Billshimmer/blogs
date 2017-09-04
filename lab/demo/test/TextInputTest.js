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
} from 'react-native';

import LAB, {
  Page,
  Link,
} from 'lab4';

import SimplePage from 'lab4/demo/SimplePage';
import TestHelper from 'lab4/demo/TestHelper';

export default class TextInputTest extends SimplePage {

  constructor(props, context) {
    super(props, context);

    this.state = {
      show: true,
    };

    // this.configPage({
    //   scrollable: true, //页面可滚动
    // });
  }

  test1() {
    this.setState({
      show: !this.state.show,
    });
  }

  test2() {
    this.setState({

    });
  }

  test3() {
    this.setState({

    });
  }

  renderTest() {
    return (
      <ScrollView keyboardDismissMode="on-drag" keyboardShouldPersistTaps="always" style={{flex: 1}}>
        <View>
          <TextInput style={{height: 50, backgroundColor: '#E4FFD6', marginBottom: 10}}/>
          {this.state.show ? <TextInput style={{height: 50, backgroundColor: '#E4FFD6', marginBottom: 10}}/> : null}

          {/* 让android的多行textinput居上 */}
          <TextInput
            numberOfLines={5}
            multiline={true}
            textAlignVertical="top"
            style={{
              height: 100,
            }} />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
