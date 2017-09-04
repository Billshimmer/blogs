'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, {
  AppRegistry,
  StyleSheet,
  View,
  Text,
  Dimensions,
} from 'react-native';
import LAB, { requireComp, CommonStyle } from 'lab4';

const Touchable = requireComp('com.Touchable');
const Icon = requireComp('com.Icon');

const windowWidth = Dimensions.get('window').width;

/**
 * 提供一个按钮，基于Touchable，点击后根据模式弹出popup，提供一个 view 在 Touchable 之下
 * 一般用于下拉菜单
 * 
 * @export
 * @class Dropdown
 * @extends {LAB.Component}
 */
export default class Dropdown extends LAB.Component {
  static propTypes = {
    type: PropTypes.oneOf(['left', 'mid', 'right', 'none']),
    text: PropTypes.string,
    icon: PropTypes.string,
    iconRight: PropTypes.string,
    activeOpacity: PropTypes.number,
  };
  static defaultProps = {
    type: 'mid',
    activeOpacity: 0.9,
  };

  static contextTypes = {
    ...LAB.Component.componentContextTypes,
    appPopup: PropTypes.object,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      layout: undefined,
    };
    this.defaultStyles = styles;
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    this._setButtonRef = ref => {
      this.button = ref;
    };
  }

  render() {
    return (
      <Touchable
        onPress={this.show}
        activeOpacity={this.props.activeOpacity}
        style={this.getStyle('button')}
      >
        <View
          collapsable={false}
          ref={this._setButtonRef}
          style={this.getStyle('container')}
        >
          {this.props.icon
            ? <Icon name={this.props.icon} style={this.getStyle('icon')} />
            : null}
          <Text style={this.getStyle('text')}>{this.props.text}</Text>
          {this.props.iconRight
            ? <Icon
                name={this.props.iconRight}
                style={this.getStyle('iconRight')}
              />
            : null}
        </View>
      </Touchable>
    );
  }

  hide() {
    this.context.popup.hide();
  }

  show() {
    this.button.measure((x, y, width, height, pageX, pageY) => {
      let position = {
        alignSelf: this.props.type == 'right'
          ? 'flex-end'
          : this.props.type == 'left' ? 'flex-start' : undefined,
        marginTop: pageY + height,
        marginLeft: this.props.type == 'left' || this.props.type == 'mid'
          ? pageX
          : undefined,
        width: this.props.type == 'mid' ? width : undefined,
        marginRight: this.props.type == 'right'
          ? windowWidth - pageX - width
          : undefined,
      };
      this.context.popup.addView({
        showMask: false,
        component: (
          <View style={CommonStyle.flex1}>
            <View style={[this.getStyle('itemsView'), position]}>
              {this.props.children}
            </View>
          </View>
        ),
        onMaskPress: () => {
          this.context.popup.hide();
        },
      });
    });
  }
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  // text: {},
  // icon: {},
  // iconRight: {},
  // itemsView: {},
});
