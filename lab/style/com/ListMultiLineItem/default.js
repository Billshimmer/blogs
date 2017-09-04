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
    padding:10,
    // 控制组件底部是否需要分隔线
    // borderBottomWidth:1,
    // borderBottomColor:'#eee',
  },
  topwarp:{
    flexDirection:'row',
  },
  image:{
    width:100,
    height:100,
    marginRight:10,
  },
  subbox:{
    flexDirection:'column',
    flex:1,
    alignSelf:'flex-start',
  },
  title:{
    fontSize:15,
    color:Theme.primaryTextColor,

    flex:1,
  },
  textRight:{
    fontSize:12,
    color:Theme.secondaryTextColor,
    textAlign:'right',
    marginLeft:10,
  },
  describe:{
    fontSize:13,
    color:Theme.secondaryTextColor,
    marginTop:7,
    // marginBottom:7,
  },
  footnote:{
    
  },
});
