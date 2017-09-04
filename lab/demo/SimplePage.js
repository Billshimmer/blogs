'use strict';

import React, {
  Component,
  PropTypes,
} from 'react';
import ReactNative, {

  StyleSheet,
  View,
} from 'react-native';

import LAB, {
  Page,
  requireComp,
} from 'lab4';

const HeaderBar = requireComp('com.HeaderBar');

import TestHelper from './TestHelper';

export default class SimplePage extends Page {

  renderHeader() {
    return (
      <HeaderBar
        title={this.constructor.title || this.constructor.name}
        left={{icon: 'arrow-back'}}
        onLeftPress={() => this.router.pop()}
      />
    );
  }

  renderContent() {
    return (
      <View style={styles.container}>
        {this.renderTestBtns()}
        {this.renderTest && this.renderTest()}
      </View>
    );
  }
}

TestHelper.assignHelpers(SimplePage.prototype);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
