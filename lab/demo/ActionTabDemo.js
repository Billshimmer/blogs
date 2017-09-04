import React, { Component, PropTypes } from 'react';
import ReactNative, {
  StyleSheet,
  View,
  Text,
  ScrollView,
  ListView,
  RefreshControl,
  StatusBar,
  TouchableOpacity,
  Image,
  Picker,
} from 'react-native';

import LAB, { Page, requireComp } from 'lab4';

const Button = requireComp('com.Button');
const ActionTab = requireComp('com.ActionTab');

const tabData = [
  {
    text: '000',
    activeImage: 'http://7xo7rx.com2.z0.glb.qiniucdn.com/2015-12-25_567c974ed13db.jpg',
    image: 'http://img3.3lian.com/2013/v10/4/87.jpg',
  },
  {
    text: '111',
    activeImage: 'http://7xo7rx.com2.z0.glb.qiniucdn.com/2015-12-25_567c974ed13db.jpg',
    image: 'http://img3.3lian.com/2013/v10/4/87.jpg',
  },
  {
    text: '222',
    activeImage: 'http://7xo7rx.com2.z0.glb.qiniucdn.com/2015-12-25_567c974ed13db.jpg',
    image: 'http://img3.3lian.com/2013/v10/4/87.jpg',
  },
  {
    text: '333',
    activeImage: 'http://7xo7rx.com2.z0.glb.qiniucdn.com/2015-12-25_567c974ed13db.jpg',
    image: 'http://img3.3lian.com/2013/v10/4/87.jpg',
  },
  {
    text: '444',
    activeImage: 'http://7xo7rx.com2.z0.glb.qiniucdn.com/2015-12-25_567c974ed13db.jpg',
    image: 'http://img3.3lian.com/2013/v10/4/87.jpg',
  },
];
const tabData2 = [
  {
    text: '110',
    image: 'http://7xo7rx.com2.z0.glb.qiniucdn.com/2015-12-25_567c974ed13db.jpg',
  },
  {
    text: '331',
    image: 'http://7xo7rx.com2.z0.glb.qiniucdn.com/2015-12-25_567c974ed13db.jpg',
  },
  {
    text: '2ee22',
    image: 'http://7xo7rx.com2.z0.glb.qiniucdn.com/2015-12-25_567c974ed13db.jpg',
  },
  {
    text: 'dsf',
    image: 'http://7xo7rx.com2.z0.glb.qiniucdn.com/2015-12-25_567c974ed13db.jpg',
  },
];

const tabData3 = [];

import SimplePage from 'lab4/demo/SimplePage';
import TestHelper from 'lab4/demo/TestHelper';

export default class ActionTabDemo extends SimplePage {
  static contextTypes = {
    ...LAB.Component.componentContextTypes,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      show: false,
    };
  }

  renderContent() {
    return (
      <View style={styles.container}>

        <Button
          onPress={() => {
            this.setState({ show: !this.state.show });
          }}
        >
          点我改数据源
        </Button>
        <ActionTab
          showText={true}
          tabData={this.state.show ? tabData : tabData2}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
    backgroundColor: 'white',
  },
});
