'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, { View, Text, StyleSheet } from 'react-native';
import LAB from 'lab4';

// Generic Countdown Timer UI component
//
// https://github.com/uken/react-countdown-timer
//
// props:
//   - initialTimeRemaining: Number
//       The time remaining for the countdown (in ms).
//
//   - interval: Number (optional -- default: 1000ms)
//       The time between timer ticks (in ms).
//
//   - formatFunc(timeRemaining): Function (optional)
//
//   - tickCallback(timeRemaining): Function (optional)
//       A function to call each tick.
//
//   - completeCallback(): Function (optional)
//       A function to call when the countdown completes.
//

/**
 * 倒计时组件
 * 
 * @export
 * @class Countdown
 * @extends {LAB.Component}
 */
export default class Countdown extends LAB.Component {

  static propTypes = {
    initialTimeRemaining: PropTypes.number.isRequired,
    interval: PropTypes.number,
    formatFunc: PropTypes.func,
    tickCallback: PropTypes.func,
    completeCallback: PropTypes.func,
    description: PropTypes.string,
    renderContent: PropTypes.func,
  };

  static defaultProps = {
    interval: 1000,
    formatFunc: null,
    tickCallback: null,
    completeCallback: null,
  };

  constructor(props, context) {
    super(props, context);
    this.defaultStyles = styles;
    this.state = {
      timeRemaining: this.props.initialTimeRemaining,
      timeoutId: null,
      prevTime: null,
    };
  }

  componentDidMount() {
    this.tick();
  }

  componentWillReceiveProps(newProps) {
    if (this.state.timeoutId) {
      clearTimeout(this.state.timeoutId);
    }
    this.setState({
      prevTime: null,
      timeRemaining: newProps.initialTimeRemaining,
    });
  }

  componentDidUpdate() {
    if (
      !this.state.prevTime &&
      this.state.timeRemaining > 0 &&
      this.isMounted()
    ) {
      this.tick();
    }
  }

  componentWillUnmount() {
    clearTimeout(this.state.timeoutId);
  }

  tick() {
    let currentTime = Date.now();
    let dt = this.state.prevTime ? currentTime - this.state.prevTime : 0;
    let interval = this.props.interval;

    // correct for small variations in actual timeout time
    let timeRemainingInInterval = interval - dt % interval;
    let timeout = timeRemainingInInterval;

    if (timeRemainingInInterval < interval / 2.0) {
      timeout += interval;
    }

    let timeRemaining = Math.max(this.state.timeRemaining - dt, 0);
    let countdownComplete = this.state.prevTime && timeRemaining <= 0;

    if (this.isMounted()) {
      if (this.state.timeoutId) {
        clearTimeout(this.state.timeoutId);
      }
      this.setState({
        timeoutId: countdownComplete
          ? null
          : setTimeout(this.tick.bind(this), timeout),
        prevTime: currentTime,
        timeRemaining: timeRemaining,
      });
    }

    if (countdownComplete) {
      if (this.props.completeCallback) {
        this.props.completeCallback();
      }
      return;
    }

    if (this.props.tickCallback) {
      this.props.tickCallback(timeRemaining);
    }
  }

  getFormattedTime(milliseconds) {
    if (this.props.formatFunc) {
      return this.props.formatFunc(milliseconds);
    }

    let totalSeconds = Math.round(milliseconds / 1000);

    let seconds = parseInt(totalSeconds % 60, 10);
    let minutes = parseInt(totalSeconds / 60, 10) % 60;
    let hours = parseInt(totalSeconds / 3600, 10);

    seconds = seconds < 10 ? '0' + seconds : seconds;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    hours = hours < 10 ? '0' + hours : hours;

    return { hours: hours, minutes: minutes, seconds: seconds };
  }

  render() {
    let timeRemaining = this.state.timeRemaining;
    let leftFormat = this.getFormattedTime(timeRemaining);

    if (this.props.renderContent) {
      return this.props.renderContent(leftFormat);
    }

    return (
      <View style={this.getStyle('container')}>
        {this.props.description
          ? <Text style={this.getStyle('description')}>
              {this.props.description}
            </Text>
          : null}
        <Text style={this.getStyle('hour')}>{leftFormat.hours}</Text>
        <Text style={this.getStyle('splite')}>:</Text>
        <Text style={this.getStyle('minute')}>{leftFormat.minutes}</Text>
        <Text style={this.getStyle('splite')}>:</Text>
        <Text style={this.getStyle('second')}>{leftFormat.seconds}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
