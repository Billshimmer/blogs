import React, { 
  Component,
  PropTypes,
} from 'react';
import ReactNative, {
  StyleSheet,
} from 'react-native';
export default StyleSheet.create({
  container:{
    marginTop:10,
    flexDirection: 'row',
    flex:1,
    alignItems:'center',
    borderWidth:1,
    borderColor:'#D9D9D9',
    paddingLeft:10,
    paddingRight:10,
    paddingBottom:25,
    paddingTop:10
  },
  footer:{
    position:'absolute',
    bottom:10,
    right:10,
    color:'#B2B2B2',
    fontSize:14,
  },
  textInput:{
    flex:1,
    fontSize:14,
    lineHeight:21,
    height:80,
    color:'#333',
    alignItems:'flex-start'
  }
});
