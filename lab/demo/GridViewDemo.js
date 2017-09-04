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
  requireComp,
} from 'lab4';

import SimplePage from 'lab4/demo/SimplePage';
import TestHelper from 'lab4/demo/TestHelper';
const GridView = requireComp('com.GridView');

const demoData = [
  {
    title: 'item1',
    content: '第一项',
    uri: 'http://7xo7rx.com2.z0.glb.qiniucdn.com/2015-12-25_567c974ed13db.jpg',
  },
  {
    title: 'item2',
    content: '第二项',
    uri: 'http://7xo7rx.com2.z0.glb.qiniucdn.com/2015-12-25_567c974ed13db.jpg',
  },
  {
    title: 'item3',
    content: '第三项',
    uri: 'http://7xo7rx.com2.z0.glb.qiniucdn.com/2015-12-25_567c974ed13db.jpg',
  },
  {
    title: 'item4',
    content: '第四项',
    uri: 'http://7xo7rx.com2.z0.glb.qiniucdn.com/2015-12-25_567c974ed13db.jpg',
  },
  {
    title: 'item5',
    content: '第五项',
    uri: 'http://7xo7rx.com2.z0.glb.qiniucdn.com/2015-12-25_567c974ed13db.jpg',
  },
];
export default class GridViewDemo extends SimplePage {

  constructor(props, context) {
    super(props, context);
    this.state = {
      columns: 2
    };
  }

  test1() {
    this.setState({
      columns: 3
    })
  }

  test2() {
  }

  test3() {
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

  renderItem(item) {
    return (
      <View style={styles.item}>
        <Text>{item.title}</Text>
        <Text>{item.content}</Text>
      </View>
    );
  }

  renderContent() {
    return (
      <ScrollView>
        <Text style={styles.title}>无内边框，默认2列</Text>
        <GridView item={TestView_2}
        items={demoData}/>
        <Text style={styles.title}>有内边框，默认2列</Text>
        <GridView item={TestView_2}
        items={demoData}
        showGridInnerBorder={true}
        />
        <Text style={styles.title}>有内边框，4列</Text>
        <GridView item={TestView_2}
        items={demoData}
        showGridInnerBorder={true}
        columns={4}
        />
        <Text style={styles.title}>有内边框，4列，自定义内边框样式</Text>
        <GridView item={TestView_2}
        items={demoData}
        showGridInnerBorder={true}
        columns={4.2}
        gridBorderStyle={{borderWidth: 2, borderColor: '#4878e4'}}
        />
        <Text style={styles.title}>有内边框，4列，自定义内边框样式，自定义项的宽高比</Text>
        <GridView item={TestView}
        items={demoData}
        showGridInnerBorder={true}
        columns={4}
        gridBorderStyle={{borderWidth: 2, borderColor: '#4878e4'}}
        whRatio={2}
        />
        {this.renderTestBtns()}
      </ScrollView>
    );
  }
}

class TestView extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <View style={styles.item}>
        <Image source={{uri: this.props.uri}} style={{flex: 1}}/>
      </View>
    );
  }
}
class TestView_2 extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <Image source={{uri: this.props.uri}} style={{flex: 1, height: 100}}/>
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
  item: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    paddingVertical: 20,
  }
});
