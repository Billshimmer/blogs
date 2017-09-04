'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, { StyleSheet, View, Text, ScrollView } from 'react-native';

import { Page, Link, requireComp } from 'lab4';

import SimplePage from 'lab4/demo/SimplePage';
import TestHelper from 'lab4/demo/TestHelper';

const SearchBar = requireComp('com.SearchBar');
const SearchSuggestion = requireComp('com.SearchSuggestion');

export default class SearchDemo extends SimplePage {
  constructor(props, context) {
    super(props, context);
  }

  test1() {}

  test2() {}

  renderContent() {
    return (
      <View>
        <SearchBar type={1} style={{ margin: 10 }} />
        <SearchSuggestion maxLength={4} url="" />
      </View>
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
