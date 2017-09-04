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
  Page,
  requireComp,
} from 'lab4';

import SimplePage from 'lab4/demo/SimplePage';
import TestHelper from 'lab4/demo/TestHelper';

const Icon = requireComp('com.Icon');

export default class IconDemo extends SimplePage {

  constructor(props, context) {
    super(props, context);
    this.state = {
      color: '#757575',
    };
    this.configPage({
      scrollable: true,
    });
  }

  testToggleColor() {
    this.setState({
      color: this.state.color == '#00c853' ? '#757575' : '#00c853',
    });
  }

  renderTest() {
    return (
      <View style={{
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <Text>font icon</Text>
        <Icon name="check" color="#009688" size={30}/>
        <Icon name="action-back" color="#009688" size={20} style={{
            iColor: this.state.color,
            iSize: 30,
          }}/>
        <Icon name="fa-angle-right" color="#009688" size={20} style={{
            iColor: this.state.color,
            iSize: 30,
          }}/>
      </View>
    );

    // <Text style={{marginTop: 20}}>image</Text>
    // <Icon name="@image/demo/ic_alarm" color="#43a047" size={40}/>
    // <Icon name="@image/demo/ic_autorenew" color="#7c4dff" size={20} style={{
    //     iColor: this.state.color,
    //     iSize: 40,
    //   }}/>
  }
}

const styles = StyleSheet.create({
  container: {
  },
});
