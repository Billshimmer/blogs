import React, {
  Component,
  PropTypes,
} from 'react';
import ReactNative, {
  StyleSheet,
} from 'react-native';
export default StyleSheet.create({
  mainWrap:{

  },
  container:{
    padding:12,
    alignItems:'center',
    backgroundColor:"#ffffff"
  },
  image:{
    width:66,
    height:66,
    marginRight:10,
    borderRadius:33
  },
  icon:{
    fontSize:16,
    marginRight:10,
  },
  subbox:{
    flex:1,
  },
  title:{
    fontSize:16,
    color:Theme.primaryTextColor,
  },

  rightBox:{
    flexDirection:'row',
    flexWrap:'wrap',
    alignItems:'center',
  },
  textRight:{

  },
  iconRight:{
    color:Theme.secondaryTextColor,
    fontSize:18,
    paddingLeft:10,
  },
});
