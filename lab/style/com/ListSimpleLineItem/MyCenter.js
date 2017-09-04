import React, {
  Component,
  PropTypes,
} from 'react';
import ReactNative, {
  StyleSheet,
} from 'react-native';
export default StyleSheet.create({
  items:{
    height:44,
    alignItems:'center',
    paddingLeft:12,
    paddingRight:12,
    backgroundColor:'#ffffff'
  },
  icon:{

  },
  image:{
    width:24,
    height:24,
    marginRight:10,
  },
  textLeft:{
    flex:1,
    fontSize:16,
    color:Theme.primaryTextColor,
  },
  textRight:{
    flex:3,
    fontSize:15,
    color:Theme.secondaryTextColor,
    textAlign:'right',
  },
  iconRight:{
    color:Theme.secondaryTextColor,
    fontSize:20,
    marginLeft:10,
  },
});
