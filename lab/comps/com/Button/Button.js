'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, {
  StyleSheet,
  Platform,
  Animated,
  View,
  Text,
  TouchableHighlight,
  TouchableNativeFeedback,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import normalizeColor from 'react-native/Libraries/StyleSheet/normalizeColor';
import LAB, { utils } from 'lab4';
import LinkEmitAble from 'lab4/basiccomps/LinkEmitAble';

const flattenStyle = StyleSheet.flatten;

const useTouchableNativeFeedback = Platform.OS == 'android' && Platform.Version >= 21;
const useForeground = Platform.OS === 'android' && Platform.Version >= 23;

const colorMatrix = [
  0.8, 0, 0, 0,
  0, 0, 0.8, 0,
  0, 0, 0, 0,
  0.8, 0, 0, 0,
  0, 0, 0.8, 0,
];

const NORMAL_WRAPPER_TEXT_ACTIVE_PROPS = {
  style: {
    opacity: 0.85,
  },
};
const NORMAL_WRAPPER_TEXT_INACTIVE_PROPS = {
  style: {
    opacity: 1,
  },
};

function needWrapperText(children) {
  if (typeof children == 'string') {
    return true;
  }

  if (Array.isArray(children)) {
    let hasString = false;
    React.Children.forEach(children, child => {
      if (typeof child == 'string') {
        hasString = true;
      }
    });
    return hasString;
  }

  return false;
}

function correctColor(color) {
  return color < 0 ? 0 : color > 255 ? 255 : color;
}

/**
 * 计算高亮时的背景颜色
 */
function calBackgroundColor(backgroundColor) {
  const startBackgroundColor = normalizeColor(backgroundColor || '#FFFFFF');
  let r = (startBackgroundColor >>> 24) & 0xff;
  let g = (startBackgroundColor >>> 16) & 0xff;
  let b = (startBackgroundColor >>> 8) & 0xff;
  let a = startBackgroundColor & 0xff;

  r =
    colorMatrix[0] * r +
    colorMatrix[1] * g +
    colorMatrix[2] * b +
    colorMatrix[3] * a +
    colorMatrix[4];
  g =
    colorMatrix[5] * r +
    colorMatrix[6] * g +
    colorMatrix[7] * b +
    colorMatrix[8] * a +
    colorMatrix[9];
  b =
    colorMatrix[10] * r +
    colorMatrix[11] * g +
    colorMatrix[12] * b +
    colorMatrix[13] * a +
    colorMatrix[14];
  a =
    colorMatrix[15] * r +
    colorMatrix[16] * g +
    colorMatrix[17] * b +
    colorMatrix[18] * a +
    colorMatrix[19];

  r = correctColor(r) >>> 0;
  g = correctColor(g) >>> 0;
  b = correctColor(b) >>> 0;
  a = correctColor(a) >>> 0;

  return ((r << 24) | (g << 16) | (b << 8) | a) >>> 0;
}

/**
 * TODO 
 * 1. IOS native实现TouchableNativeFeedback
 * 2. disabled 增加一层遮罩?
 */
export default class Button extends LAB.PureComponent {
  static propTypes = {
    textStyle: Text.propTypes.style,
    // buttonActiveStyle textActiveStyle 只对outline模式有效
    buttonActiveStyle: View.propTypes.style,
    textActiveStyle: Text.propTypes.style,
    type: PropTypes.oneOf(['outline', 'normal']),
    disabled: PropTypes.bool,
  };

  static defaultProps = {
    type: 'normal',
  };

  constructor(props, context) {
    super(props, context);
    this._initProps(props);

    this._onPress = this._onPress.bind(this);
    this._onPressIn = this._onPressIn.bind(this);
    this._onPressOut = this._onPressOut.bind(this);
    this._onInactive = this._onInactive.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this._initProps(nextProps);
  }
  
  componentWillUnmount() {
    if (this._hideTimeout) {
      clearTimeout(this._hideTimeout);
    }
  }

