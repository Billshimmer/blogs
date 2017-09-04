'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, { StyleSheet, Text, View } from 'react-native';
import LAB, { requireComp } from 'lab4';
import BasicDialog from 'lab4/core/BasicDialog';

const Button = requireComp('com.Button');

export default class Dialog extends BasicDialog {
  static propTypes = {
    title: PropTypes.string,
    message: PropTypes.string,
    buttons: PropTypes.arrayOf(
      PropTypes.shape({
        text: PropTypes.string.isRequired,
        onPress: PropTypes.func,
        styleClass: PropTypes.string, // TODO
      })
    ).isRequired,
    titleStyle: Text.propTypes.style,
    messageStyle: Text.propTypes.style,
    contentView: PropTypes.object,
  };

  // static defaultProps = {
  // };

  // static contextTypes = {
  //   popup: PropTypes.object,
  // };

  constructor(props, context) {
    super(props, context);
  }

  _renderContent() {
    if (this.props.contentVie) {
      return LAB.render(this.props.contentView);
    }
    if (this.props.message) {
      return (
        <Text style={[this.getStyle('message'), this.props.messageStyle]}>
          {this.props.message}
        </Text>
      );
    }
  }

  render() {
    const styleDialog = StyleSheet.flatten([
      this.getStyle('dialog'),
      this.props.style,
    ]);
    const styleBtnContainer = StyleSheet.flatten(this.getStyle('btnContainer'));

    const buttonsArr = [];
    const buttons = this.props.buttons;
    let button;
    for (let i = 0, len = buttons.length; i < len; ++i) {
      button = buttons[i];
      let buttonStyle = [this.getStyle('button')];
      if (i === 0) {
        buttonStyle.push({ borderBottomLeftRadius: styleDialog.borderRadius });
      } else if (len > 1) {
        buttonsArr.push(
          <View
            key={'l-' + i}
            style={[
              styles.line,
              { backgroundColor: styleBtnContainer.borderColor },
            ]}
          />
        );
      }
      if (i === len - 1) {
        buttonStyle.push({ borderBottomRightRadius: styleDialog.borderRadius });
      }
      let styleClass = 'dialog-button-default';
      if (button.styleClass) {
        styleClass = 'dialog-button-' + button.styleClass;
      }
      buttonsArr.push(
        <Button
          key={'b-' + i}
          {...button}
          style={buttonStyle}
          style_class={styleClass}
        >
          {button.text}
        </Button>
      );
    }

    return (
      <View style={styleDialog}>
        <View
          style={styles.content}
          onStartShouldSetResponderCapture={() => {
            return true;
          }}
        >
          {this.props.title &&
            <Text style={[this.getStyle('title'), this.props.titleStyle]}>
              {this.props.title}
            </Text>}
          {this._renderContent()}
        </View>
        <View style={styleBtnContainer}>{buttonsArr}</View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  dialog: {
    marginLeft: 50,
    marginRight: 50,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
  content: {
    paddingLeft: 20,
    paddingTop: 20,
    paddingRight: 20,
    paddingBottom: 20,
  },
  title: {
    textAlign: 'center',
  },
  message: {
    marginTop: 5,
    textAlign: 'center',
  },
  btnContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#FFF',
    backgroundColor: 'transparent',
  },
  button: {
    // padding: 0,
    flex: 1,
    borderWidth: 0,
    borderRadius: 0,
    backgroundColor: 'transparent',
  },
  lineButton: {
    flex: 1,
    flexDirection: 'row',
  },
  line: {
    width: 1,
  },
});
Dialog.defaultStyles = styles;
