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
    padding:10,
    // 控制组件底部是否需要分隔线
    // borderBottomWidth:1,
    // borderBottomColor:'#eee',
  },
  image:{
    width:60,
    height:70,
    marginRight:10,
  },
  subbox:{
    flexDirection:'column',
    flex:1,
    alignSelf:'flex-start',

  },
  title:{
    fontSize:18,
    color:Theme.primaryTextColor,
    flex:1,
  },
  titleRightText:{
    fontSize:12,
    color:Theme.secondaryTextColor,
    textAlign:'right',
    marginLeft:10,
  },
  descwrap:{
    flex:1,
    marginTop:7,
  },
  desc:{
    fontSize:15,
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
    fontSize:14,
  },
});
