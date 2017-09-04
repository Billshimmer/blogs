'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
} from 'react-native';
import LAB, { Page, http, Toast, requireComp } from 'lab4';

const Button = requireComp('com.Button');

export default class Recommendation extends LAB.Component {
  static propTypes = {
    btnText: PropTypes.string, //按钮文本
    placeholder: PropTypes.string, //提示文本
    submitUrl: PropTypes.string,
    data: PropTypes.object, //原样返回额外字段
    scrollEnabled: PropTypes.bool,
  };

  static defaultProps = {
    placeholder: '使用过程中有任何的问题或者建议，请给我们留言',
    btnText: '提交反馈',
    btnClass: 'default',
    scrollEnabled: false,
  };

  static contextTypes = {
    ...LAB.Component.componentContextTypes,
    popup: PropTypes.object,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      text: '',
    };
    this.defaultStyles = styles;
    this.onAdd = this.onAdd.bind(this);
  }

  // componentDidMount() {}

  render() {
    return (
      <View style={this.getStyle('container')}>
        <ScrollView
          style={this.getStyle('main')}
          scrollEnabled={this.props.scrollEnabled}
        >
          <TextInput
            style={this.getStyle('textInput')}
            autoCapitalize="none"
            multiline={true}
            onChangeText={text => this.onChangeText(text)}
            placeholder={this.props.placeholder}
            underlineColorAndroid="transparent"
          />
        </ScrollView>
        <Button
          children={this.props.btnText}
          onPress={this.onAdd}
          style_class={this.props.btnClass}
        />
      </View>
    );
  }

  onChangeText(text) {
    this.setState({ text: text });
  }

  onAdd() {
    // console.log({
    //   ...this.props.data,
    //   content: this.state.text,
    // });
    if (this.state.text != '') {
      http
        .post(this.props.submitUrl, {
          data: {
            ...this.props.data,
            content: this.state.text,
          },
        })
        .then(response => {
          // console.log(response);
          if (response.CODE == 'ok') {
            Toast.show('提交成功');
            this.onPop();
            this.setState({ text: '' });
          } else {
            this.context.popup.alert({
              message: response.MESSAGE.toString(),
              buttons: [
                {
                  text: '确定',
                },
              ],
            });
          }

          //用popup
        })
        .catch(error => {
          this.context.popup.alert({
            message: '请求超时',
            buttons: [
              {
                text: '确定',
              },
            ],
          });
          console.warn(error);
        });
    } else {
      this.context.popup.alert({
        message: '请输入内容',
        buttons: [
          {
            text: '确定',
          },
        ],
      });
    }
  }
  
  onPop() {
    this.context.router.pop();
  }
}

const styles = StyleSheet.create({});
