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
  Animated,
} from 'react-native';

import {
  Page,
} from 'lab4';

import normalizeColor from 'react-native/Libraries/StyleSheet/normalizeColor';

import SimplePage from 'lab4/demo/SimplePage';
import TestHelper from 'lab4/demo/TestHelper';

export default class AnimationTest extends SimplePage {

  constructor(props, context) {
    super(props, context);
    this.state = {
      animatedColor: new Animated.Value(0)
    };

    // this.state.animatedColor.addListener((value) => {
    //   console.log('animatedColor ', value);
    // });

    this.testValue = new Animated.Value(0);
    this.testValue.addListener((value) => {
      console.log('testValue ', value);
    });
  }

  test1() {
    this.testValue.setValue(0.5);
  }

  test2() {
    Animated.timing(this.testValue, {
      toValue: 1,
      duration: 2000,
    }).start((e, x) => {
      console.log('testValue timing end ', e);
    });
  }

  test3() {
    this.testValue.stopAnimation();
  }

  test4() {
    let startColor = normalizeColor('#72DEEC');
    let endColor = normalizeColor('#B62B2B');

    let sr = (startColor >>> 24) & 0xFF;
    let sg = (startColor >>> 16) & 0xFF;
    let sb = (startColor >>> 8) & 0xFF;
    let sa = (startColor) & 0xFF;

    let er = (endColor >>> 24) & 0xFF;
    let eg = (endColor >>> 16) & 0xFF;
    let eb = (endColor >>> 8) & 0xFF;
    let ea = (endColor) & 0xFF;

    let dr = er - sr;
    let dg = eg - sg;
    let db = eb - sb;
    let da = ea - sa;

    // console.log('startColor', startColor);
    // console.log('endColor', endColor);
    // console.log('start', sr, sg, sb, sa);
    // console.log('end', er, eg, eb, ea);
    // console.log('d', dr, dg, db, da);

    let animatedValue = new Animated.Value(0);
    animatedValue.addListener(({value}) => {
      let r = (sr + dr * value) >>> 0;
      let g = (sg + dg * value) >>> 0;
      let b = (sb + db * value) >>> 0;
      let a = (sa + da * value) >>> 0;

      //console.log(r, g, b, a);
      let rgba = ((r << 24) | (g << 16) | (b << 8) | a) >>> 0;
      this.state.animatedColor.setValue(rgba);
    });

    this.state.animatedColor.setValue(startColor);
    Animated.timing(
      animatedValue,
      {
        toValue: 1,
        duration: 3000
      }
    ).start();

  }

  test5() {
    var value = new Animated.Value(0);
    value.addListener((e) => {
      console.log('Value listener value:' + e.value);
    });
    console.log(value.__getValue());
    value.setValue(0.5);
    console.log(value.__getValue());
    var value1 = value.interpolate({
      inputRange: [0, 1], outputRange: [0, 3]
    });
    console.log(value1.__getValue());
    value.setValue(0.7);
    console.log(value1.__getValue());
  }

  test6() {
    var avalue = this.avalue = new Animated.Value(0);
    avalue.addListener((e) => {
      console.log('Value listener value:' + e.value);
    });
    Animated.timing(
       avalue,
       {toValue: 1,
       duration: 3000},
     ).start();
  }

  testInterpolate() {
    const position = new Animated.Value(0);
    const index = 2;

    const width = 100;
    const inputRange = [index - 1, index, index + 0.999, index + 1, index + 1.001];
    const outputRange = [width, 0, -20, -10000, -10000];

    const opacity = position.interpolate({
      inputRange,
      outputRange: [1, 1, 0.3, 0, 0],
    });

    const scale = position.interpolate({
      inputRange,
      outputRange: [1, 1, 0.98, 0.98, 0.98],
    });

    const translateX = position.interpolate({
      inputRange,
      outputRange,
    });

    position.addListener((e) => {
      console.log('position:', e.value, 'opacity:', opacity.__getValue(), 'scale:', scale.__getValue(), 'translateX:', translateX.__getValue());
    });

    Animated.timing(
       position,
       {
         toValue: 4,
        duration: 3000,
      },
     ).start();
  }

  renderTest() {
    return (
      <View>
        <Animated.View
          style={{
            height: 100,
            width: 200,
            backgroundColor: this.state.animatedColor
          }}></Animated.View>
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
