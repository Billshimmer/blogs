import React, {
  Component,
  PropTypes,
} from 'react';
import ReactNative, {
  StyleSheet,
} from 'react-native';

export default StyleSheet.create({
  container: {  //展示背景
    height:44,
    backgroundColor:'gray',
  },
  text: { //展示文本
    fontSize:18,
    color:'white',
  },
  confirmButton: {  //ios选择确认按钮
    borderRadius: 6,
    height: 40,
    backgroundColor: 'white',
  },
  confirmText: {  //ios选择确认文本
    fontSize: 16,
    color: 'red',
  },
  picker: { //ios弹出picker样式

  },
  actionView: { //ios弹出整体背景view
    backgroundColor:'rgba(0,0,0,0.2)',
    paddingBottom:10,
  },
  titleLeft: {

  },
  titleLeftText: {

  },
  titleText: {

  },
  titleRight: {

  },
  titleRightText: {
    
  },
});
