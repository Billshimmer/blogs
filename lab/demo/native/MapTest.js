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

import {
  Page,
  requireComp,
} from 'lab4';

import SimplePage from 'lab4/demo/SimplePage';
import TestHelper from 'lab4/demo/TestHelper';
const Map = requireComp('com.Map');

export default class MapTest extends SimplePage {

  constructor(props, context) {
    super(props, context);
    this.state = {
      detail: null,
      latitude: 30.276552443988904,
      longitude: 120.11960609078355,
    };
  }

  test1() {
    this.setState({
      latitude: 30.25,
      longitude: 120.10960609078355,
    });
  }

  test2() {
  }

  test3() {
  }

  test4() {
  }

  test5() {
  }

  test6() {
  }

  test7() {
  }

  test8() {
  }

  test9() {
  }

  renderContent() {
    return (
      <View style={{flex: 1}}>
      <Map annotations={
        [
          {
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            onFocus: (e) => {
              this.setState({detail: <Text>111</Text>});
            },
            onBlur: (e) => {
              this.setState({detail: null});
            }
          }
        ]
      } detail={this.state.detail}
      region={{  latitude: 29.259721,
        longitude: 120.235394,latitudeDelta: 0.01, longitudeDelta: 0.01}}
        style={{flex: 1}}/>
        {this.renderTestBtns()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
});
