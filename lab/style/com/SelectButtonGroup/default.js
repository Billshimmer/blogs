import React, {
  Component,
  PropTypes,
} from 'react';
import ReactNative, {
  StyleSheet,
} from 'react-native';

export default StyleSheet.create({
  container: {
    backgroundColor:'white',
    padding:5,
  },
  item: {
    width:82,
    margin:5,
    backgroundColor:'#EBEFF5',
    borderRadius:4,
  },
  activeItem: {
    backgroundColor:'#0083E6',
  },
  text: {
    marginTop:5,
    marginBottom:5,
    fontSize:12,
    color:'black',
  },
  activeText: {
    color:'white',
  },
});
