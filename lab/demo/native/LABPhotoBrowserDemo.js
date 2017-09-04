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

import PhotoBrowser from './views/PhotoBrowser';

export default class LABPhotoBrowserDemo extends SimplePage {

  constructor(props, context) {
    super(props, context);
    this._onPhotoTap = this._onPhotoTap.bind(this);
  }

  _onPhotoTap(e) {
    console.log('bbb');
    this.props.onPhotoTap(e.nativeEvent);
  }

  renderContent() {
    return (
      <View style={styles.container} >
        <PhotoBrowser
          ref={(ref) => {
            ///console.log('LABTestView ref=', ref, ' findNodeHandle=', ReactNative.findNodeHandle(ref));
          }}
          options={{
            "photos": [
              "http://img3.178.com/overwatch/201605/257559458232/257561899350.jpg",
              "http://img.pipaw.net/wy/editor/news/2016/05/31/c34d395aa95d94cc60a7a11afb7be7a9.jpg",
              "http://www.danji100.com/uploads/image/160530/133233N36-0.jpg",
              "http://i3.17173cdn.com/2fhnvk/YWxqaGBf/cms3/oXukQUbksoyFjuE.jpg",
              "http://i3.17173cdn.com/2fhnvk/YWxqaGBf/cms3/aoFKBabksoyFjsa.jpg",
            ],
            "currentIndex": 0,
          }}
          onPhotoTap={this._onPhotoTap}
          style={{flex:1,}}
          />
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
