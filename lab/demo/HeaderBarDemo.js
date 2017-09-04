'use strict';

import React, {
  Component,
  PropTypes,
} from 'react';
import ReactNative, {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TouchableNativeFeedback,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
  PixelRatio,
} from 'react-native';
import LAB, {
  Page,
  requireComp,
} from 'lab4';

const HeaderBar = LAB.requireComp('com.HeaderBar');
const HeaderBarItem = LAB.requireComp('com.HeaderBarItem');

export default class HeaderBarDemo extends Page {

  constructor(props, context) {
    super(props, context);
    this.state = {
      text: 'xxx'
    }
  }

  renderHeader() {
    // left link为 pop 支持点击返回
    // overlayHeader 使得content区域包括HeaderBar的下面(overlayHeader其实是Page处理的 所以只对renderHeader返回的HeaderBar设置有效)
    return (
      <HeaderBar
        title="HeaderBarDemo"
        left={{icon: 'action-back', link: 'pop'}}
        right={{icon: 'share'}}
        onRightPress={() => alert('onRightPress')}
        overlayHeader
        style={{backgroundColor: 'rgba(92, 107, 192, 0.7)'}}/>
    );
  }

  renderContent() {
    return (
      <View style={styles.container}>
        <Text style={{fontSize: 20, marginLeft: 50, marginTop: 20, marginBottom: 80,}}>位于HeaderBar下面</Text>

        <HeaderBar
          title="HeaderBar1 adfasdfadfaadsfadfsdgaadfadfadfasdfgadf"
          tintColor="#f5f5f5"
          left={[{icon: 'whatshot', iconSize: 30, link: {type: null}}, {icon: 'star-border', link: {comp: HeaderBarDemo}}]}
          right={<HeaderBarItem text="哈哈" />}
          onLeftPress={(i, item) => alert(`index:${i}, item:${item}`)}
          onRightPress={(i, item) => alert(`index:${i}, item:${item}`)}
          itemProps={{imageStyle: {width: 30, height: 30}}}
          titleTextStyle={{
            color: '#555555'
          }}
          style={{
            marginBottom: 30,
            elevation: 4,
            borderBottomWidth: 0,
            borderColor: '#d0d0d0',
            shadowColor: '#000',
            shadowOffset: {height: 3},
            shadowOpacity: 0.4,
            shadowRadius: 1}}/>

        {/* 使用mainContent 自定义中间区域 */}
        <HeaderBar
          title="HeaderBar2"
          tintColor="#725391"
          left={{icon: 'action-back'}}
          right={{icon: 'star-border'}}
          mainContent={
            <TextInput
              defaultValue="search"
              style={{alignSelf: 'stretch', backgroundColor: '#06D9DF', flex: 1}}/>
          }
          onLeftPress={() => alert(`back`)}
          itemProps={{imageStyle: {width: 30, height: 30}}}
          style={{}}/>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
