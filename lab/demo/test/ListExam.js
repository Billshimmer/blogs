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
  ListView,
  TouchableOpacity,
} from 'react-native';

import {
  Page,
} from 'lab4';

import SimplePage from 'lab4/demo/SimplePage';
import TestHelper from 'lab4/demo/TestHelper';

export default class ListExam extends SimplePage {

  constructor(props, context) {
    super(props, context);
    var ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => {
        console.log('rowHasChanged r1:', r1, ' r2:', r2);
        return r1 !== r2;
      }
    });
    var data = [];
    for(var i = 0; i < 50; ++i) {
      data.push({
        text: i,
        count: 0,
      });
    }
    this.state = {
      data,
      dataSource: ds.cloneWithRows(data),
    };
  }

  _renderRow(rowData, sectionID, rowID) {
    return (
      <View>
        <Text>{rowData.text + ' ' + rowData.count}</Text>
        <TouchableOpacity>
          <Text onPress={() => {
            this.state.data = this.state.data.slice();
            this.state.data[rowID] = Object.assign({}, this.state.data[rowID]);
            this.state.data[rowID].count++;
            this.setState({
              dataSource: this.state.dataSource.cloneWithRows(this.state.data)
            });
            //this.forceUpdate();
          }}>inc</Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderContent() {
    return (
      <ListView
      style={{flex: 1}}
        dataSource={this.state.dataSource}
        renderRow={this._renderRow.bind(this)} />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});
