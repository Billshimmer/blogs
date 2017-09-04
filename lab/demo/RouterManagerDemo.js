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
} from 'react-native';

import LAB, {
  Page,
  Link,
} from 'lab4';

import SimplePage from 'lab4/demo/SimplePage';
import TestHelper from 'lab4/demo/TestHelper';
import RouterManager from 'lab4/core/RouterManager';

export default class RouterManagerDemo extends SimplePage {

  constructor(props, context) {
    super(props, context);
    this.state = {
    };
    this.configPage({
      scrollable: true, //页面可滚动
    });

    // RouterManager是单例的 所以这里会改变全局的路由配置
    this.testRouterManager = RouterManager;
    RouterManager._compiledRouteConfigs.length = 0;

    // : 匹配单个变量 后面跟合法的变量名，以第一个非法字符如/ ? &作为变量名结尾
    // *匹配所有 后面跟合法变量名
    // ()表示可选
    this.testRouterManager.configRouteManifest([
      {
        path: 'foo/bar',
        r: 'foo/bar',
      },
      {
        path: 'foo/:abc',
        r: 'foo/:abc',
      },
      {
        path: 'foo/:abc/:def',
        r: 'foo/:abc/:def',
      },
      {
        path: 'bar/:abc(/:def)',
        r: 'bar/:abc(/:def)',
      },
      {
        path: 'bar/:abc/*xxx',
        r: 'bar/:abc/*xxx',
      },
      {
        path: '/foobar/*',
        r: '/foobar/*',
      },
      {
        path: 'query(/:aaa)?a=2&b=:bbb&c=:ccc&*xx',
        r: 'query?a=2&b=:bbb&c=:ccc&*xx',
      },
      {
        path: 'aaa/bbb/ccc*',
        r: 'aaa/bbb/ccc*',
      }
    ]);

    console.log('_routeRegs', this.testRouterManager._compiledRouteConfigs);
  }

  testMatchUrl() {
    let paths = [
      '/foo/bar',
      'foo/xxx?aaa=1&bbb=2',
      'foo/aaa/bbb',
      'foo/123/456/789?xxx=1#adfadfasdf',
      'bar/xxx',
      'xxx/aaa?aaa=1&bbb=2#asdfadf',
      'bar/aaa/bbb/ccc?afgfg=2',
      '/foobar/asdfa/adfsd#adgafg',
      '',
      '/adf/adsf',
      'q325346',
      '/',
      'foo/aaa/1/bbb/2?ccc=2',
      '#agsfg',
      'query/xxx?a=2&b=123434&c=566356&asfadf#adfadf',
      'aaa/bbb/cccddd',
      'aaa/bbb/ccc/ddd/eee',
    ];
    for(let path of paths) {
      console.log('testGetRouteOptions pathname:', path, ' result:', this.testRouterManager.matchUrl(path));
    }
  }

  testAddRoute() {
  }

  test1() {
  }

  test2() {
  }

  test3() {
  }

  test4() {
  }

  test5() {
  }

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
  },
});
