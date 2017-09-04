import React, {
  Component,
  PropTypes,
} from 'react';
import ReactNative, {
  StyleSheet,
} from 'react-native';

export default StyleSheet.create({
  button: {
    height: 44,
    flex: 1
  },
  text:{
    fontSize:15,
    color:Theme.secondaryTextColor,
    textAlign:'right',
  },
  buttonContainer:{
    position:'absolute',
    top:0,
    left:0,
    right:0,
    bottom:0,
    alignItems: 'flex-start',
    justifyContent: 'center',
    overflow:'hidden',
  },
});
