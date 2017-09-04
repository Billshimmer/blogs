import React, { Component, PropTypes } from 'react';
import ReactNative, {
  StyleSheet,
  View,
  Text,
  ScrollView,
  ListView,
  RefreshControl,
  StatusBar,
  TouchableOpacity,
} from 'react-native';

import { Page, requireComp } from 'lab4';

import SimplePage from 'lab4/demo/SimplePage';
import TestHelper from 'lab4/demo/TestHelper';

const CitySelect = requireComp('com.CitySelect');

var data = {
  A: [
    { name: '安徽', id: 'AH' },
    { name: '安吉', id: 'AJ' },
    { name: '安庆', id: 'AQ' },
  ],
  B: [{ name: '北京', id: 'BJ' }, { name: '保定', id: 'BD' }],
  C: [
    { name: '重庆', id: 'CQ' },
    { name: '长沙', id: 'CS' },
    { name: '成都', id: 'CD' },
  ],
  D: [{ name: '东京', id: 'DJ' }],
  G: [
    { name: '广东', id: 'GD' },
    { name: '广西', id: 'GX' },
    { name: '桂林', id: 'GL' },
  ],
  H: [{ name: '合肥', id: 'HF' }],
  I: [{ name: 'NULL', id: 'II' }],
  J: [{ name: 'NULL', id: 'JJ' }],
  K: [{ name: 'NULL', id: 'KK' }],
};

var data2 = {
  A: [
    { name: '安徽', id: 'AH' },
    { name: '安吉', id: 'AJ' },
    { name: '安庆', id: 'AQ' },
  ],
  B: [{ name: '北京', id: 'BJ' }, { name: '保定', id: 'BD' }],
  C: [
    { name: '重庆', id: 'CQ' },
    { name: '长沙', id: 'CS' },
    { name: '成都', id: 'CD' },
  ],
  D: [{ name: '东京', id: 'DJ' }],
  E: [{ name: 'NULL', id: 'EE' }],
  F: [{ name: 'NULL', id: 'FF' }],
  G: [
    { name: '广东', id: 'GD' },
    { name: '广西', id: 'GX' },
    { name: '桂林', id: 'GL' },
  ],
  H: [{ name: '合肥', id: 'HF' }],
  I: [{ name: 'NULL', id: 'II' }],
  J: [{ name: 'NULL', id: 'JJ' }],
  K: [{ name: 'NULL', id: 'KK' }],
  L: [{ name: 'NULL', id: 'LL' }],
  N: [{ name: 'NULL', id: 'NN' }],
  M: [{ name: 'NULL', id: 'MM' }],
  O: [{ name: 'NULL', id: 'OO' }],
  P: [{ name: 'NULL', id: 'PP' }],
  Q: [{ name: 'NULL', id: 'QQ' }],
  R: [{ name: 'NULL', id: 'RR' }],
  S: [{ name: 'NULL', id: 'SS' }],
  T: [{ name: 'NULL', id: 'TT' }],
  U: [{ name: 'NULL', id: 'UU' }],
  V: [{ name: 'NULL', id: 'VV' }],
  W: [{ name: 'NULL', id: 'WW' }],
  X: [{ name: 'NULL', id: 'XX' }],
  Y: [{ name: 'NULL', id: 'YY' }],
  Z: [{ name: 'NULL', id: 'ZZ' }],
};

export default class Test extends SimplePage {
  constructor(props, context) {
    super(props, context);
    this.state = {
      select: null,
      show: false,
    };
  }
  onSelect(rowData) {
    this.setState({ select: rowData, show: false });
  }
  onPress() {
    this.setState({ show: true });
  }
  renderContent() {
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <Text>
          {this.state.select &&
            this.state.select.name +
              ' ' +
              this.state.select.id +
              ' ' +
              this.state.show}
        </Text>

        <View style={{ flex: 1 }}>
          <CitySelect
            data={data2}
            onSelect={this.onSelect.bind(this)}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listView: {},
});
