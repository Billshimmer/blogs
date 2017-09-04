'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, {
  StyleSheet,
  View,
  Text,
  Modal,
  Platform,
  DatePickerIOS,
  DatePickerAndroid,
  TimePickerAndroid,
} from 'react-native';
import LAB, { requireComp } from 'lab4';

const Touchable = requireComp('com.Touchable');

const timeH = [];
for (let i = 0; i < 12; i++) timeH.push(i);
const timeM = [];
for (let i = 0; i < 60; i++) timeM.push(i);

/**
 * 日期选择组件
 * 
 * @export
 * @class DatePick
 * @extends {LAB.Component}
 */
export default class DatePick extends LAB.Component {
  static propTypes = {
    mode: PropTypes.oneOf(['date', 'time', 'datetime']),
    cancelText: PropTypes.string,
    confirmText: PropTypes.string,
  };
  static defaultProps = {
    mode: 'time',
    cancelText: '取消',
    confirmText: '确认',
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      date: this.props.date || new Date(),
      show: this.props.show,
    };
    this.defaultStyles = styles;
    this.onSelect = this.onSelect.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    if (Platform.OS == 'android') {
      nextProps.show && !this.props.show && this.showPicker();
      return true;
    } else {
      return true;
    }
  }

  render() {
    if (Platform.OS == 'ios') {
      return (
        <Modal
          visible={this.props.show}
          transparent={true}
          animationType="slide"
        >
          <Touchable
            onPress={this.onCancel}
            style={this.getStyle('cancelView')}
          />
          <View style={this.getStyle('buttonView')}>
            <Touchable style={this.getStyle('button')} onPress={this.onCancel}>
              <Text style={this.getStyle('buttonText')}>
                {this.props.cancelText}
              </Text>
            </Touchable>
            <Touchable style={this.getStyle('button')} onPress={this.onSelect}>
              <Text style={this.getStyle('buttonText')}>
                {this.props.confirmText}
              </Text>
            </Touchable>
          </View>
          <DatePickerIOS
            date={this.state.date}
            mode={this.props.mode}
            maximumDate={
              this.props.mode == 'date' ? this.props.maximumDate : null
            }
            minimumDate={
              this.props.mode == 'date' ? this.props.minimumDate : null
            }
            onDateChange={date => {
              this.onDateChange(date);
            }}
            timeZoneOffsetInMinutes={-1 * new Date().getTimezoneOffset()}
            minuteInterval={1}
            style={{ backgroundColor: 'white' }}
          />
        </Modal>
      );
    } else if (Platform.OS == 'android') {
      return null;
    } else {
      return null;
    }
  }

  onDateChange(date) {
    this.setState({ date: date });
  }
  onCancel() {
    this.props.onCancel && this.props.onCancel();
  }
  onSelect() {
    this.props.onCancel && this.props.onCancel();
    this.props.onSelect && this.props.onSelect(this.state.date);
  }
  //安卓情况下弹出日期选择
  showPicker() {
    if (this.props.mode == 'date') {
      try {
        DatePickerAndroid.open({
          date: this.state.date,
          maxDate: this.props.maximumDate,
          minDate: this.props.minimumDate,
        }).then(e => {
          if (e.action !== DatePickerAndroid.dismissedAction) {
            let date = new Date(e.year, e.month, e.day);
            this.setState({
              date: date,
              show: false,
            });
            this.props.onCancel && this.props.onCancel();
            this.props.onSelect && this.props.onSelect(date);
          } else {
            this.props.onCancel && this.props.onCancel();
          }
        });
      } catch ({ code, message }) {
        console.warn('Cannot open date picker', message);
      }
    } else if (this.props.mode == 'time') {
      try {
        TimePickerAndroid.open({
          hour: this.state.date.getHours(),
          minute: this.state.date.getMinutes(),
        }).then(e => {
          if (e.action !== TimePickerAndroid.dismissedAction) {
            let temp = new Date();
            let date = new Date(
              temp.getFullYear(),
              temp.getMonth(),
              temp.getDate(),
              e.hour,
              e.minute
            );
            this.setState({
              date: date,
              show: false,
            });
            this.props.onCancel && this.props.onCancel();
            this.props.onSelect && this.props.onSelect(date);
          } else {
            this.props.onCancel && this.props.onCancel();
          }
        });
      } catch ({ code, message }) {
        console.warn('Cannot open date picker', message);
      }
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelView: {
    flex: 1,
    alignSelf: 'stretch',
  },
});
