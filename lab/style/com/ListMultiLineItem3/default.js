import React, {
  Component,
  PropTypes,
} from 'react';
import ReactNative, {
  StyleSheet,
} from 'react-native';
export default StyleSheet.create({
  container:{
    padding:10,
    // 控制组件底部是否需要分隔线
    // borderBottomWidth:1,
    // borderBottomColor:'#eee',
  },
  textLeft:{
    flex:2,
    fontSize:13,
    color:Theme.primaryTextColor,
  },
  textMid:{
    flex:3,
    fontSize:13,
    color:Theme.primaryTextColor,
    paddingLeft:7,
  },
  textRight:{
    flex:1,
    fontSize:13,
    color:Theme.primaryTextColor,
    paddingLeft:7,
  },
});
