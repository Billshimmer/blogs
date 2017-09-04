import React, {
  Component,
  PropTypes,
} from 'react';
import ReactNative, {
  StyleSheet,
} from 'react-native';
export default StyleSheet.create({
  container:{
    padding:15,
  },
  image:{
    width:50,
    height:50,
    marginRight:10,
  },
  subbox:{
    flexDirection:'column',
    flex:1,
    marginLeft:10,
    alignSelf:'flex-start',
  },
  title:{
    fontSize:17,
    color:'#1a1a1a',
    paddingBottom:7,
  },
  textRight:{
    fontSize:12,
    color:Theme.secondaryTextColor,
    textAlign:'right',
    marginLeft:10,
  },
  describe:{
    fontSize:14,
    color:'#ccc',
    paddingBottom:7,
  },
  footnote:{
    fontSize:12,
    color:'#ccc',
  },
});
