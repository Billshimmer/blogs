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
  vip:{
    height:26,
    width:26,
    borderRadius:13,
    backgroundColor:'yellow',
    overflow:'hidden',
    bottom:10,
    right:10,
  },
  vipText:{
    fontSize:16,
    color:'black',
    textAlign:'center',
  },
  image:{
    borderRadius:50,
    width:100,
    height:100,
    marginRight:10,
  },
  subbox:{
    marginLeft:20,
  },
  name:{
    fontSize:20,
    color:Theme.primaryTextColor,
    paddingBottom:7,
    flex:1,
  },
  integral:{
    marginTop:10,
    fontSize:15,
    color:Theme.secondaryTextColor,
    paddingBottom:7,
  },
});
