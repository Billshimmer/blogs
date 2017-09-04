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

import ScanView from './views/ScanView';

export default class ScanViewDemo extends SimplePage {

  constructor(props, context) {
    super(props, context);
    this._onScanResult = this._onScanResult.bind(this);
  }

  _onScanResult(e) {
    console.log('bbb');
    this.props.onScanResult(e.nativeEvent);
  }

  renderContent() {
    return (
      <View style={styles.container} >
        <ScanView
          ref={(ref) => {
            ///console.log('LABTestView ref=', ref, ' findNodeHandle=', ReactNative.findNodeHandle(ref));
          }}
          options={{
            'type': 'qrcode',
            'isSupportPhoto': false,
          }}
          style={{flex:1,}}
          onScanResult={this._onScanResult}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
  },
});
