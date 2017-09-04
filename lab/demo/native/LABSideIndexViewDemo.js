'use strict';
import React, {Component,PropTypes} from 'react';
import ReactNative, {
  
  StyleSheet,
  Platform,
  View,
  Text,
  Picker,
  ScrollView,
  TouchableOpacity
} from 'react-native';

import {Page} from 'lab4';

import SimplePage from 'lab4/demo/SimplePage';
import TestHelper from 'lab4/demo/TestHelper';

import SideIndexView from 'lab4/basiccomps/SideIndexView/SideIndexView';

export default class LABSideIndexViewDemo extends SimplePage {
  constructor(props, context) {
    super(props, context);
    this.state = {
      letter: null,
      position: null,
      letters: [
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'I',
        'J',
        'K',
        'L',
        'M',
        'N',
        'O',
        'P',
        'Q',
        'R',
        'S',
        'T',
        'U',
        'V',
        'W',
        'X',
        'Y',
        'Z'
      ]
    };
  }

  renderTest() {
    return (
      <View style={{flex: 1}}>
        <ScrollView>
          <View style={{height: 2000,}}>
            <Text>letter:{this.state.letter}, position:{this.state.position}</Text>
          </View>
        </ScrollView>
        <SideIndexView
          letters={this.state.letters}
          onLetterChange={(letter, position) => {
            this.setState({letter: letter, position: position});
          }}
          style={{position: 'absolute', width: 100, top: 20, right: 0, bottom: 20,}}
        />
      </View>
    );
  }
}
