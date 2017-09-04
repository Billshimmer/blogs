import React, {
  Component,
  PropTypes,
} from 'react';
import ReactNative, {
  StyleSheet,
} from 'react-native';
export default StyleSheet.create({
  mainWrap:{
    // 组件最外层容器
  },
  container:{
    padding: 12,
    backgroundColor:'#FFFFFF',
    // 控制组件底部是否需要分隔线
    // borderBottomWidth:1,
    // borderBottomColor:'#eee',
  },
  image:{
    width:66,
    height:66,
    marginRight:10,
    borderRadius:33
  },
  subbox:{
    flexDirection:'column',
    flex:1,
    alignSelf:'flex-start',

  },
  title:{
    fontSize:17,
    color:Theme.primaryTextColor,
    flex:1,
    paddingTop:10
  },
  titleRightText:{
    fontSize:12,
    // color:Theme.secondaryTextColor,
    textAlign:'right',
    marginLeft:10,
  },
  descwrap:{
    marginTop:7,
  },
  desc:{
    fontSize:14,
    color:Theme.secondaryTextColor,
  },
  footwrap:{
    marginTop:7,
  },
  foot:{
    fontSize:12,

  },
  rightBox:{
    flexDirection:'row',
    flexWrap:'wrap',
    alignItems:'center',
  },
  textRight:{

  },
  iconRight:{
    fontSize:20,
    color:Theme.secondaryTextColor,
  },
});