  _initProps(props) {
    this._needWrapperText = needWrapperText(props.children);

    this._buttonStyle = flattenStyle([/*useTouchableNativeFeedback && props.type !== 'outline' && styles.buttonShadow, */this.getStyle('button'), props.style]);
    this._textStyle = flattenStyle([this.getStyle('text'), props.textStyle]);

    if (props.type === 'outline') {
      this._buttonActiveProps = {
        style: flattenStyle([
          this.getStyle('buttonActive'),
          props.buttonActiveStyle,
        ]),
      };
      // TODO 通过setNativeProps可能无法恢复部分属性
      this._buttonInactiveProps = {
        style: this._buttonStyle,
      };

      this._textActiveProps = {
        style: flattenStyle([
          this.getStyle('textActive'),
          props.textActiveStyle,
        ]),
      };
      this._textInactiveProps = {
        style: this._textStyle,
      };
    } else if (!useTouchableNativeFeedback && Platform.OS !== 'web') {
      const activeBackgroundColor = calBackgroundColor(this._buttonStyle.backgroundColor);
      this._buttonActiveProps = {
        style: {
          backgroundColor: activeBackgroundColor,
        },
      };
      this._buttonInactiveProps = {
        style: {
          backgroundColor: this._buttonStyle.backgroundColor || 'transparent',
        },
      };
      this._textActiveProps = NORMAL_WRAPPER_TEXT_ACTIVE_PROPS;
      this._textInactiveProps = NORMAL_WRAPPER_TEXT_INACTIVE_PROPS;
    }
  }

  _onPressIn(e) {
    clearTimeout(this._hideTimeout);
    this._hideTimeout = null;
    this._onActive();

    this.props.onPressIn && this.props.onPressIn(e);
  }

  _onPressOut() {
    if (!this._hideTimeout) {
      this._onInactive();
    }

    this.props.onPressOut && this.props.onPressOut(e);
  }

  _onPress(e) {
    if (!useTouchableNativeFeedback && Platform.OS !== 'web') {
      clearTimeout(this._hideTimeout);
      this._onActive();
      this._hideTimeout = setTimeout(this._onInactive, 100);
    }
    if (this.props.onPress && (this.props.onPress(e) === false)) {
      // onPress 返回false 可阻止handleLinkEmitAction
      // TODO 参考web 使用preventDefault
      return;
    }
    this.handleLinkEmitAction();
  }

  _onActive() {
    if (!this.isMounted()) {
      return;
    }

    this.refs.button && this.refs.button.setNativeProps(this._buttonActiveProps);
    this.refs.wrapperText && this.refs.wrapperText.setNativeProps(this._textActiveProps);
  }

  _onInactive() {
    this.refs.button && this.refs.button.setNativeProps(this._buttonInactiveProps);
    this.refs.wrapperText && this.refs.wrapperText.setNativeProps(this._textInactiveProps);
  }

  _renderInner() {
    if (this._needWrapperText) {
      return (
        <Text ref="wrapperText" style={this._textStyle} numberOfLines={1}>
          {this.props.children}
        </Text>
      );
    }
    return this.props.children;
  }

  render() {
    const props = this.props;
    let buttonStyle = this._buttonStyle;
    if (props.disabled) {
      buttonStyle = [this._buttonStyle, this.getStyle('disabled')];
    }

    if (useTouchableNativeFeedback && this.props.type !== 'outline') {
      return (
        <TouchableNativeFeedback
          onPress={this._onPress}
          onPressIn={props.onPressIn}
          onPressOut={props.onPressOut}
          onLongPress={props.onLongPress}
          useForeground={useForeground}
          disabled={props.disabled}
        >
          <View style={buttonStyle}>
            {this.props.left && LAB.render(this.props.left)}
            {this._renderInner()}
            {this.props.right && LAB.render(this.props.right)}
          </View>
        </TouchableNativeFeedback>
      );
    } else if (Platform.OS === 'web') {
      return (
        <TouchableOpacity
          onPress={this._onPress}
          onPressIn={this.props.onPressIn}
          onPressOut={this.props.onPressIn}
          onLongPress={this.props.onLongPress}
          style={buttonStyle}
          disabled={props.disabled}
        >
          {this.props.left && LAB.render(this.props.left)}
          {this._renderInner()}
          {this.props.right && LAB.render(this.props.right)}
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableWithoutFeedback
          onPress={this._onPress}
          onPressIn={this._onPressIn}
          onPressOut={this._onPressOut}
          onLongPress={this.props.onLongPress}
          disabled={props.disabled}
        >
          <View ref="button" style={buttonStyle}>
            {this.props.left && LAB.render(this.props.left)}
            {this._renderInner()}
            {this.props.right && LAB.render(this.props.right)}
          </View>
        </TouchableWithoutFeedback>
      );
    }
  }
}

LinkEmitAble.enhance(Button);

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 12,
    paddingRight: 12,
    backgroundColor: '#ECF0F1',
    // elevation: 4,
  },
  text: {
    fontSize: 14,
    color: '#000',
  },
  textActive: {
    color: '#FFFFFF',
  },
  disabled: {
    opacity: 0.65,
  },
});

Button.defaultStyles = styles;
