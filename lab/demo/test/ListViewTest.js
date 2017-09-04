'use strict';

import React, {
  Component,
  PropTypes,
} from 'react';
import ReactNative, {
  
  StyleSheet,
  View,
  Text,
  ListView,
  RefreshControl,
  ScrollView
} from 'react-native';

import {
  Page,
  Link,
} from 'lab4';

import SimplePage from 'lab4/demo/SimplePage';
import TestHelper from 'lab4/demo/TestHelper';

var TEST_DATA1 = [];

for(let i = 0; i < 50; ++i) {
  TEST_DATA1.push('item' + i);
}

var TEST_DATA2 = {};

for(let i = 0; i < 5; ++i) {
  var arr = TEST_DATA2['section' + i] = [];
  for(let j = 0; j < 10; ++j) {
    arr.push('item' + j);
  }
}

//console.log(TEST_DATA2);

var DEFAULT_PAGE_SIZE = 1;
var DEFAULT_INITIAL_ROWS = 10;
var DEFAULT_SCROLL_RENDER_AHEAD = 1000;
var DEFAULT_END_REACHED_THRESHOLD = 1000;
var DEFAULT_SCROLL_CALLBACK_THROTTLE = 50;

// android ListView onEndReached的触发必须当前数据超过一屏比较多才行

export default class ListViewTest extends SimplePage {

  constructor(props, context) {
    super(props, context);

    var ds = new ListView.DataSource({
      sectionHeaderHasChanged: (h1, h2) => h1 !== h2,
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    this.state = {
      dataSource: ds.cloneWithRows(TEST_DATA1),//ds.cloneWithRowsAndSections(TEST_DATA2),//
      isRefreshing: false,
      refreshable: true,
      refreshEnabled: true,
      showHeader: true,
    };
    this._renderHeader = this._renderHeader.bind(this);
    this._renderSectionHeader = this._renderSectionHeader.bind(this);
    this._renderRow = this._renderRow.bind(this);
    this._onChangeVisibleRows = this._onChangeVisibleRows.bind(this);
    this._onEndReached = this._onEndReached.bind(this);
    this._onRefresh = this._onRefresh.bind(this);
    this._onScroll = this._onScroll.bind(this);

    // this.configPage({
    //   scrollable: true,
    // });
  }

  testRefresh() {
    this.setState({
      isRefreshing: true
    });
    setTimeout(() => {
      this.setState({
        isRefreshing: false
      });
    }, 1000);
  }

  testToggleIsRefreshing() {
    this.setState({
      isRefreshing: !this.state.isRefreshing,
    });
  }

  testToggleRefreshable() {
    this.setState({
      refreshable: !this.state.refreshable
    });
  }

  testRefreshEnabled() {
    this.setState({
      refreshEnabled: !this.state.refreshEnabled,
    });
  }

  testUpdateDataSource() {
    let data = [];
    for (let i = 0; i < 60; ++i) {
      data.push('item' + i + ' ' + Math.random());
    }
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(data),
    });
  }

  testToggleShowHeader() {
    this.setState({
      showHeader: !this.state.showHeader,
    });
  }

  renderTest() {
    let refreshControl;
    if(this.state.refreshable) {
      refreshControl = (
        <RefreshControl
          refreshing={this.state.isRefreshing}
          onRefresh={this._onRefresh}
          tintColor="#ff0000"
          title="Loading..."
          colors={['#ff0000', '#00ff00', '#0000ff']}
          progressBackgroundColor="#ffff00"
          enabled={this.state.refreshEnabled}
          size={RefreshControl.SIZE.DEFAULT}
          // ios BUG refreshControl初始状态时就显示且位置错误 需设置背景为透明
          style={{backgroundColor: '#C81F82', zIndex: 100, }}/>
      );
    }

    return (
        <ListView
          style={[styles.listView, {flex: 1, backgroundColor: '#94C19D',}]}
          contentContainerStyle={{flex: 1,}}
          dataSource={this.state.dataSource}
          renderRow={this._renderRow}
          renderSectionHeader={this._renderSectionHeader}
          onChangeVisibleRows={this._onChangeVisibleRows}
          onEndReached={this._onEndReached}
          removeClippedSubviews={true}
          renderHeader={this._renderHeader}
          renderFooter={this._renderFooter}
          renderSeparator={this._renderSeparator}
          renderScrollComponent={props => <ScrollView {...props}/>}
          pageSize={DEFAULT_PAGE_SIZE}
          initialListSize={DEFAULT_INITIAL_ROWS + 20}
          onEndReachedThreshold={DEFAULT_END_REACHED_THRESHOLD}
          scrollRenderAheadDistance={DEFAULT_SCROLL_RENDER_AHEAD}
          scrollEventThrottle={DEFAULT_SCROLL_CALLBACK_THROTTLE}
          refreshControl={refreshControl}
          onScroll={this._onScroll}
        />
    );
  }

  _renderHeader() {
    let topBg = (
      <View key="top_bg" style={{height: 60, position: 'absolute', left: 0, top: -30, right: 0, backgroundColor: '#6B8DDD',}}></View>
    );
    let header;
    if (this.state.showHeader) {
      header = (
        <View key="header" style={{height: 50, justifyContent: 'center', alignItems: 'center', backgroundColor: '#D9F069',}}>
          <Text>Header</Text>
        </View>
      );
    }
    header;
  }

  _renderFooter() {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#CD6A1A',}}>
        <Text>Footer</Text>
      </View>
    );
  }

  _renderSectionHeader(data, section) {
    //this.log('renderSectionHeader', data, section);
    return (
      <View style={{height: 30, justifyContent: 'center', alignItems: 'center',}}>
        <Text>Section:{section}</Text>
      </View>
    );
  }

  _renderRow(rowData, sectionID, rowID) {
    //测试renderRow TODO
    console.log('renderRow sectionID:', sectionID, ' rowID:', rowID);
    return (
      <View style={{height: 30, justifyContent: 'center', alignItems: 'center'}}>
        <Text>rowData:{rowData}  rowID:{rowID}</Text>
      </View>
    );
  }

  _renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
    return (
      <View key={sectionID + '_' + rowID} style={{height: 1, backgroundColor: '#ddd'}}></View>
    );
  }

  _onChangeVisibleRows(visibleRows, changedRows) {
    //this.log('onChangeVisibleRows', visibleRows, changedRows);
  }

  _onEndReached() {
    this.log('onEndReached');
  }

  _onRefresh() {
    this.log('onRefresh');
    this.setState({
      isRefreshing: true
    });
    setTimeout(() => {
      this.log('onRefresh timeout');
      this.setState({
        isRefreshing: false
      });
    }, 50000);
  }

  _onScroll(e) {
    this.log('onScroll', e.nativeEvent);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listView: {
    height: 350,
    flex: null, //ScrollView有默认 flex: 1的样式，如需定高 需覆盖原来样式
    backgroundColor: '#CAD9D4',
  },
});
