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
  Image,
} from 'react-native';

import LAB, {
  Page,
  Link,
} from 'lab4';

import SimplePage from 'lab4/demo/SimplePage';
import TestHelper from 'lab4/demo/TestHelper';

import RatioView from 'lab4/basiccomps/RatioView';

const TEST_RATIOS = [
  1,
  2,
  0.5,
  -1,
  0,
  null,
];

const TEST_RATIOS_TEXT = [
  '1:1',
  '2:1',
  '1:2',
  '-1',
  '0',
  'null',
];

export default class RatioViewDemo extends SimplePage {

  constructor(props, context) {
    super(props, context);
    this.state = {
      whRatio: 1,
      whRatioText: '1:1',
    };
    this.configPage({
      scrollable: true, //页面可滚动
    });
  }

  _renderRatioView(ratio, text) {
    return (
      <RatioView
        whRatio={ratio}
        style={styles.ratioView}>
        <View style={styles.ratioInner}>
          <Text style={styles.text}>{text}</Text>
        </View>
      </RatioView>
    );
  }

  renderContent() {
    return (
      <View style={styles.container}>
        {this.renderTestBtns()}
        <TouchableOpacity onPress={() => {
          let i = (Math.random() * TEST_RATIOS.length) << 0;
          this.setState({
            whRatio: TEST_RATIOS[i],
            whRatioText: TEST_RATIOS_TEXT[i],
          });
        }}>{this._renderRatioView(this.state.whRatio, this.state.whRatioText)}</TouchableOpacity>
        {this._renderRatioView(2, '2:1')}
        {this._renderRatioView(16 / 9, '16:9')}
        <Text>Image whRatio</Text>
        <RatioView whRatio={1200 / 630}>
          <Image source={{uri: 'https://facebook.github.io/react/img/logo_og.png'}}/>
        </RatioView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingLeft: 120,
    paddingRight: 120,
  },
  ratioView: {
    backgroundColor: '#2196f3',
    marginTop: 10,
    marginBottom: 10,
  },
  ratioInner: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 30,
    color: '#FFF',
  },
});
