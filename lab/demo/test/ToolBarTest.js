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
  ToolbarAndroid,
  SwitchAndroid,
} from 'react-native';

import LAB, {
  Page,
  Link,
} from 'lab4';

import SimplePage from 'lab4/demo/SimplePage';
import TestHelper from 'lab4/demo/TestHelper';

import img_rn_logo from 'lab4/demo/img/rn_logo.png';

const toolbarActions = [
  {title: 'Create', icon: img_rn_logo, show: 'always'},
  {title: 'Filter'},
];

/**
 * toolbar 的children 虽然显示区域是toolbar 中间部分，但是由于rn 布局机制原因，其实际宽度与toolbar 相同
 */
export default class ToolBarTest extends SimplePage {

  constructor(props, context) {
    super(props, context);
    this.state = {
    };
    // this.configPage({
    //   scrollable: true, //页面可滚动
    // });
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

  renderTest() {
    return (
      <View style={styles.container}>
        <ToolbarAndroid
          actions={toolbarActions}
          navIcon={img_rn_logo}
          onActionSelected={() => {
            console.log('onActionSelected');
          }}
          onIconClicked={() => {
            console.log('onIconClicked');
          }}
          style={styles.toolbar}
          subtitle="xxx"
          title="Toolbar" >
          <View style={{backgroundColor: '#0E92AF', flexDirection: 'row', alignItems: 'center',}}>
            <View style={{flex: 1, backgroundColor: '#2A9D81'}} onLayout={(e) => {
              alert(JSON.stringify(e.nativeEvent));
            }}><Text style={{}}>1xxxxxxx xxxxxxx xxxxxx</Text></View>
          </View>
        </ToolbarAndroid>
      </View>
    );
  }

  // renderContent() {
  //   return (
  //     <View style={styles.container}>
  //       {this.renderTestBtns()}
  //     </View>
  //   );
  // }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toolbar: {
    backgroundColor: '#e9eaed',
    height: 56,
  },
});
