import React, {
  Component,
  PropTypes,
} from 'react';
import ReactNative, {
  StyleSheet,
  Dimensions,
  PixelRatio
} from 'react-native';

export default StyleSheet.create({
  main:{
    flex:1,
    flexDirection:'column',
    flexWrap:'nowrap'
  },
  Viewmain:{
    //height:window.height-100,
  },
  header:{
    alignItems:'center',
    paddingTop:6,
    paddingBottom:20
  },
  btn:{
    marginTop:20,
    marginBottom:20,
    marginLeft:12,
    marginRight:12
  },
  itemFooter:{
    flexDirection:'row',
    justifyContent:'space-between',
  },
  footerContent:{

  },
  headerContent:{
    width:80,
    height:80,
    borderRadius:40
  },
});
