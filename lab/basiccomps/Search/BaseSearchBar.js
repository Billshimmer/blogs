'use strict';

import React, {
  Component,
  PropTypes,
} from 'react';
import ReactNative, {
  StyleSheet,
  View,
  TextInput,
  Platform,
} from 'react-native';

import LAB from 'lab4';
import EventConstants from 'lab4/core/EventConstants';
var isIOS = Platform.OS == 'ios';

export default class BaseSearchBar extends LAB.Component  {

  static propTypes = {
    defaultValue: PropTypes.string,
    placeholder: PropTypes.string,
    enableIOSClearBtn: PropTypes.bool, //是否使用ios自带的清除按钮
  };

  // static defaultProps = {
  // };

  static contextTypes = {
    emitter: PropTypes.object,
  };

  constructor(props, context) {
    super(props, context);
    this._text = props.defaultValue || '';
    this.state = {
      showClearBtn: !!this._text,
      value:''
    };
    this._setTextInputRef = this._setTextInputRef.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
    this.onSubmitEditing = this.onSubmitEditing.bind(this);
    this.onClearPress = this.onClearPress.bind(this);
  }

  componentDidMount() {
    this.context.emitter.on(EventConstants.SEARCH_SET_TEXT, this._searchSetText, this);
  }

  componentWillReceiveProps(nextProps) {
    //不考虑defaultValue改变
  }

  componentWillUnmount() {
    this.context.emitter.offByTag(this);
  }

  _searchSetText(e, text) {
    if(text == this._text) {
      return;
    }
    if(this._textInput) {
      if (Platform.OS === 'web' ) {
        this._textInput.setNativeProps({
          text,
        });
      } else {
        this._textInput.refs.input && this._textInput.refs.input.setNativeProps({
          text,
        });
      }
      this.onChangeText(text);
    }
  }

  _setTextInputRef(ref) {
    this._textInput = ref;
  }

  onChangeText(text) {
    this._text = text;
    this.context.emitter.emit(EventConstants.SEARCH_TEXT_CHANGE, this, text);
    if(text) {
      if(!this.state.showClearBtn) {
        this.setState({
          showClearBtn: true
        });
      }
    } else {
      if(this.state.showClearBtn) {
        this.setState({
          showClearBtn: false
        });
      }
    }
    this.setState({
      value:text
    });
  }

  onSubmitEditing() {
    this.context.emitter.emit(EventConstants.SEARCH_SUBMIT, this, this._text);
  }

  onClearPress() {
    if(this._textInput) {
      this._textInput.clear();
      //0.21.0测试 调用TextInput clear 不会触发onChangeText
      this.onChangeText('');
    }
  }

  renderTextInput() {
    let textInput = this.onRenderTextInput(isIOS);
    let clearButtonMode;
    if(isIOS && this.props.enableIOSClearBtn) {
      clearButtonMode = 'always';
    }
    return React.cloneElement(textInput, {
      ref: this._setTextInputRef,
      defaultValue: this.props.defaultValue,
      placeholder: this.props.placeholder,
      onChangeText: this.onChangeText,
      onSubmitEditing: this.onSubmitEditing,
      underlineColorAndroid:'transparent',
      clearButtonMode,
    });
  }

  // onRenderTextInput() {
  // }

  renderClearBtn() {
    if(isIOS && this.props.enableIOSClearBtn) {
      return null;
    }
    if(!this.state.showClearBtn) {
      return null;
    }
    let clearBtn = this.onRenderClearBtn();
    if(clearBtn) {
      return React.cloneElement(clearBtn, {
        onPress: this.onClearPress,
      });
    }
  }

  onRenderClearBtn(isIOS) {

  }
}
