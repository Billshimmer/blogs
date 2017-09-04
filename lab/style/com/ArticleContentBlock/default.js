import React, {
  Component,
  PropTypes,
} from 'react';
import ReactNative, {
  StyleSheet,
} from 'react-native';

export default StyleSheet.create({
  container:{
    flex:1,
    paddingTop:20,
    paddingLeft:12,
    // paddingBottom:20,
    paddingRight:12,
  },
  title:{
    fontSize:20,
    color:Theme.primaryTextColor,
    marginBottom:15,
  },
  box:{
    flexDirection:'row',
    // marginTop:15,
    alignItems:'center',
    marginBottom:15,
  },
  date:{
    fontSize:12,
    color:'#808080',
    marginRight:15,
  },
  author:{
    fontSize:12,
    color:'#808080',
    marginRight:5,
  },
  from:{
    fontSize:12,
    color:'#808080',
  },
});
