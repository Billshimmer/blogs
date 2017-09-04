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
  Alert,
} from 'react-native';

import LAB, { Page, Link, HeaderBar, requireComp } from 'lab4';

import SimplePage from 'lab4/demo/SimplePage';
import TestHelper from 'lab4/demo/TestHelper';

const Button = requireComp('com.Button');
const Select = requireComp('com.Select');

const tabData = [
  {
    text: '000111222333444555666777888999',
    activeImage: 'http://7xo7rx.com2.z0.glb.qiniucdn.com/2015-12-25_567c974ed13db.jpg',
    image: 'http://img3.3lian.com/2013/v10/4/87.jpg',
    value: '1-1',
  },
  {
    text: '111',
    activeImage: 'http://7xo7rx.com2.z0.glb.qiniucdn.com/2015-12-25_567c974ed13db.jpg',
    image: 'http://img3.3lian.com/2013/v10/4/87.jpg',
    value: '1-2',
  },
  {
    text: '222',
    activeImage: 'http://7xo7rx.com2.z0.glb.qiniucdn.com/2015-12-25_567c974ed13db.jpg',
    image: 'http://img3.3lian.com/2013/v10/4/87.jpg',
    value: '1-3',
  },
  {
    text: '333',
    activeImage: 'http://7xo7rx.com2.z0.glb.qiniucdn.com/2015-12-25_567c974ed13db.jpg',
    image: 'http://img3.3lian.com/2013/v10/4/87.jpg',
    value: '1-4',
  },
  {
    text: '444',
    activeImage: 'http://7xo7rx.com2.z0.glb.qiniucdn.com/2015-12-25_567c974ed13db.jpg',
    image: 'http://img3.3lian.com/2013/v10/4/87.jpg',
    value: '1-5',
  },
];
const tabData2 = [
  {
    text: '2-110',
    image: 'http://img3.3lian.com/2013/v10/4/87.jpg',
    activeImage: 'http://7xo7rx.com2.z0.glb.qiniucdn.com/2015-12-25_567c974ed13db.jpg',
    value: '2-1',
  },
  {
    text: '2-331',
    image: 'http://img3.3lian.com/2013/v10/4/87.jpg',
    activeImage: 'http://7xo7rx.com2.z0.glb.qiniucdn.com/2015-12-25_567c974ed13db.jpg',
    value: '2-2',
  },
  {
    text: '2-2ee22',
    image: 'http://img3.3lian.com/2013/v10/4/87.jpg',
    activeImage: 'http://7xo7rx.com2.z0.glb.qiniucdn.com/2015-12-25_567c974ed13db.jpg',
    value: '2-3',
  },
  {
    text: '2-dsf',
    image: 'http://img3.3lian.com/2013/v10/4/87.jpg',
    activeImage: 'http://7xo7rx.com2.z0.glb.qiniucdn.com/2015-12-25_567c974ed13db.jpg',
    value: '2-4',
  },
];

export default class SelectDemo extends SimplePage {
  static contextTypes = {
    ...LAB.Component.componentContextTypes,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      value: 0,
      show: false,
    };
  }

  renderContent() {
    let temp;
    return (
      <View style={styles.container}>
        <Button
          onPress={() => {
            this.setState({ show: !this.state.show });
          }}
        >
          换props数据
        </Button>
        <Button
          onPress={() => {
            console.log(this.refs.select.getValue());
          }}
        >
          输出值
        </Button>
        <Select
          ref="select"
          show={this.state.show}
          defaultText="请选择"
          text={
            this.state.show
              ? tabData[this.state.value >= 0 ? this.state.value : 0] &&
                  tabData[this.state.value >= 0 ? this.state.value : 0].text
              : tabData2[this.state.value >= 0 ? this.state.value : 0] &&
                  tabData2[this.state.value >= 0 ? this.state.value : 0].text
          }
          data={this.state.show ? tabData : tabData2}
          onChange={x => {
            console.log(x);
            this.setState({ value: x });
          }}
          onCancel={() => {
            this.setState({ show: false });
          }}
        >
          {tabData.map((item, i) => {
            return (
              <Select.Item key={i} label={'label ' + i} value={i} />
            );
          })}

        </Select>
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
  popView: {
    flex: 1,
    alignSelf: 'stretch',
    // height:500,
    // width:300,
    backgroundColor: 'red',
  },
  tabView: {
    backgroundColor: 'green',
    flex: 1,
  },
  image: {
    height: 28,
    width: 28,
  },
});
