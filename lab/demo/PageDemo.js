'use strict';

import React, {
  PropTypes,
} from 'react';
import ReactNative, {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import LAB, {
  Page,
  requireComp,
} from 'lab4';
import TestHelper from 'lab4/demo/TestHelper';

const HeaderBar = requireComp('com.HeaderBar');
const List = requireComp('com.List');

function generateItems() {
  const items = [];
  for (let i = 0; i < 10; ++i) {
    items.push({
      text: Math.random(),
    });
  }
  return items;
}

/**
 * Page继承使用的基本例子
 */
export default class PageDemo extends Page {
  static propTypes = {
    ...Page.propTypes,

    // 扩展propTypes 必须先包含原有propTypes 并查看Page代码 不要与Page 默认的propTypes冲突
    xxx: PropTypes.any,
  };

  static defaultProps = {
    ...Page.defaultProps,

    // 扩展defaultProps 同上
    xxx: 1,
  };

  static contextTypes = {
    ...Page.contextTypes,

    // 扩展contextTypes 同上
    xxx: PropTypes.any,
  };

  constructor(props, context) {
    // 调用Page的构造函数时必须完整传入props context
    super(props, context);

    // Page类中不使用state 所以继承之后可以定义自己的state
    this.state = {
      items: generateItems(),
      listBindPageRefresh: true,
    };

    this.url = 'fake url';
  }

  componentDidMount() {
    // 必须调用父类的componentDidMount Page 中会根据配置决定是否调用loadPageData
    super.componentDidMount();
  }

  componentWillReceiveProps(nextProps) {
    // 必须调用父类的componentWillReceiveProps
    super.componentWillReceiveProps(nextProps);
  }
  
  componentWillUnmount() {
    // 必须调用父类的componentWillUnmount
    super.componentWillUnmount();
  }

  testLoadPageData() {
    this.loadPageData({
      showError: false,
    })
      .then((result) => {
        // loadPageData 返回Promise 该Promise没有reject
        // 格式为 {response, error}
        console.log('testLoadPageData result:', result);
      }, (error) => {
        console.log('testLoadPageData error:', error);
      });
  }

  testShowLoading() {
    this.showLoading();

    setTimeout(() => {
      this.hideLoading();
    }, 2000);
  }

  testToggleRereshable() {
    this.configPage({
      refreshable: this.state.listBindPageRefresh
    });
    this.setState({
      listBindPageRefresh: !this.state.listBindPageRefresh,
    });
  }

  renderHeader() {
    return (
      <HeaderBar
        title="PageDemo"
        left={{icon: 'arrow-back', link: 'pop'}}
      />
    );
  }

  renderContent() {
    return (
      <View style={styles.container}>
        {this.renderTestBtns()}
      </View>
    );
  }

  onLoadStart(options) {
    // loadPageData 开始回调

    console.log('onLoadStart', options);
  }

  onLoadResponse(response, options) {
    // loadPageData 成功回调

    console.log('onLoadResponse', response, options);

    this.setState({
      items: response.items,
    });

    // throw new Error('onLoadResponse fake error');
  }

  onLoadError(error, options) {
    // loadPageData 失败回调

    console.log('onLoadError', error, options);
  }

  onLoadComplete(error, response, options) {
    // loadPageData 开始回调

    console.log('onLoadComplete', error, response, options);

    // throw new Error('onLoadComplete fake error');
  }

  // loadPage最终请求数据的底层方法
  // 重写以实现自己的加载逻辑
  // 比如从本地数据库加载
  doLoadPageData(options) {
    // 模拟数据请求
    return new Promise((resolve, reject) => {
      Math.random() > 0.3 ? resolve({
        xxx: 'fake data',
        items: generateItems(),
      }) : reject(new Error('fake error'));
    }).delay(1000);
  }

  _renderSimpleRow(rowData, sectionID, rowID, highlightRow) {
    return (
      <Text style={{padding: 20, fontSize: 18}}>rowID: {rowID} text: {rowData.text}</Text>
    );
  }

  renderContent() {
    return (
      <View style={{flex: 1,}}>
        {this.renderTestBtns()}
        <List
          ref="list"
          refreshable={true}
          topBounceBgStyle={{
            backgroundColor: '#4FB47E',
          }}
          defaultItems={this.state.items}
          renderRow={this._renderSimpleRow}
          bindPageRefresh={this.state.listBindPageRefresh}
          />
      </View>
    );
  }
}

TestHelper.assignHelpers(PageDemo.prototype);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});