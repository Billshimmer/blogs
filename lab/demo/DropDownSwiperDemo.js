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
} from 'lab4';

import DropDownSwiper from 'lab4/basiccomps/DropDownMenu/DropDownSwiper';

import SimplePage from 'lab4/demo/SimplePage';
import TestHelper from 'lab4/demo/TestHelper';

export default class DropDownSwiperDemo extends SimplePage {

  constructor(props, context) {
    super(props, context);
    this.state = {
      page: 0,
      visible: false,
    };
  }

  test1() {
    this.setState({
      visible: !this.state.visible
    });
  }

  test2() {
    this.setState({
      page: (this.state.page + 1) % 3
    });
  }

  test3() {
    this.setState({
      visible: !this.state.visible,
      page: (this.state.page + 1) % 3
    });
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
      <ScrollView
        style={{flex: 1}}>
        <DropDownSwiper
         page={this.state.page}
         visible={this.state.visible}
         onHide={() => {this.setState({
           visible: false
         })}}
         style={{height: 400}}>
         <View style={{height: 300, backgroundColor: '#44FDFF', justifyContent: 'center', alignItems: 'center'}}>
           <Text style={{fontSize: 30}}>1</Text>
         </View>
         <View style={{height: 200, backgroundColor: '#B57A10', justifyContent: 'center', alignItems: 'center'}}>
           <Text style={{fontSize: 30}}>2</Text>
         </View>
         <View style={{height: 500, backgroundColor: '#B6DE61', justifyContent: 'center', alignItems: 'center'}}>
           <Text style={{fontSize: 30}}>3</Text>
         </View>
        </DropDownSwiper>
        {this.renderTestBtns()}
      </ScrollView>
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
