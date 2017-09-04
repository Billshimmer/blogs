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
  TextInput,
} from 'react-native';

import {
  Page,
} from 'lab4';

import SimplePage from 'lab4/demo/SimplePage';
import TestHelper from 'lab4/demo/TestHelper';

import TestComp from 'lab4/demo/testcomp/TestComp'
import TestComp1 from 'lab4/demo/testcomp/TestComp1'

export default class KeyTest extends SimplePage {

  constructor(props, context) {
    super(props, context);
    this.state = {
      data: ["1", "2", "3"]
    };
    this._id = 4;
  }

  test1() {
    this.state.data.shift();
    this.forceUpdate();
  }

  test2() {
    this.state.data.unshift('' + this._id++);
    this.forceUpdate();
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

  renderContent() {
    return (
      <View>
        <View>
          {this.state.data.map((item, i) => {
            if(i == this.state.data.length - 1) {
              return <TextInput key={item} style={{height: 40, backgroundColor: '#979896'}}/>
            }
            return <Text>item</Text>;
            // switch (item) {
            // case "2":
            //   return <TestComp1 name={item}/>
            // case "3":
            //   return <TextInput style={{height: 40, backgroundColor: '#979896'}}/>
            // default:
            //   return <TestComp name={item}/>
            // }
          })}
        </View>
        {this.renderTestBtns()}
      </View>
    );
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
