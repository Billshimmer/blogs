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
  Image,
  ScrollView,
} from 'react-native';

import {
  Page,
  requireComp,
} from 'lab4';

import SimplePage from 'lab4/demo/SimplePage';
import TestHelper from 'lab4/demo/TestHelper';
import MapView from 'lab4/basiccomps/MapView/LABMapView'
import img_icon1 from 'lab4/demo/img/icon1.png';

export default class MapTest extends SimplePage {

  constructor(props, context) {
    super(props, context);
    this.state = {

    };
  }

  test1() {
    this.setState({

    });
  }

  test2() {
  }

  test3() {
  }

  renderTest() {
    return (
      <View style={{flex: 1}}>
        <MapView annotations={
          [
            {
              latitude: 29,
              longitude: 120,
              title: 'xxx',
              view: <View><Text>xxxxx</Text><Image source={img_icon1}/></View>,
              onFocus: (e) => {

              },
              onBlur: (e) => {

              }
            }
          ]
        }
        region={{
          latitude: 29,
          longitude: 120,
          latitudeDelta: 2,
          longitudeDelta: 2,
        }}
        style={{flex: 1}}/>
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
