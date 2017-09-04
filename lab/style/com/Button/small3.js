import React, { 
  Component,
  PropTypes,
} from 'react';
import ReactNative, {
  StyleSheet,
} from 'react-native';
export default StyleSheet.create({
  button: {
    borderColor: Theme.primaryColor,
    borderWidth: 2,
    borderRadius: 4,
    height:30,
    width:60,
    paddingHorizontal:17,
    overflow:'hidden',
  },
  text: {
    color: Theme.primaryColor,
    fontSize:13,
  },
});
