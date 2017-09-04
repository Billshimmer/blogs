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
  Image,
} from 'react-native';

import LAB, { Page, requireComp } from 'lab4';

import SimplePage from 'lab4/demo/SimplePage';
import TestHelper from 'lab4/demo/TestHelper';

const MultiSelectList = requireComp('sub.MultiSelectList');

const data = {
  A: { 安徽: [1, 2, 3], 安吉: [2, 2, 2], 安庆: [] },
  B: { 北京: [1, 1, 2], 保定: [] },
  C: { 重庆: [7, 8, 9], 长沙: [4, 5, 6], 成都: [] },
  D: [], //如果为空，请务必以空字符串结尾
};

export default class MultiSelectListDemo extends SimplePage {

  constructor(props, context) {
    super(props, context);
    this.state = {};
  }

  renderContent() {
    let temp;
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            this.onPress();
          }}
          style={{ height: 20, width: 100, backgroundColor: 'red' }}
        />
      </View>
    );
  }
  onSelect(value) {
    console.log(value);
    this.context.popup.hide();
  }
  onCancel() {
    this.context.popup.hide();
  }
  onPress() {
    this.context.popup.addView({
      component: (
        <View style={this.getStyle('popView')}>
          <MultiSelectList
            //data={data}
            onSelect={this.onSelect.bind(this)}
            onCancel={this.onCancel.bind(this)}
          />
        </View>
      ),
      // onMaskPress:()=>{this.context.popup.hide()}
    });
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
    backgroundColor: 'white',
  },
  popView: {
    height: 600,
    width: 400,
    backgroundColor: 'black',
  },
  image: {
    height: 28,
    width: 28,
  },
});
