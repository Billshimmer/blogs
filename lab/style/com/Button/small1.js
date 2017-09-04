import React, {
  Component,
  PropTypes,
} from 'react';
import ReactNative, {
  StyleSheet,
} from 'react-native';
export default StyleSheet.create({
  button: {
    backgroundColor: Theme.primaryColor,
    borderColor: Theme.darkPrimaryColor,
    borderWidth: 1,
    borderRadius: 4,
    height:30,
    width:60,
    paddingLeft: 17,
    paddingRight: 17,
    overflow:'hidden',
  },
  text: {
    color: '#fff',
    fontSize:13,
  },
});
