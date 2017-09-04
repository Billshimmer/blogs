import React, {
  Component,
  PropTypes,
} from 'react';
import ReactNative, {
  StyleSheet,
} from 'react-native';
export default StyleSheet.create({
  mainWrap:{
    flex:1,
  },
  items:{
    padding:12,
    // 组件底部是否需要分隔线
    // borderBottomWidth:1,
    // borderBottomColor:'#eee',
  },
  icon:{
    color:'#1a1a1a',
    fontSize:17,
    marginRight:10,
  },
  image:{
    width:24,
    height:24,
    marginRight:10,
  },
  textLeft:{
    flex:1,
    fontSize:17,
    color:Theme.primaryTextColor,
  },
  textRight:{
    flex:3,
    fontSize:15,
    color:Theme.secondaryTextColor,
    textAlign:'right',
  },
  iconRight:{
    color:Theme.primaryColor,
    fontSize:15,
    paddingLeft:10,
  },
});
