'use strict';

import React, { 
  Component,
  PropTypes,
} from 'react';
import ReactNative, {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import Button from 'react-native-button';

export default class BaseComponent extends Component {

  constructor(props, context) {
    super(props, context);
    this.log('constructor props=' + props);
  }

  log() {
    var tag = this.constructor.name;
    if(!arguments.length) {
      console.log(tag);
    } else {
      arguments[0] = tag + ' ' + arguments[0]
      console.log.apply(console, arguments);
    }
  }

  componentWillMount() {
    this.log('componentWillMount');
  }

  componentDidMount() {
    this.log('componentDidMount');
  }

  componentWillReceiveProps(nextProps) {
    this.log('componentWillReceiveProps');
  }

  shouldComponentUpdate(nextProps, nextState) {
    this.log('shouldComponentUpdate');
    return true;
  }

  componentWillUpdate(nextProps, nextState) {
    this.log('componentWillUpdate');
  }

  componentDidUpdate(prevProps, prevState) {
    this.log('componentDidUpdate');
  }

  componentWillUnmount() {
    this.log('componentWillUnmount');
  }

  test1() {
    this.log('test1');
  }

  test2() {
    this.log('test2');
  }

  test3() {
    this.log('test3');
  }

  test4() {
    this.log('test4');
  }

  test5() {
    this.log('test5');
  }

  test6() {
    this.log('test6');
  }

  test7() {
    this.log('test7');
  }

  test8() {
    this.log('test8');
  }

  test9() {
    this.log('test9');
  }

  renderBtn(text, onPress, key) {
    return (
      <Button
        key={key}
        style={styles.btn}
        onPress={onPress.bind(this)}>
        {text}
      </Button>
    );
  }

  renderTestBtns(count = 9) {
    var btns = [];
    for(let i = 0; i < count; ++i) {
      btns.push(this.renderBtn('test' + (i + 1), this['test' + (i + 1)], 'k' + i));
    }
    return (
      <View style={styles.btnContainer}>
        {btns}
      </View>
    );
  }

  render() {
    this.log('render');
    const btns = this.renderTestBtns();
    return (
      <View>
        <Text style={styles.title}></Text>
        {btns}
      </View>
    );
  }
}

var styles = StyleSheet.create({
  btnContainer: {
    alignItems: 'center',
  },
  btn: {
    fontSize: 16,
  },
  title: {
    fontSize: 16,
    marginBottom: 10,
  }
});
