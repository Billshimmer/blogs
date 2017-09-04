import React, { 
  Component,
  PropTypes,
} from 'react';
import ReactNative, {
  StyleSheet,
} from 'react-native';
export default StyleSheet.create({
  button: {
    backgroundColor: Theme.warningColor,
    borderColor: Theme.warningColor,
    borderWidth: 2,
    borderRadius: 5,
    height:44,
  },
  text: {
    color: '#fff',
    fontSize:18,
  },
});
