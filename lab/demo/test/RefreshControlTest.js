'use strict'

import React, {
  Component,
  PropTypes,
} from 'react';

import ReactNative, {
  
  StyleSheet,
  View,
  Text
} from 'react-native';

import {
  Page,
  Link,
} from 'lab4';

import SimplePage from 'lab4/demo/SimplePage';
import TestHelper from 'lab4/demo/TestHelper';
import RefreshControl from 'lab4/basiccomps/RefreshControl/RefreshControl';
import ScrollView from 'lab4/basiccomps/ScrollView/ScrollView';

export default class RefreshControlTest extends SimplePage {
    constructor(props, context) {
        super(props)

        this.state = {
          isRefreshing: false,
          refreshable: true,
          refreshEnabled: true,
        };
    }

    renderContent() {
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
            style={{backgroundColor: "#00000000"}}/>
        );
      }
      return (
        <ScrollView
        style = {styles.scrollView}
        refreshControl = {refreshControl}>
          <Text style = {styles.text}>This a content make ths scrollView content is not null</Text>
        </ScrollView>
      )
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
      }, 1000);
    }
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor:'#6a85b1',
  },
  text: {
    alignItems:"center",
    justifyContent:"center",
  }
});
