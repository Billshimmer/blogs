import React, {
  Component,
  PropTypes,
} from 'react';
import ReactNative, {
  StyleSheet,
} from 'react-native';

export default StyleSheet.create({
  container:{
    //无效
  },
  cancelView:{
    backgroundColor:'rgba(0,0,0,0.2)',
  },
  buttonView: {
    backgroundColor:'#F7F9FC',
    borderTopWidth:1,
    borderBottomWidth:1,
    borderColor:'#EDF0F5',
  },
  button: {
    height:30,
    width:80,
    backgroundColor:'#EDF0F5',
  },
  buttonText: {
    fontSize:17,
  },
});
