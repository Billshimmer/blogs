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
  NativeModules,
} from 'react-native';

import LAB, {
  Page,
} from 'lab4';

import SimplePage from 'lab4/demo/SimplePage';
import TestHelper from 'lab4/demo/TestHelper';

import LABDynamicMapView from 'lab4/basiccomps/MapView/LABDynamicMapView';

export default class LABDynamicMapDemo extends SimplePage {

  constructor(props, context) {
    super(props, context);
    this.state = {
      layers: [
        {
          url: 'http://172.18.255.71:3003/demo/dynamicmap',
          minZoom: 7,
          maxZoom: 20,
          minLongitude: 100,
          minLatitude: 20,
          maxLongitude: 130,
          maxLatitude: 45,
          blockSize: 1,
          marker: {
            type: 'aaa',
          },
        }
      ],
    };
  }

  renderTest() {
    return (
      <View style={styles.container}>
        <LABDynamicMapView
          showsUserLocation={true}
          locateInitialRegion={true}
          showsLocateButton={true}
          onAnnotationPress={(annotation) => {
            console.log('onAnnotationPress annotation:', annotation);
          }}
          layers={this.state.layers}
          style={{flex: 1,}}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
