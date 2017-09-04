import React, {
  Component,
  PropTypes,
} from 'react';
import ReactNative, {
  StyleSheet,
} from 'react-native';
export default StyleSheet.create({
  main:{
    flexDirection: 'row',
    alignItems:'center',
    padding: 5,
    // borderBottomWidth:1,
    // borderColor:'#999'
  },
  container: {
    flexDirection: 'row',
    backgroundColor:'#E4E5E6',
    alignItems:'center',
    paddingLeft:6,
    height:44,
    flex:1,
    borderRadius:6
    },
  // container:{
  //   flexDirection: 'row',
  //   alignItems:'center',
  //   paddingLeft:6,
  //   height:44,
  //   flex:1,
  //   borderRadius:6,
  // },
  textInputArea: {
    flex: 1,
    alignSelf: 'stretch',
    paddingLeft:6
  },
  leftIcon:{
    width: 18,
    height: 18,
    fontSize:18,
    color:'#8e8e93'
  },
  textInput: {
    flex: 1,
    fontSize:14,
    fontWeight:'300',
    lineHeight:28
  },
  clearBtn: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBtn:{
    alignItems:'center'
  },
  searchBtnText: {
    fontSize: 16,
    marginLeft:8,
    color:'#999'
  },
  rightIcon:{
    fontSize: 18,
    marginLeft:8,
    color:'#999'
  }
});
