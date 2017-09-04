'use strict';

import React, { 
  Component,
  PropTypes,
} from 'react';
import ReactNative, {
  
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ListView
} from 'react-native';

import {
  Page,
} from 'lab4';

import SimplePage from 'lab4/demo/SimplePage';
import TestHelper from 'lab4/demo/TestHelper';
import CardItem from 'lab4/basiccomps/CardItem';

const data = [
  [
    {
      title: '哈哈哈1',
      time: '3-17 15:20',
      image: 'http://7xnm24.com1.z0.glb.clouddn.com/1457684164593?imageMogr2/thumbnail/200x200!',
      avatar: 'http://7xnm24.com1.z0.glb.clouddn.com/1457684164593?imageMogr2/thumbnail/200x200!',
      nickname: 'jdnvm',
      location: '杭州市 西湖区',
      price: '免费',
    },
    {
      title: '哈哈哈2',
      time: '3-17 15:20',
      image: 'http://7xnm24.com1.z0.glb.clouddn.com/1457684164593?imageMogr2/thumbnail/200x200!',
      avatar: 'http://7xnm24.com1.z0.glb.clouddn.com/1457684164593?imageMogr2/thumbnail/200x200!',
      nickname: 'jdnvm',
      location: '杭州市 西湖区',
      price: '免费',
    },
  ],
  [
    {
      title: '哈哈哈3',
      time: '3-17 15:20',
      image: 'http://7xnm24.com1.z0.glb.clouddn.com/1457684164593?imageMogr2/thumbnail/200x200!',
      avatar: 'http://7xnm24.com1.z0.glb.clouddn.com/1457684164593?imageMogr2/thumbnail/200x200!',
      nickname: 'jdnvm',
      location: '杭州市 西湖区',
      price: '免费',
    },
    {
      title: '哈哈哈4',
      time: '3-17 15:20',
      image: 'http://7xnm24.com1.z0.glb.clouddn.com/1457684164593?imageMogr2/thumbnail/200x200!',
      avatar: 'http://7xnm24.com1.z0.glb.clouddn.com/1457684164593?imageMogr2/thumbnail/200x200!',
      nickname: 'jdnvm',
      location: '杭州市 西湖区',
      price: '免费',
    },
  ],
];
export default class CardItemDemo extends SimplePage {

  constructor(props, context) {
    super(props, context);
    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => {return r1 !== r2}});
    this.state = {
      dataSource: ds.cloneWithRows(data),
    };
  }

  test1() {
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

  _renderRow(data) {
    return (
      <CardItem itemData={data}
        borderRadius={5}/>
    );
  }

  renderContent() {
    return (
      <ListView dataSource={this.state.dataSource}
      renderRow={this._renderRow}
      style={{backgroundColor: '#EFEFEF', padding: 5}}/>
    );
  }
}

const styles = StyleSheet.create({

});
