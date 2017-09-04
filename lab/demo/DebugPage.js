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
  TextInput,
} from 'react-native';

import LAB, {
  Page,
  requireComp,
} from 'lab4';

const HeaderBar = requireComp('com.HeaderBar');

/**
 * 组件测试页面
 * 如果测试组件或页面是url，则会先加载本页面然后又本页面负责加载
 * 如果测试组件以Page结尾，则会当成页面，替换本页面
 */
export default class DebugPage extends Page {

  constructor(props, context) {
    super(props, context);
    this.state = {
      compData: null,
      title: 'DEBUG'
    };
  }

  onLoadResponse(response) {
    if(!response.ui_type) {
      console.error('ui_type不存在! response=', response);
      return;
    }

    if(this.props.route.isPage || (this.props.route.isPage == null && response.ui_type.indexOf('Page') == response.ui_type.length - 4)) {
      // 是Page类型组件
      this.props.pageContainer.changeData(response);
    } else {
      this.setState({
        compData: response,
        title: response.ui_type
      });
    }
  }

  renderHeader() {
    return (
      <HeaderBar
        title={this.state.title}
        left={{icon: 'arrow-back'}}
        onLeftPress={() => this.router.pop()}/>
    );
  }

  renderContent() {
    if(!this.state.compData) {
      return null;
    }
    if(this.state.compData.style) {
      delete this.state.compData.style.ui_type;
    }
    return (
      <View style={styles.container}>
        {LAB.render(this.state.compData)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
  },
});
