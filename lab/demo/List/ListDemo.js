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
  Page,
  requireComp,
} from 'lab4';

import SimplePage from 'lab4/demo/SimplePage';
import TestHelper from 'lab4/demo/TestHelper';

const ViewPager = requireComp('com.ViewPager');
const TabBar = requireComp('com.TabBar');

import SimpleTab from 'lab4/basiccomps/TabBar/SimpleTab';
import SimpleListDemo from './SimpleListDemo';
import ComplexListDemo from './ComplexListDemo';
import ControlledListDemo from './ControlledListDemo';
import MultiColumnListDemo from './MultiColumnListDemo';
import ComplexMultiColumnListDemo from './ComplexMultiColumnListDemo';

/**
 * NOTE 需要启动服务器 npm run demoserver
 */
export default class ListViewDemo extends SimplePage {

  constructor(props, context) {
    super(props, context);
  }

  _renderList1() {
    // url 返回的数据为平台数据
    return (
      <List
        ref="list"
        url={this.state.url} />
    );
  }

  _renderList2() {
    return (
      <List
        ref="list"
        url={this.state.url}
        renderRow={this._renderSimpleRow}/>
    );
  }

  _renderList3() {
    // Uncontrolled 模式下的所有属性
    return (
      <List
        ref="list"
        url={this.state.url}
        defaultItems={this.state.defaultItems}
        defaultNextUrl={this.state.defaultNextUrl}

        renderHeader={this._renderSimpleHeader}
        renderFooter={this._renderSimpleFooter}
        renderEmptyView={this._renderSimpleEmptyView}
        renderLoadMoreFooter={this._renderSimpleLoadMoreFooter}
        renderSeparator={this._renderSimpleSeparator}
        renderSectionHeader={this._renderSimpleSectionHeader}
        renderRow={this._renderSimpleRow}

        autoLoad={true}
        refreshControlProps={{}}
        refreshable={true}
        enableLoadMore={true}
        showEmptyView={true}/>
    );
  }

  _renderList4() {
    // 与Page绑定
    return (
      <List
        ref="list"
        bindPageRefresh={true}/>
    );
  }

  _renderList5() {
    // controlled 模式下的所有属性
    return (
      <List
        ref="list"

        url={this.state.url}
        dataSource={this.state.dataSource}
        nextUrl={this.state.nextUrl}

        //onRefresh={} //如果重写这两个 则跟默认的ListView一样 需要自己写网络请求
        //onEndReached={}
        onLoadComplete={() => {

        }}

        renderHeader={this._renderSimpleHeader}
        renderFooter={this._renderSimpleFooter}
        renderEmptyView={this._renderSimpleEmptyView}
        renderLoadMoreFooter={this._renderSimpleLoadMoreFooter}
        renderSeparator={this._renderSimpleSeparator}
        renderSectionHeader={this._renderSimpleSectionHeader}
        renderRow={this._renderSimpleRow}

        autoLoad={true}
        refreshControlProps={{}}
        refreshable={true}
        enableLoadMore={true}
        showEmptyView={true}
        />
    );
  }

  renderContent() {
    return (
      <View style={{flex: 1}}>
        <ViewPager
          ref="view_pager"
          renderTabBar={() => {
            return (
              <TabBar
                renderTab={(tab, i, isActive) => {
                  return <SimpleTab text={tab} activeColor="#F1F1F1" activeBackgroundColor="rgba(0, 0, 0, 0.2)"/>;
                }}
                onChangeTab={(i, tab) => {
                  //console.log('tabBar onChangeTab i:', i);
                }}
                defaultActiveTab={null}
                linePosition="none"
                lineColor="#719ABB"
                style={{height: 40}}
               />
            );
          }}
          onChangeTab={(i, tab) => {
            //console.log('ViewPager onChangeTab i:', i);
          }}>
          <SimpleListDemo tabLabel="Simple" />
          <ComplexListDemo tabLabel="Complex" />
          <ControlledListDemo tabLabel="Controlled" />
          <MultiColumnListDemo tabLabel="MultiColumn" />
          <ComplexMultiColumnListDemo tabLabel="ComplexMultiColumnList"/>
        </ViewPager>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
