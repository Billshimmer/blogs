'use strict';

import React, {
  Component,
  PropTypes,
} from 'react';
import ReactNative, {
  
  StyleSheet,
  Platform,
  View,
  Text,
  ScrollView,
  Image,
  PixelRatio,
} from 'react-native';

import {
  Page,
  requireComp,
} from 'lab4';

import SimplePage from 'lab4/demo/SimplePage';
import TestHelper from 'lab4/demo/TestHelper';

const FindPassword = requireComp('com.FindPassword');

export default class FindPasswordDemo extends SimplePage {

  constructor(props, context) {
    super(props, context);
    this.state = {
      disabled:true,
    };
  }

  test1() {
  }

  test2() {
  }

  renderContent() {
    return(
      <FindPassword codeUrl='#' submitUrl='#'/>
    )
  }
}

const styles = StyleSheet.create({

});
