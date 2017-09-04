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
  TouchableOpacity
} from 'react-native';

import {
  Page,
  requireComp,
} from 'lab4';

import SimplePage from 'lab4/demo/SimplePage';
import TestHelper from 'lab4/demo/TestHelper';
const DropDownMenu = requireComp('com.DropDownMenu');

const data = [
  {
    content: '1',
    children: [
      {
        content: '1-1',
        children:[]
      },
      {
        content: '1-2',
        children:[]
      },
      {
        content: '1-3',
        children:[]
      },
      {
        content: '1-4',
        children:[]
      },
      {
        content: '1-5',
        children:[]
      },
      {
        content: '1-6',
        children:[]
      },
      {
        content: '1-7',
        children:[]
      },
      {
        content: '1-8',
        children:[]
      },
    ]
  },
  {
    content: '2',
    children: []
  },
  {
    content: '3',
    children: [
      {
        content: '3-1',
        children:[]
      },
      {
        content: '3-2',
        children:[]
      },
      {
        content: '3-3',
        children:[]
      },
    ]
  },
  {
    content: '4',
    children: []
  },
  {
    content: '5',
    children: []
  },
  {
    content: '6',
    children: []
  },
  {
    content: '7',
    children: []
  },
];
export default class DropDownMenuDemo extends SimplePage {

  constructor(props, context) {
    super(props, context);
    this.state = {
      levels: 2
    };
  }

  test1() {
    this.setState({
      levels: 1,
    })
  }

  test2() {
    this.setState({
      levels: 2,
    })
  }

  test3() {
    this.setState({
      levels: 3,
    })
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

  renderContent() {
    return (
      <View>
        <DropDownMenu
          levelData={data}
          levels={this.state.levels}
          onSelect={(data, indexs, selected) => { console.log(indexs);console.log(selected)}}
          menuHeight={200}
          ref={"gdm"}
          levelWeights={[1, 1.6]}
          intialIndex={[2, -2]}
          style_class='default,default1'
        />
        <TouchableOpacity onPress={() => {this.refs["gdm"].refs["_ddm"]._renderSelectedMenu();}}
          style={styles.button}>
          <View>
            <Text>render selected</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {this.refs["gdm"].refs["_ddm"]._scroll();}}
          style={styles.button}>
          <View>
            <Text>scroll to selected</Text>
          </View>
        </TouchableOpacity>
        {this.renderTestBtns()}
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
  button: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderColor: '#437ef1',
    borderWidth: 1,
    borderStyle: 'solid',
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 5,
  }
});
