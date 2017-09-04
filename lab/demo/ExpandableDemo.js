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
  requireComp,
} from 'lab4';

import SimplePage from 'lab4/demo/SimplePage';
import TestHelper from 'lab4/demo/TestHelper';

const Expandable = requireComp('com.Expandable');
const Html = requireComp('com.Html');

export default class ExpandableDemo extends SimplePage {

  constructor(props, context) {
    super(props, context);
    this.state = {
    };
    this.configPage({
      scrollable: true, //页面可滚动
    });
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

  renderContent() {
        //     <View style={{height: 300, backgroundColor: '#29b6f6'}}>
        //   <Text>xxxxadfa\nasdfasdf\nafadf\nasdfa\nmsdgsadfgsdfgsdfgsdf asdfgsdfg  gsdfg</Text>
        // </View>
    return (
      <Expandable
        initHeight={30}
        header={<Text>click me!</Text>}
        footer={<Text>click me!</Text>}
        buttonClass="expandable-default">
          <Html
            html="<div><p>adfadfa</p><p>adfadfa</p><p>adfadfa</p><p>adfadfa</p><p>adfadfa</p><p>adfadfa</p><p>adfadfa</p><p>adfadfa</p><p>adfadfa</p><p>adfadfa</p><p>adfadfa</p><p>adfadfa</p><p>adfadfa</p><p>adfadfa</p></div>"
            fitContentHeight={true}/>
      </Expandable>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
