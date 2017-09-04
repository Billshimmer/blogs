'use strict';

import React, { 
  Component,
  PropTypes,
} from 'react';
import ReactNative, {
  Text,
} from 'react-native';
import BabelTest1 from './BabelTest1';

export default class BabelTest2 extends BabelTest1 {

  static staticMember1 = 1;
  static staticMember2 = 2;

  menber1 = 1;
  menber2 = 2;

  constructor() {
    super(111);
    this.menber3 = 3;

    //this.defineGetter1();
  }

  func1() {
    super.func1();
  }

  get getter1() {

  }

  // componentDidMount() {
  //   super.componentDidMount();
  //   console.log('BabelTest2 componentDidMount');
  // }

  render() {
    return <Text>BabelTest2</Text>;
  }
}

Object.assign(BabelTest2.prototype, {
  defineGetter1: function defineGetter1() {
    console.log('BabelTest2 defineGetter1');
  }
});
