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
  axios,
} from 'lab4';

import SimplePage from './SimplePage';
import TestHelper from './TestHelper';

global.TEST_BASE_URL = 'http://172.18.255.74:3003/';

export default class HTTPDemo extends SimplePage {

  constructor(props, context) {
    super(props, context);
    this.state = {
    };
    this.configPage({
      refreshable: true
    });
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    this.emitter.offByTag(this); 
  }

  async asyncReq() {
    try {
      let response = await fetch('http://qxp-trunk.hz.backustech.com/?LAB_JSON=1');
      return response.json();
    } catch(error) {
      throw error;
    }
  }

  buildTestXhr() {
    var xhr = new XMLHttpRequest();
    xhr.ontimeout = function (e) {
      console.error("XMLHttpRequest time out ", this, e);
    };
    xhr.onload = function (e) {
      console.log('XMLHttpRequest onload readyState:', xhr.readyState,
        'status:', xhr.status,
        'statusText:', xhr.statusText,
        '\nheaders:\n', xhr.getAllResponseHeaders(),
        '\nresponseText:\n', xhr.responseText);
    };
    xhr.onerror = function (err) {
      console.log('XMLHttpRequest onerror ', err);
    };
    xhr.timeout = 10000;
    return xhr;
  }

  simpleXhr() {
    var xhr = this.buildTestXhr();

    //xhr.open("GET", 'http://localhost:3003/demo/xhrtest', true);
    xhr.open("GET", TEST_BASE_URL + 'demo/xhrtest', true);

    xhr.setRequestHeader('LAB-APP', 'lab4');
    xhr.send(null);
  }

  testXHR1() {
    this.simpleXhr();
  }

  testXHR2() {
    var xhr = this.buildTestXhr();

    xhr.open("GET", TEST_BASE_URL + 'demo/xhrtest', true);

    xhr.setRequestHeader('Cache-Control', 'only-if-cached,max-stale=300000000');
    xhr.setRequestHeader('LAB-APP', 'lab4');
    xhr.send(null);
  }

  testAxios1() {
    axios('http://www.baidu.com')
    .then((response) => {
      console.log('succ', response.text());
    })
    .catch((e) => {
      console.log('err', e);
    });
  }

  testAxios2() {
    //使用data与timeout
    axios.post(TEST_BASE_URL + 'demo/xhrtest?xxxx=1#adfagadfgsdfg', {
      //method: 'POST',
      data: {
        aaa: 1,
        bbb: 2,
        ccc: 'xxxxx',
      },
      timeout: 8000,
    })
    .then((response) => {
      console.log(response);
    })
    .catch((e) => {
      console.log('xxx', e);
    });
  }

  testFetch() {
    fetch(TEST_BASE_URL + 'demo/xhrtest?xxxx=1#adfagadfgsdfg')
      .then((response) => {
        console.log(response);
      })
      .catch((e) => {
        console.log('xxx', e);
      });
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
