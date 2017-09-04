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
} from 'react-native';
import LAB, {
  requireComp,
} from 'lab4';

import TestHelper from '../TestHelper';

const LoadMoreListFooter = requireComp('com.LoadMoreListFooter');

export default class BaseListDemo extends Component {

  constructor() {
    super();

    this._renderSimpleHeader = this._renderSimpleHeader.bind(this);
    this._renderSimpleFooter = this._renderSimpleFooter.bind(this);
    this._renderSimpleLoadMoreFooter = this._renderSimpleLoadMoreFooter.bind(this);
    this._renderSimpleSeparator = this._renderSimpleSeparator.bind(this);
    this._renderSimpleEmptyView = this._renderSimpleEmptyView.bind(this);
    this._renderSimpleSectionHeader = this._renderSimpleSectionHeader.bind(this);
    this._renderSimpleSectionHeader = this._renderSimpleSectionHeader.bind(this);
    this._renderSimpleRow = this._renderSimpleRow.bind(this);
  }

  _generateTestData1(index = 0) {
    let arr = [];
    for(let i = 0; i < 15; ++i) {
      arr.push({
        text: `${(i + index)}`,
        ui_type: 'test.SimpleListItem',
      });
    }
    return arr;
  }

  _renderSimpleHeader() {
    return (
      <Text style={{padding: 30, fontSize: 20}}>Header</Text>
    );
  }

  _renderSimpleFooter() {
    return (
      <Text style={{padding: 30, fontSize: 20}}>Footer</Text>
    );
  }

  _renderSimpleLoadMoreFooter(loadingType) {
    return (
      <LoadMoreListFooter
        noMoreText={'没有了xxx'}
        loadingType={loadingType}/>
    );
  }

  _renderSimpleSeparator(sectionID, rowID, adjacentRowHighlighted) {
    return (
      <View
        key={`${sectionID}-s${rowID}`}
        style={{backgroundColor: Theme.dividerColor, height: 1,}}/>
    );
  }

  _renderSimpleEmptyView() {
    return (
      <View style={{justifyContent: 'center', alignItems: 'center', padding: 20, flex: 1,}}>
        <Text style={{margin: 30, fontSize: 20}}>EMPTY!</Text>
      </View>
    );
  }

  _renderSimpleSectionHeader(sectionData, sectionID) {
    return (
      <View style={{height: 30, justifyContent: 'center', alignItems: 'center'}}>
        <Text>{sectionID}</Text>
      </View>
    );
  }

  _renderSimpleRow(rowData, sectionID, rowID, highlightRow) {
    return (
      <Text style={{padding: 20, fontSize: 18}}>rowID: {rowID} text: {rowData.text}</Text>
    );
  }
}

TestHelper.assignHelpers(BaseListDemo.prototype);
