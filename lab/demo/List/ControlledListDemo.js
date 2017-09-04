'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, {
  StyleSheet,
  View,
  Text,
  ScrollView,
  RefreshControl,
  ListView,
} from 'react-native';
import LAB, {
  requireComp,
} from 'lab4';
import BaseListDemo from './BaseListDemo';
const List = requireComp('com.List');

let TEST_URL = TEST_BASE_URL + 'demo/listview1';
let DEFAULT_NEXT_URL = TEST_URL + '?index=21';

export default class ControlledListDemo extends BaseListDemo {
  constructor() {
    super();

    let data = this._generateTestData1();
    let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      data,
      dataSource: ds.cloneWithRows(data),
    };

    this._onRefreshComplete = this._onRefreshComplete.bind(this);
    this._onLoadMoreComplete = this._onLoadMoreComplete.bind(this);
  }

  _onRefreshComplete(res) {
    if (res.error) {
      console.log('_onRefreshComplete error:', res.error);
    } else {
      let newData = res.data.items || [];
      this.setState({
        data: newData,
        dataSource: this.state.dataSource.cloneWithRows(newData),
      });
    }
  }

  _onLoadMoreComplete(res) {
    if (res.error) {
      console.log('_onLoadMoreComplete error:', res.error);
    } else if (res.data.items && res.data.items.length) {
      let newData = this.state.data.concat(res.data.items);
      this.setState({
        data: newData,
        dataSource: this.state.dataSource.cloneWithRows(newData),
      });
    }
  }

  render() {
    return (
      <List
        url={TEST_URL}
        dataSource={this.state.dataSource}
        defaultNextUrl={DEFAULT_NEXT_URL}
        renderRow={this._renderSimpleRow}
        renderSeparator={this._renderSimpleSeparator}
        renderEmpty={this._renderSimpleEmptyView}
        renderHeader={this._renderSimpleHeader}
        renderFooter={this._renderSimpleFooter}
        renderLoadMoreFooter={this._renderSimpleLoadMoreFooter}
        onRefreshComplete={this._onRefreshComplete}
        onLoadMoreComplete={this._onLoadMoreComplete}
      />
    );
  }
}
