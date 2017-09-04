import React, { 
  Component,
  PropTypes,
} from 'react';
import ReactNative, {
  StyleSheet,
  Dimensions,
  PixelRatio
} from 'react-native';

const window = Dimensions.get('window');
var onePT = 1 / PixelRatio.get();

export default StyleSheet.create({
  // fieldContainer: {
  //
  // },
  textInput: {
    height: 44,
    flex: 1,
  },
  fieldLabelText:{
    alignItems:'center',
    paddingRight:12
  },
  fieldIcon:{
    width:44,
    fontSize:18,
    paddingLeft:12,
    paddingRight:12,
  },
  fieldContentContainer:{
    flexDirection: 'row',
    alignItems:'center'
  },
  fieldLabelContainer:{
    alignItems:'center',
    flexDirection: 'row'
  },
  fieldContainer:{
    position: 'absolute',
    width: window.width,
    top:0
  },
  icons:{
    width: 16,
    height: 16,
    fontSize:16,
    paddingRight:40
  },
  items:{
    backgroundColor:'#FFFFFF',
    borderBottomWidth:onePT,
    borderColor:'#d9d9d9',
    height:28
  },
  itemsText:{
    fontSize:16,
    fontWeight:'300',
    alignItems:'center',
    lineHeight:22
  },
  result:{
    position: 'absolute',
    backgroundColor:'#FFFFFF',
    borderWidth:onePT,
    borderColor:'#d9d9d9',
    marginRight:40,
    top: 36,
    left: 0,
    right: 0,
    borderRadius:onePT,
    shadowColor:'rgba(0,0,0,0.17)'
  }
});
