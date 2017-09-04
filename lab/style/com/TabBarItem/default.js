import React, {
  PropTypes,
} from 'react';
import ReactNative, {
  StyleSheet,
} from 'react-native';
export default StyleSheet.create({
  container:{
    backgroundColor:'#f9f9f9',
    // 可配置是否需要底部或顶部的分隔线
    // borderTopWidth:1,
    // borderTopColor:'#ccc',
  },
  itemDirection: {
    flexDirection:'column',
  },
  icon:{
    width:28,
    height:28,
    fontSize:28,
    color:'#ccc',
    marginTop:5,
    textAlign:'center',
    alignSelf:'center',
  },
  image:{
    width:28,
    height:28,
    marginTop:5,
    alignSelf:'center',
  },
  text:{
    fontSize:12,
    color:'#ccc',
    paddingTop:5,
    textAlign:'center',
    marginBottom:2,
    alignSelf:'center',
  },
  flag:{
    position:'absolute',
    top:5,
    right:-10,
    borderRadius:5,
    backgroundColor:'red',
    height:10,
    width:10,
  },
});
