'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, { StyleSheet, View, Text } from 'react-native';
import LAB, { requireComp } from 'lab4';
import BaseCalendar from 'react-native-calendar';

const Icon = requireComp('com.Icon');
const Image = requireComp('com.Image');

const flattenStyle = StyleSheet.flatten;
const customDayHeadings = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
const customMonthNames = [
  '一月',
  '二月',
  '三月',
  '四月',
  '五月',
  '六月',
  '七月',
  '八月',
  '九月',
  '十月',
  '十一月',
  '十二月',
];

/**
 * https://github.com/christopherdro/react-native-calendar
 */
export default class Calendar extends LAB.Component {
  static propTypes = {};
  static defaultProps = {
    scrollEnabled: true,
    showControls: true,
    dayHeadings: customDayHeadings,
    monthNames: customMonthNames,
    titleFormat: 'MMMM YYYY',
    prevButtonText: '<',
    nextButtonText: '>',
  };

  constructor(props, context) {
    super(props, context);
    // this.state = {
    // }
  }

  render() {
    return (
      <BaseCalendar
        customStyle={this.getStyles()}
        //eventDates={this.props.eventDates}
        //events={this.props.events}
        //scrollEnabled={this.props.scrollEnabled}
        //showControls={this.props.showControls}
        //dayHeadings={this.props.dayHeadings}
        //monthNames={this.props.monthNames}
        //titleFormat={this.props.titleFormat}
        //prevButtonText={this.props.prevButtonText}
        //nextButtonText={this.props.nextButtonText}
        //onDateSelect={this.props.onDateSelect}
        //onTouchPrev={this.props.onTouchPrev}     // eslint-disable-line no-console
        //onTouchNext={this.props.onTouchNext}  // eslint-disable-line no-console
        //onSwipePrev={this.props.onSwipePrev}     // eslint-disable-line no-console
        //onSwipeNext={this.props.onSwipeNext}  // eslint-disable-line no-console
        //customStyle={{
        //  calendarContainer: this.getStyle('calendarContainer'),
        //  title: this.getStyle('title'),
        //  controlButtonText: this.getStyle('controlButtonText'),  //控制按钮文字
        //  dayHeading: this.getStyle('dayHeading'),
        //  weekendHeading: this.getStyle('weekendHeading'),
        //  dayButton: this.getStyle('dayButton'),//Top border
        //  dayButtonFiller: this.getStyle('dayButtonFiller'),
        //  day: this.getStyle('day'),  //Text
        //  dayCircleFiller: this.getStyle('dayCircleFiller'),
        //  weekendDayText: this.getStyle('weekendDayText'),
        //  currentDayText: this.getStyle('currentDayText'),
        //  currentDayCircle: this.getStyle('currentDayCircle'),  //选中今日
        //  selectedDayText: this.getStyle('selectedDayText'),
        //  selectedDayCircle: this.getStyle('selectedDayCircle'), //选中日期
        //  eventIndicatorFiller: this.getStyle('eventIndicatorFiller'),
        //  eventIndicator: this.getStyle('eventIndicator'),
        //  hasEventCircle: this.getStyle('hasEventCircle'),
        //  hasEventText: this.getStyle('hasEventText'),
        //}}
        {...this.props}
      />
    );
  }
}
