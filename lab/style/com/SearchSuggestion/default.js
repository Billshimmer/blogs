import React, { 
  Component,
  PropTypes,
} from 'react';
import ReactNative, {
  StyleSheet,
  PixelRatio,
} from 'react-native';

var onePT = 1 / PixelRatio.get();

export default StyleSheet.create({
  container:{
    borderWidth:onePT,
    borderColor:'#E8E8E8',
    marginLeft:10,
    marginRight:50
  },
  lists:{
    flexDirection: 'row',
    alignItems: 'center',
    height:44,
    borderBottomWidth:onePT,
    borderColor:'#E8E8E8',
    paddingLeft:8,
    paddingRight:8
  },
  items:{

  },
  itemsText:{
    alignItems: 'center',
    flex:1,
    paddingLeft:10,
    color:'#666'
  },
  icons:{
    fontSize:18,
    color:'#999'
  },
});
