'use strict';

import React, {
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

export default class ComPage extends Page {

  constructor(props, context) {
    super(props, context);
  }

  renderContent() {
    return (
      <View></View>
    );
  }
}

const styles = StyleSheet.create({

});
