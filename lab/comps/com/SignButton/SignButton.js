'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, { StyleSheet, View, Text, Modal } from 'react-native';
import LAB, { requireComp } from 'lab4';

const Touchable = requireComp('com.Touchable');
const Icon = requireComp('com.Icon');

/**
 * 风湿届 签到按钮
 * 
 * @export
 * @class ActionSelectButton
 * @extends {LAB.Component}
 */
export default class ActionSelectButton extends LAB.Component {
  static propTypes = {
    defaultText: PropTypes.string,
  };

  static defaultProps = {
    defaultText: 'No!',
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      showY: false,
      showN: false,
      text: this.props.defaultText,
    };
    this.defaultStyles = styles;
    this.onPress = this.onPress.bind(this);
  }

  render() {
    return (
      <View>
        <Touchable onPress={this.onPress} style={this.getStyle('button')}>
          <Icon name="check-box" size={30} />
          <Text style={this.getStyle('buttonText')}>{this.state.text}</Text>
        </Touchable>
        <Modal transparent={true} animated={true} visible={this.state.showY}>
          <Touchable
            style={this.getStyle('container')}
            onPress={() => {
              this.setState({ showY: false });
            }}
          >
            <View style={this.getStyle('modalY')}>
              <con name="sentiment-satisfied" size={140} color="red" />
              <Text style={this.getStyle('text')}>恭喜您签到成功，获得10个积分！</Text>
              <Text style={this.getStyle('text')}>明天继续努力！</Text>
            </View>
          </Touchable>
        </Modal>
        <Modal transparent={true} animated={true} visible={this.state.showN}>
          <Touchable
            style={this.getStyle('container')}
            onPress={() => {
              this.setState({ showN: false });
            }}
          >
            <View style={this.getStyle('modalY')}>
              <Icon name="sentiment-dissatisfied" size={140} color="red" />
              <Text style={this.getStyle('text')}>啊，签到失败了！</Text>
              <Text style={this.getStyle('text')}>请重新尝试！</Text>
            </View>
          </Touchable>
        </Modal>
      </View>
    );
  }

  onPress() {
    this.setState({ showY: true });
    //这里fetch一个后台数据返回true||false然后判断弹出层并改变state
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  modalY: {
    flex: 1,
    alignItems: 'center',
  },
});
