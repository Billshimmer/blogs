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
    backgroundColor: Theme.primaryColor,
    borderColor: Theme.primaryColor,
    borderWidth:onePT,
    borderRadius: 4,
    height:30,
    overflow:'hidden',
    marginLeft:-30,
    width:100
  },
  text: {
    color: '#fff',
    fontSize:14,
  },
});
