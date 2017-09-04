import React, {
  Component,
  PropTypes,
} from 'react';
import ReactNative, {
  StyleSheet,
  PixelRatio,
} from 'react-native';

var onePT = 1 / PixelRatio.get();

export default StyleSheet.create({
  button: {
    backgroundColor: '#FFFFFF',
    borderLeftWidth:1,
    borderColor:Theme.borderLineColor,
    borderRadius:0,
    height:30,
    overflow:'hidden',
    width:100
  },
  text: {
    color:Theme.fontColor,
    fontSize:14,
  },
});
