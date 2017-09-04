'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Modal,
} from 'react-native';
import LAB, { requireComp } from 'lab4';

const Button = requireComp('com.Button');

export default class BasicModal extends LAB.Component {
  static propTypes = {
    title: PropTypes.string,
    message: PropTypes.string,
    content: PropTypes.object,
    buttons: PropTypes.array.isRequired,
    radius: PropTypes.number,
  };

  static defaultProps = {
    radius: 5,
  };

  constructor(props, context) {
    super(props, context);
  }

  _renderButtons() {
    let length = this.props.buttons.length;
    let radius = {};
    let buttons = this.props.buttons.map((button, index) => {
      if (length == 1) {
        radius = {
          borderBottomLeftRadius: this.props.radius,
          borderBottomRightRadius: this.props.radius,
        };
      } else if (index == 0) {
        radius = {
          borderBottomLeftRadius: this.props.radius,
        };
      } else if (index == length - 1) {
        radius = {
          borderBottomRightRadius: this.props.radius,
        };
      }

      return (
        <Button
          style={[button.btnStyle, raidus]}
          onPress={() => {
            this.props.onPress();
          }}
        >
          {button.text}
        </Button>
      );
    });
  }

  render() {
    let buttons = this._renderButtons();
    if (this.props.content) {
      return (
        <Modal {...this.props}>
          <View style={[this.getStyle('container')]}>
            <View
              style={[
                this.getStyle('box'),
                { borderRadius: this.props.radius },
              ]}
            >
              <View style={[this.getStyle('content')]}>
                {this.props.content}
              </View>
              <View style={[this.getStyle('buttonContainer')]} />
            </View>
          </View>
        </Modal>
      );
    }
    return <Modal />;
  }
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  box: {
    marginLeft: 20,
    marginRight: 20,
    backgroundColor: '#fff',
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 25,
  },
  buttonContainer: {
    height: 20,
  },
});
