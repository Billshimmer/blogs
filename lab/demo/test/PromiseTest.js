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
  Link,
} from 'lab4';

import SimplePage from '../SimplePage';
import TestHelper from '../TestHelper';

export default class PromiseTest extends SimplePage {

  constructor(props, context) {
    super(props, context);
    this.state = {
    };
  }

  test1() {
    new Promise(function(resolve, reject) {
      alert(111);
    });
  }

  test2() {
    //finally会将resolve reject都捕获 返回Promise finally之后无法catch之前的错误
    //done 没有返回，用在最后，不会捕获异常
    new Promise(function(resolve, reject) {
      console.log('Promise 1');
      resolve('xxx');
    })
      .then((result) => {
        console.log('then1 ', result);
        return 'then1';
      })
      .finally((result) => {
        console.log('finally1', result);
        return 'finally1';
      })
      .then((result) => {
        console.log('then2 ', result);
        return 'then2';
      })
      .then((result) => {
        return new Promise(function(resolve, reject) {
          console.log('Promise 2');
          //resolve('yyy');
          reject('xxx');
        });
      })
      .finally((result) => {
        console.log('finally2', result);
        //throw new Error('dddd');
      })
      .then((result) => {
        console.log('then3', result);
        throw 'xxxx';
      })
      // .catch((e) => {
      //   console.log('catch1', e);
      //   throw e;
      // })
      .done((xxx) => {
        console.log('done: ', xxx);
      });

  }

  test3() {
  }

  test4() {
  }

  test5() {
  }

  test6() {
  }

  test7() {
  }

  test8() {
  }

  test9() {
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
