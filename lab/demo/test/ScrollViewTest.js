'use strict';

import React, {
  Component,
  PropTypes,
} from 'react';
import ReactNative, {
  
  StyleSheet,
  View,
  Text,
  ListView,
  RefreshControl,
  ScrollView,
} from 'react-native';

import {
  Page,
  Link,
} from 'lab4';

import SimplePage from 'lab4/demo/SimplePage';
import TestHelper from 'lab4/demo/TestHelper';

export default class ScrollViewTest extends SimplePage {

  constructor(props, context) {
    super(props, context);

    // this.configPage({
    //   scrollable: true,
    // });

    this.state = {
      contentOffsetX: 100,
    };
  }

  testScrollTo() {
    this.refs.scroll_view.scrollTo({
      x: 500,
    });
  }

  testScrollToNoAnim() {
    this.refs.scroll_view.scrollTo({
      x: 500,
      animated: false,
    });
  }

  testScrollTo1() {
    this.refs.scroll_view3.scrollTo({
      y: 1500,
    });
  }

  testUpdateContentOffsetX() {
    this.setState({
      contentOffsetX: 600,
    });
  }

  _renderIOSBUG1() {
    return (
      <ScrollView
        ref="scroll_view2"
        horizontal
        onScroll={(e) => {
          console.log('onScroll ', e.nativeEvent);
        }}
        onMomentumScrollBegin={(e) => {
          console.log('onMomentumScrollBegin ', e.nativeEvent);
        }}
        onMomentumScrollEnd={(e) => {
          console.log('onMomentumScrollEnd ', e.nativeEvent);
        }}
        pagingEnabled
        style={{
          flex: 1,
          backgroundColor: '#7986cb',
          alignSelf: 'stretch',
        }} >
        <View style={{width: 350, backgroundColor: '#d4e157'}}>
          {this.renderBtn('xxx2', () => {
            console.log('xxx2 onPress');
            alert('xxx2 onPress');
          })}
          <ScrollView
            ref="scroll_view3"
            onScroll={(e) => {
              console.log('onScroll ', e.nativeEvent);
            }}
            onMomentumScrollBegin={(e) => {
              console.log('onMomentumScrollBegin ', e.nativeEvent);
            }}
            onMomentumScrollEnd={(e) => {
              console.log('onMomentumScrollEnd ', e.nativeEvent);
            }}
            pagingEnabled
            style={{
              flex: 1,
              backgroundColor: '#7986cb',
              alignSelf: 'stretch',
            }} >
            <View style={{height: 650, backgroundColor: '#d4e157'}}>
            {this.renderBtn('xxx3', () => {
              console.log('xxx3 onPress');
              alert('xxx3 onPress');
            })}
              <Text>3333</Text>
            </View>
            <View style={{height: 650, backgroundColor: '#1e88e5'}}><Text>3333</Text></View>
            <View style={{height: 650, backgroundColor: '#3f51b5'}}><Text>3333</Text></View>
            <View style={{height: 650, backgroundColor: '#ab47bc'}}><Text>3333</Text></View>
          </ScrollView>
        </View>
        <View style={{width: 350, backgroundColor: '#1e88e5'}}><Text>2222</Text></View>
        <View style={{width: 350, backgroundColor: '#3f51b5'}}><Text>2222</Text></View>
        <View style={{width: 350, backgroundColor: '#ab47bc'}}><Text>2222</Text></View>
      </ScrollView>
    );
  }

  _renderIOSBUG() {
    return (
    <ScrollView
      ref="scroll_view1"
      horizontal
      onScroll={(e) => {
        console.log('onScroll ', e.nativeEvent);
      }}
      onMomentumScrollBegin={(e) => {
        console.log('onMomentumScrollBegin ', e.nativeEvent);
      }}
      onMomentumScrollEnd={(e) => {
        console.log('onMomentumScrollEnd ', e.nativeEvent);
      }}
      pagingEnabled
      style={{
        flex: 1,
        backgroundColor: '#4dd0e1',
      }} >
      <View style={{width: 350, backgroundColor: '#d4e157'}}>
        {this.renderBtn('xxx1', () => {
          console.log('xxx1 onPress');
          alert('xxx1 onPress');
        })}
        {this._renderIOSBUG1()}
      </View>
      <View style={{width: 350, backgroundColor: '#1e88e5'}}><Text>1111</Text></View>
      <View style={{width: 350, backgroundColor: '#3f51b5'}}><Text>1111</Text></View>
      <View style={{width: 350, backgroundColor: '#ab47bc'}}><Text>1111</Text></View>
    </ScrollView>
    );
  }

  renderTest() {
    // return this._renderIOSBUG();
    return (
      <ScrollView
        ref="scroll_view"
        horizontal
        contentOffset={{x: this.state.contentOffsetX}}
        onScroll={(e) => {
          console.log('onScroll ', e.nativeEvent);
        }}
        onMomentumScrollBegin={(e) => {
          console.log('onMomentumScrollBegin ', e.nativeEvent);
        }}
        onMomentumScrollEnd={(e) => {
          console.log('onMomentumScrollEnd ', e.nativeEvent);
        }}
        pagingEnabled
        style={{
          height: 200,
          flex: null,
        }} >
        <View style={{width: 300, backgroundColor: '#d4e157'}}></View>
        <View style={{width: 300, backgroundColor: '#1e88e5'}}></View>
        <View style={{width: 300, backgroundColor: '#3f51b5'}}></View>
        <View style={{width: 300, backgroundColor: '#ab47bc'}}></View>
        <View style={{width: 300, backgroundColor: '#ff5722'}}></View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
