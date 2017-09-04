'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, { StyleSheet, Text, View, ScrollView } from 'react-native';
import LAB from 'lab4';
import BasicSwiper from 'lab4/basiccomps/Swiper/Swiper';

export default class Swiper extends LAB.Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <BasicSwiper
        {...this.props}
        style={[this.getStyle('container'), this.props.style]}
        dotStyle={[this.getStyle('dot'), this.props.dotStyle]}
        activeDotStyle={[this.getStyle('activeDot'), this.props.activeDotStyle]}
        paginationStyle={[
          this.getStyle('pagination'),
          this.props.paginationStyle,
        ]}
        ref="_swiper"
      >
        {this.props.children}
      </BasicSwiper>
    );
  }
}
