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
  Animated,
  Platform,
} from 'react-native';

import {
  Page,
  Link,
} from 'lab4';

import SimplePage from '../SimplePage';
import TestHelper from '../TestHelper';
import URI from 'urijs';

export default class MiscTest extends SimplePage {

  constructor(props, context) {
    super(props, context);
    this.state = {
      aaa: 1
    };
  }

  componentWillUpdate(nextProps, nextState, context) {
    console.log('this.props === nextProps ', (this.props === nextProps), ' this.state === nextState ', (this.state === nextState), ' this.context === context ', (this.context === context));
  }

  testURI() {
    var a = URI('/aaa/bbb.xx?aaaa');
    a.setQuery({
      a: 1,
      b: 'aaa'
    });
    alert(a.toString());

    var a = URI('/aaa/bbb.js?aaa=1')
      .absoluteTo('http://aaa.com');

    var b = URI('/aaa/bbb.js?aaa=1', 'http://bbb.com').toString();

    var c = URI('http://xxx.com/aaa/bbb.js?aaa=1', 'http://bbb.com').toString();

    var d = URI().protocol();
  }

  test1() {
    console.log(this.isMounted());

  }

  test2() {
    var a = false;
    var b = {...null};
    console.log(b);

  }

  test3() {
    // 如果一个对象的原型中定义了一个不可写的属性，在该对象上通过赋值方式无法覆盖该属性，在严格模式下会报错
    var aaa = {

    };
    Object.defineProperty(aaa, 'getter1', {
        value: function() {
            return undefined;
        }
    });
    var bbb = Object.create(aaa);
    bbb.getter1 = function () {
      console.log('xxx');
    };
    // Object.assign(bbb, {
    //   getter1: function () {
    //     console.log('xxx');
    //   }
    // });

    console.log(bbb);
    console.log(bbb.getter1());

  }

  test4() {
    // Object.assign 对于getter属性会直接取值
    // var a = {
    //   aaa: 1,
    //   get bbb() {
    //     console.log('a get bbb');
    //   }
    // };
    // var b = {
    //   bbb: 2,
    //   get ccc() {
    //     console.log('b get ccc');
    //   }
    // };
    // console.log(Object.assign(a, b));
  }

  _xxx() {
    var x = eval("(function(){var a = 1; return a;})").call(this);
    alert(x);
  }

  test5() {
    let xxx111 = 1;
    let a = [1, 2, 3];
    for (let b of a) {
      console.log(b);
    }
  }

  test6() {
    //let a = 1;
    if (12) {
      let a = 2;
    }
    console.log(a);
  }

  testbtoa() {
    alert(btoa('xxx'));
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
