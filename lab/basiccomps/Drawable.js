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

export default class ComponentTPL extends Component {

  /// 定义静态属性
  static propTypes = {
  };

  static defaultProps = {
  };

  static contextTypes = {
  };

  static childContextTypes = {
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
    };

    /// ref设置函数
    // this._setXXXRef = (ref) => {
    //   this._xxx = ref;
    // };
  }

  /// 按顺序排列的生命周期函数
  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
  }

  componentWillUnmount() {
  }

  // render
  render() {
    return (
      <View style={styles.container}>
        <Text>SimpleComp</Text>
      </View>
    );
  }

  // _renderXXX() {

  // }

  /// 对外共有方法
}

const styles = StyleSheet.create({
  container: {

  },
});
