import React, { 
  Component,
  PropTypes,
} from 'react';
import ReactNative, {
  StyleSheet,
} from 'react-native';
export default StyleSheet.create({
  button: {
    backgroundColor: "#FBFAFC",
    borderColor: Theme.darkPrimaryColor,
    borderWidth: 1,
    borderRadius: 4,
    height:30,
    width:60,
    paddingHorizontal:17,
    overflow:'hidden',
  },
  text: {
    color: '#000',
    fontSize:13,
  },
});
