import React, { 
  Component,
  PropTypes,
} from 'react';
import ReactNative, {
  StyleSheet,
} from 'react-native';
export default StyleSheet.create({
  container: {
    height: 60,
  },
  title: {
    color: '#ff0000',
    fontSize: 16,
    //color: Theme.primaryTextColor,
  },
  desc: {
    fontSize: 14,
    color: Theme.secondaryTextColor,
  },
});
