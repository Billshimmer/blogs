'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, { StyleSheet, View, Text } from 'react-native';
import LAB, { Page } from 'lab4';
import SearchBar from 'lab4/basiccomps/Search/SearchBar';

export default class SearchTestPage extends Page {
  name = 'com.SearchTestPage';

  // static propTypes = {};

  // static defaultProps = {};

  constructor(props, context) {
    super(props, context);
    this.autoLoad = !props.hasData;
  }

  onLoadResponse(response) {
    if (__DEV__ && !this.props.pageContainer) {
      throw new Error('!this.props.pageContainer');
    }
    this.props.pageContainer.changeData(response);
  }

  renderHeader() {
    return <SearchBar style={{ height: 50 }} />;
  }

  renderContent() {
    return LAB.render(this.props.content, {
      style: {
        flex: 1,
        marginBottom: 20,
        backgroundColor: '#CFF5D6',
      },
    });
  }
}

const styles = StyleSheet.create({
  header: {},
  content: {
    flex: 1,
  },
  footer: {},
});
