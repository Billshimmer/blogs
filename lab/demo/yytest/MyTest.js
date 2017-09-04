import React, { Component, PropTypes } from 'react';
import ReactNative, {
  StyleSheet,
  Platform,
  View,
  Text,
  Picker,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import { Page, Link, requireComp } from 'lab4';

import SimplePage from 'lab4/demo/SimplePage';
import TestHelper from 'lab4/demo/TestHelper';

const ImagePick = requireComp('com.ImagePick');
const Label = requireComp('com.Label');
const ActionSelectButton = requireComp('com.ActionSelectButton');

var data = [];
for (let i = 1; i < 50; i++)
  data.push('data: ' + i);

export default class MyTest extends SimplePage {
  constructor(props, context) {
    super(props, context);
    this.state = {
      what: null,
    };
  }

  renderContent() {
    return (
      <View style={{ flex: 1 }}>
        <ImagePick maxImage={7} />
        <Label text="123" onClose={() => {}} />
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            backgroundColor: 'white',
          }}
        >
          <ActionSelectButton data={data} defaultText="1234" />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   justifyContent: 'center',
  // },
  text: {
    fontSize: 40,
    textAlign: 'center',
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  button: {
    marginTop: 100,
    height: 40,
    width: 200,
    backgroundColor: '#00ffff',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  buttonList: {
    flexDirection: 'row',
  },
});
