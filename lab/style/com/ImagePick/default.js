import React, {
  Component,
  PropTypes,
} from 'react';
import ReactNative, {
  StyleSheet,
} from 'react-native';

export default StyleSheet.create({
  container: {
    padding:6,  //设置间距请同时设置 container-padding imageView-margin add-margin 均为6的时候空白为12 两倍关系
    backgroundColor:'black',
  },
  imageView:{
    margin:6,
    //backgroundColor:'yellow',
  },
  image: {
    backgroundColor:'white',
  },
  showImageView: {
    backgroundColor:'white',
    flex:1,
    //alignItems:'stretch',
    //marginTop:20,
  },
  showImage: {
    flex:1,
  },
  add:{
    margin:6,
    borderColor:'rgba(0,0,0,0.5)',
    borderWidth:2,
    borderRadius:6,
    backgroundColor:'white',
  },
  addImage:{ //加号图片大小
    height:48,
    width:48,
  },
  indexText: {
    textAlign:"center",
    color:"#666",
    fontSize:12,
    padding:15,
  },
  deleteThumbButtonContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  deleteThumbButton: {
    width:18, height:18,
  },
});
