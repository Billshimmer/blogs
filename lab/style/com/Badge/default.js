import React, {
  Component,
  PropTypes,
} from 'react';
import ReactNative, {
  StyleSheet,
} from 'react-native';

export default StyleSheet.create({
  container: {
    backgroundColor:'red',
    height:24,              //角标高度
    borderRadius:12,        //角标半径 务必与高度对应
    paddingHorizontal:6,
  },
  text: {
    color:'white',
    fontWeight:'bold',
    fontSize:14,            //字体大小 不要超出角标高度
  },
  icon: {
    color:'white',
    fontWeight:'bold',
    fontSize:14,            //图标大小 不要超出角标高度
  },
  image: {
    height:20,
    width:20,
  }

});
