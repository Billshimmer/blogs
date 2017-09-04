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

/**
 * 自定义Adapter 实现二维数据的加载更多
 */
class MyAdapter extends List.BaseAdapter {

  fetchData(options) {
    //自定义数据获取
    //返回的数据为数组  带有sectionName的表示SectionHeader
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.9) {
          reject(new Error('error'));
          return;
        }
        let url = options.url;
        let index = Number(url);
        let data = [];
        for (let i = 0; i < 15; ++i) {
          data.push({
            text: `${(i + index)}`,
            ui_type: 'test.SimpleListItem',
            sectionName: (i + index) % 10 == 0 ? ('Section:' + (i + index) / 10) : null,
          });
        }
        resolve({
          items: data,
          nextUrl: Math.random() > 0.8 ? null : String(index + 15),
        });
      }, Math.random() * 2000);
    });
  }

  createDataSource() {
    //自定义dataSource的创建  支持二维数组
    return new ListView.DataSource({
      sectionHeaderHasChanged: (h1, h2) => h1 !== h2,
      rowHasChanged: (r1, r2) => r1 !== r2,
      getSectionHeaderData: (dataBlob, sectionID) => {return {sectionID, data: dataBlob[sectionID]}},
    });
  }

  updateData(newData) {
    // 自定义更新数据 支持二维section
    this.dataSource = this.dataSource.cloneWithRowsAndSections(newData);
  }

  updateRefreshData(data) {
    if (!data.items) {
      this.updateData({});
      return;
    }
    //将数组映射为二维
    let result = {};
    let items = data.items;
    let lastSection;
    for (let i = 0; i < items.length; ++i) {
      if (items[i].sectionName) {
        lastSection = result[items[i].sectionName] = [];
      } else if(lastSection) {
        lastSection.push(items[i]);
      }
    }
    this.updateData(result);
  }

  updateLoadMoreData(data) {
    if (!data.items) {
      return;
    }
    let result = {...this.getData()};
    let items = data.items;
    let lastSection;
    let keys = Object.keys(result);
    if (keys.length) {
      lastSection = result[keys[keys.length - 1]];
    }
    for (let i = 0; i < items.length; ++i) {
      if (items[i].sectionName) {
        lastSection = result[items[i].sectionName] = [];
      } else if(lastSection) {
        lastSection.push(items[i]);
      }
    }

    this.updateData(result);
  }

  isEmpty() {
    return !Object.keys(this.getData()).length;
  }

  getData() {
    return this.dataSource._dataBlob || {};
  }
}

export default class ComplexListDemo extends BaseListDemo {

  constructor() {
    super();

    this.state = {
      url: "0",
      data: this._generateTestData1(),
      adapter: new MyAdapter(),
    };
  }

  testChangeUrl() {
    this.setState({
      url: String(Number(this.state.url) + 15),
    });
  }

  _renderSectionHeader(sectionData, sectionID) {
    return (
      <View style={{height: 30, justifyContent: 'center', alignItems: 'center'}}>
        <Text>{sectionID}</Text>
      </View>
    );
  }

  render() {
    return (
      <View style={{flex: 1,}}>
        {this.renderTestBtns()}
        <List
          adapter={this.state.adapter}
          url={this.state.url}
          renderSectionHeader={this._renderSectionHeader}
          renderRow={this._renderSimpleRow}
          renderSeparator={this._renderSimpleSeparator}
          renderEmpty={this._renderSimpleEmptyView}
          renderHeader={this._renderSimpleHeader}
          renderFooter={this._renderSimpleFooter}
          renderLoadMoreFooter={this._renderSimpleLoadMoreFooter}
          // refreshControlProps={Constants.refreshControlProps}
          showRefreshIndicatorOnUrlChange={false}
          />
      </View>
    );
  }
}
