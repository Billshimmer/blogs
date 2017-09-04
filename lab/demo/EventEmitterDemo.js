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
} from 'react-native';

import {
  Page,
  EventEmitter,
  globalEmitter,
} from 'lab4';

import SimplePage from 'lab4/demo/SimplePage';
import TestHelper from 'lab4/demo/TestHelper';

class MyEventEmitter extends EventEmitter {

}

export default class EventEmitterDemo extends SimplePage {

  constructor(props, context) {
    super(props, context);
    this.state = {
    };
    //this.myEmitter = new EventEmitter();
    this.myEmitter = globalEmitter;
  }

  test1() {
    //订阅事件
    this.myEmitter.on('aaa', (a, b, c) => {
      console.log('on aaa');
    }, this, this);
    this.myEmitter.on('bbb', () => {
      console.log('on bbb');
    }, this, this);

    for(var i = 0; i < 3; ++i) {
      this.myEmitter.on('ccc', () => {
        console.log('on ccc');
      }, this, this);
    }
  }

  test2() {
    //发送事件
    this.myEmitter.emit('aaa', '', 2, 4);
    this.myEmitter.emit('bbb');
    this.myEmitter.emit('ccc');
  }

  test3() {
    //移除tag对应的所有订阅
    this.myEmitter.offByTag(this);
  }

  test4() {
    setTimeout(() => {
      this.test2();
    }, 3000);
  }

  test5() {
    var aaa = new MyEventEmitter();
    aaa.on('xxx', () => {
      alert(1);
    }, this);
    aaa.emit('xxx');

  }

  test6() {
    this.myEmitter.on('xxx', () => {
        console.log('on xxx');
      }, {});
  }

  test7() {
  }

  test8() {
  }

  test9() {
  }

  // componentWillReceiveProps(nextProps) {
    
  // }
  

  // renderContent() {
  //   return (
  //
  //   );
  // }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});
