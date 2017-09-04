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
  Image,
} from 'react-native';

import {
  Page,
  Link,
} from 'lab4';

import SimplePage from '../SimplePage';
import TestHelper from '../TestHelper';

import img_test from '../img/test.png';

const TEST_IMAGES = [
  'http://pic8.nipic.com/20100714/4039280_120729016360_2.jpg',
  'http://img.taopic.com/uploads/allimg/121209/234928-12120Z0543764.jpg',
  'http://www.bz55.com/uploads/allimg/150305/139-1503051FS0.jpg',
  'http://img.pconline.com.cn/images/upload/upc/tx/wallpaper/1212/06/c1/16396010_1354784049718.jpg',
  'http://img4.duitang.com/uploads/item/201205/14/20120514001331_wKMLH.thumb.600_0.jpeg',
  'http://img04.tooopen.com/images/20130317/tooopen_16483075.jpg',
];

/**
 * 1. android 下 不给source属性时就算Image宽高给出，Image组件也不会有宽高，onLayout不会触发 RN:0.25.1 (将source 设为空数组就可以)
 * 2. ios中图片uri和宽高同时改变有bug
 */
export default class ImageTest extends SimplePage {

  constructor(props, context) {
    super(props, context);
    this.state = {
      image1: 'http://img.61gequ.com/allimg/2011-4/201142614314278502.jpg',
      imageStyle1: {
        width: 100,
        height: 100,
      },
      imageIndex: 0,
    };
  }

  testChange1() {
    this._changeFlag = !this._changeFlag;
    let style1 = {
      width: 100,
      height: 120,
    };
    let style2 = {
      width: 200,
      height: 180,
    }
    this.setState({
      image1: this._changeFlag ? 'http://fe.topitme.com/e/41/a5/11263545716bca541eo.jpg' : 'http://img.61gequ.com/allimg/2011-4/201142614314278502.jpg',
      imageStyle1: this._changeFlag ? style1 : style2,
    });
  }

  testChange2() {
    this.setState({
      image1: TEST_IMAGES[(++this.state.imageIndex) % TEST_IMAGES.length],
    });
  }

  testForceUpdate() {
    this.forceUpdate();
  }

  renderContent() {
    return (
      <ScrollView style={styles.container}>
        <View >
          {this.renderTestBtns()}
          <Image
            source={{uri: this.state.image1}}
            defaultSource={img_test}
            loadingIndicatorSource={img_test}
            style={this.state.imageStyle1} />
          <Image
            onLayout={(e) => {
              console.log('onLayout empty image', e.nativeEvent);
            }}
            source={[]}
            style={[styles.section, {width: 200, height: 300, backgroundColor: '#D772CD',}]} />
          <Image source={img_test} resizeMode="cover" style={[styles.section, {width: 200, height: 300}]} />

          <View style={[styles.section, {width: 200, height: 500}]}>
            <Image
              onLayout={(e) => {
                console.log('onLayout1', e.nativeEvent);
              }}
              source={{uri: 'http://img.61gequ.com/allimg/2011-4/201142614314278502.jpg'}} resizeMode="contain" style={{flex: 1}} />
          </View>
          <View style={[styles.section, {width: 200, height: 500, position: 'relative'}]}>
            <Image
              onLayout={(e) => {
                console.log('onLayout2', e.nativeEvent);
              }}
              source={{uri: 'http://img.61gequ.com/allimg/2011-4/201142614314278502.jpg'}} style={{position: 'absolute', left: 0, top: 0, right: 0, bottom: 0}} />
          </View>
          <View style={[styles.section, {width: 200, height: 500, flexDirection: 'row'}]}>
            <Image
              onLayout={(e) => {
                console.log('onLayout3', e.nativeEvent);
              }}
              source={{uri: 'http://img.61gequ.com/allimg/2011-4/201142614314278502.jpg'}} resizeMode="contain" style={{width: 150}} />
          </View>
          {/*<Text style={{fontSize: 30}}>abcdefg<Image source={{uri: 'http://img.61gequ.com/allimg/2011-4/201142614314278502.jpg', width: 30, height: 30}} style={{width: 30, height: 30}}><Text>xxxx</Text></Image>hijk</Text>*/}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  section: {
    marginBottom: 5
  }
});
