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
  RefreshControl,
  ListView,
} from 'react-native';
import LAB, {
  requireComp,
} from 'lab4';
import BaseListDemo from './BaseListDemo';
import Constants from './Constants';

const List = requireComp('com.List');

// const TEST_BASE_URL = 'http://172.18.255.74:3003/'
let TEST_URL = TEST_BASE_URL + 'demo/listview1';
let DEFAULT_NEXT_URL = TEST_URL + '?index=21';

export default class SimpleListDemo extends BaseListDemo {

  constructor() {
    super();

    this.state = {
      data: Math.random() > 0.5 ? this._generateTestData1() : null,
      url: TEST_URL + '?r=',
      refreshable: true,
    };
  }

  testRefresh() {
    this.refs.list.refresh();
  }

  testUpdateData() {
    //更新原数据的第一条
    let adapter = this.refs.list.adapter;
    let newData = adapter.getData().slice();
    newData[0] = {
      text: 'xxxxxxxxxxxxx',
      ui_type: 'test.SimpleListItem',
    };
    this.refs.list.updateData(newData);
  }

  testUpdateData1() {
    //同时更新数据与nextUrl
    this.refs.list.updateData(this._generateTestData1(), DEFAULT_NEXT_URL);
  }

  testChangeUrl() {
    this.setState({
      url: this.state.url + '1',
    });
  }

  testToggleRefreshable() {
    this.setState({
      refreshable: !this.state.refreshable,
    });
  }

  render() {
    return (
      <View style={{flex: 1,}}>
        {this.renderTestBtns()}
        <List
          ref="list"
          url={this.state.url}
          refreshable={this.state.refreshable}
          topBounceBgStyle={{
            backgroundColor: '#4FB47E',
          }}
          defaultItems={this.state.data}
          defaultNextUrl={DEFAULT_NEXT_URL}
          renderRow={this._renderSimpleRow}
          renderSeparator={this._renderSimpleSeparator}
          renderEmpty={this._renderSimpleEmptyView}
          //emptyText="EMPTY!"
          renderHeader={this._renderSimpleHeader}
          renderFooter={this._renderSimpleFooter}
          renderLoadMoreFooter={this._renderSimpleLoadMoreFooter}
          //refreshControlProps={Constants.refreshControlProps}
          emptyFillContent={true}
          />
      </View>
    );
  }
}
