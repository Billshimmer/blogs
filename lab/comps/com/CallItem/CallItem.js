'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, {
  StyleSheet,
  View,
  Text,
  ScrollView,
  ListView,
  Linking,
} from 'react-native';
import LAB, { requireComp } from 'lab4';

const Touchable = requireComp('com.Touchable');
const Image = requireComp('com.Image');
const Icon = requireComp('com.Icon');


/**
 * 打电话列表项 一整行可点击
 * 
 * @export
 * @class CallItem
 * @extends {LAB.Component}
 */
export default class CallItem extends LAB.Component {
  static propTypes = {
    number: PropTypes.string,
    text: PropTypes.string,
    icon: PropTypes.string,
    image: PropTypes.string,
  };

  // static defaultProps = {};

  static contextTypes = {
    ...LAB.Component.componentContextTypes,
    popup: PropTypes.object,
  };

  constructor(props, context) {
    super(props, context);
    // this.state = {};
    this.defaultStyles = styles;
    this._onPress = this._onPress.bind(this);
  }

  _onPress() {
    this.context.popup.confirm({
      message: this.props.number,
      buttons: [
        {
          text: '取消',
        },
        {
          text: '拨打',
          onPress: () => {
            if (this.props.number) {
              let url = 'tel:' + this.props.number;
              Linking.canOpenURL(url).then(supported => {
                if (supported) {
                  Linking.openURL(url);
                }
              });
            }
          },
        },
      ],
    });
  }

  render() {
    return (
      <Touchable onPress={this._onPress} style={this.getStyle('container')}>
        <View style={this.getStyle('containerLeft')}>
          {this.props.image
            ? <Image uri={this.props.image} style={this.getStyle('image')} />
            : null}
          {this.props.icon && !this.props.image
            ? <Icon name={this.props.icon} style={this.getStyle('icon')} />
            : null}
          {this.props.text
            ? <Text style={this.getStyle('text')}>{this.props.text}</Text>
            : null}
        </View>
        <Icon name="chevron-right" style={this.getStyle('rightIcon')} />
      </Touchable>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  containerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
