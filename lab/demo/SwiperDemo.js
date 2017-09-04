'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, {
  StyleSheet,
  View,
  Text,
  ScrollView,
  ViewPagerAndroid,
} from 'react-native';

import { Page, Link, requireComp } from 'lab4';

import SimplePage from 'lab4/demo/SimplePage';
import TestHelper from 'lab4/demo/TestHelper';

const Swiper = requireComp('com.Swiper');
const Image = requireComp('com.Image');

class TestComp extends Component {
  componentDidUpdate() {
    console.log('TestComp componentDidUpdate');
  }

  render() {
    return <View style={{ backgroundColor: '#CD8BC9' }} />;
  }
}

export default class SwiperDemo extends SimplePage {
  constructor(props, context) {
    super(props, context);
    this.state = {
      defaultIndex: 1,
    };

    this._onMomentumScrollEnd = this._onMomentumScrollEnd.bind(this);
    this._renderPagination = this._renderPagination.bind(this);

    this.configPage({
      scrollable: false,
    });
  }

  test1() {
    this.setState({
      defaultIndex: 2,
    });
  }

  test2() {
  }

  test3() {
    this.forceUpdate();
  }

  test4() {

  }

  test5() {
    this.forceUpdate();
  }

  _onMomentumScrollEnd(e, state, context) {
    //console.log('_onMomentumScrollEnd ', e, state, context)
  }

  _renderPagination(index, total, context) {
    //console.log('_renderPagination index:', index, 'total:', total, 'context:', context);
    return (
      <Text
        style={{
          position: 'absolute',
          top: 0,
        }}
      >
        {index}/{total}
      </Text>
    );
  }

  renderSwiper() {
    return (
      <View style={{}}>
        <Swiper
          ref="swiper"
          horizontal={true}
          loop={true}
          defaultIndex={this.state.defaultIndex}
          showsButtons={false}
          autoplay={true}
          showsPagination={true}
          dot={
            <View
              style={{
                backgroundColor: 'rgba(0,0,0,.2)',
                width: 5,
                height: 5,
                borderRadius: 4,
                marginLeft: 3,
                marginRight: 3,
                marginTop: 3,
                marginBottom: 3,
              }}
            />
          }
          activeDot={
            <View
              style={{
                backgroundColor: '#000',
                width: 8,
                height: 8,
                borderRadius: 4,
                marginLeft: 3,
                marginRight: 3,
                marginTop: 3,
                marginBottom: 3,
              }}
            />
          }
          paginationStyle={{
            bottom: 0,
            left: null,
            right: 10,
          }}
          autoplayTimeout={2}
          autoplayDirection={true}
          bounces={false}
          onMomentumScrollEnd={this._onMomentumScrollEnd}
          style={styles.swiper}
        >
          <View style={styles.slide1}>
            <Text style={styles.text}>000</Text>
          </View>
          <View style={styles.slide2}>
            <Text style={styles.text}>111</Text>
          </View>
          <View style={styles.slide3}>
            <Text style={styles.text}>222</Text>
          </View>
        </Swiper>
      </View>
    );
  }

  renderSwiper1() {
    return (
      <View style={{ flex: 1 }}>
        <Swiper
          ref="swiper"
          horizontal={true}
          loop={true}
          defaultIndex={1}
          showsButtons={false}
          autoplay={true}
          showsPagination={true}
          dot={
            <View
              style={{
                backgroundColor: 'rgba(0,0,0,.2)',
                width: 5,
                height: 5,
                borderRadius: 4,
                marginLeft: 3,
                marginRight: 3,
                marginTop: 3,
                marginBottom: 3,
              }}
            />
          }
          activeDot={
            <View
              style={{
                backgroundColor: '#000',
                width: 8,
                height: 8,
                borderRadius: 4,
                marginLeft: 3,
                marginRight: 3,
                marginTop: 3,
                marginBottom: 3,
              }}
            />
          }
          paginationStyle={{
            bottom: 0,
            left: null,
            right: 10,
          }}
          autoplayTimeout={2}
          autoplayDirection={true}
          bounces={false}
          onMomentumScrollEnd={this._onMomentumScrollEnd}
          style={{}}
        >
          {/*<TestComp/>*/}
          <View style={{ backgroundColor: '#02053D' }} />
          <View style={styles.slideItemWrapper}>
            <Image
              uri="http://7xlydk.com1.z0.glb.clouddn.com/1464602906681"
              style={styles.slideItemImage}
            />
          </View>
          <Image
            uri="http://7xlydk.com1.z0.glb.clouddn.com/1464602927456"
            style={{ flex: 1, alignSelf: 'stretch' }}
          />
        </Swiper>
        {this.renderTestBtns()}
        <View
          style={{
            height: 500,
            alignSelf: 'stretch',
            backgroundColor: '#A0B594',
          }}
        />
      </View>
    );
  }

  renderTest() {
    return this.renderSwiper();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  swiper: {},
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5',
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92BBD9',
  },
  slideItemWrapper: {
    flex: 1,
    alignSelf: 'stretch',
  },
  slideItemImage: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
});
