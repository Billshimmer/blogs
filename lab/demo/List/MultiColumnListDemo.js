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

let TEST_URL = TEST_BASE_URL + 'demo/listview1';
let DEFAULT_NEXT_URL = TEST_URL + '?index=21';

const COLUMN_COUNT = 2;

/**
 * 自定义Adapter 实现每COLUMN_COUNT个数据合并为一行
 */
class MyAdapter extends List.BaseAdapter {

  constructor(options) {
    super(options);
    this._data = [];
  }

  createDataSource() {
    return new ListView.DataSource({
      rowHasChanged: (r1, r2) => {
        if (r1 === r2) {
          return false;
        }
        if (r1.length !== r2.length) {
          return true;
        }
        for (let i = 0; i < r1.length; ++i) {
          if (r1[i] !== r2[i]) {
            return true;
          }
        }
        return false;
      },
    });
  }

  updateData(newData) {
    this._data = newData || [];
    this.dataSource = this.dataSource.cloneWithRows(this._combineArray(this._data));
  }

  _combineArray(arr) {
    let result = [];
    for (let i = 0; i < arr.length; i += COLUMN_COUNT) {
      let item = [];
      let j = 0
      for (; j < COLUMN_COUNT && i + j < arr.length; ++j) {
        item.push(arr[i + j]);
      }
      result.push(item);
    }
    return result;
  }

  getData() {
    return this._data;
  }
}

export default class MultiColumnListDemo extends BaseListDemo {

  constructor() {
    super();

    this.state = {
      data: this._generateTestData1(),
      adapter: new MyAdapter(),
    };

    this._renderRow = this._renderRow.bind(this);
  }

  _renderRow(rowData, sectionID, rowID, onRowHighlighted) {
    return (
      <View style={{flexDirection: 'row',}}>
        {rowData.map((item, index) => {
          return (
            <View key={index} style={{width: 200, height: 200, justifyContent: 'center',}}>
              <Text>{item.text}</Text>
            </View>
          );
        })}
      </View>
    );
  }

  render() {
    return (
      <List
        adapter={this.state.adapter}
        url={TEST_URL}
        defaultItems={this.state.data}
        defaultNextUrl={DEFAULT_NEXT_URL}
        renderRow={this._renderRow}
        renderSeparator={this._renderSimpleSeparator}
        renderEmpty={this._renderSimpleEmptyView}
        renderHeader={this._renderSimpleHeader}
        renderFooter={this._renderSimpleFooter}
        renderLoadMoreFooter={this._renderSimpleLoadMoreFooter}
        refreshControlProps={Constants.refreshControlProps}
        />
    );
  }
}
