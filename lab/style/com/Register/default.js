import React, {
  Component,
  PropTypes,
} from 'react';
import ReactNative, {
  StyleSheet,
  Dimensions
} from 'react-native';

const window = Dimensions.get('window');

export default StyleSheet.create({
  container:{
    flex:1,
    flexDirection:'column',
    flexWrap:'nowrap',
  },
  containerScrollStyle:{
    justifyContent: 'space-around', 
    flex: 1
  },
  Viewmain:{
    height:window.height-110,
  },
  header:{
    alignItems:'center',
    paddingTop:6,
    paddingBottom:20
  },
  btn:{
    marginTop:20,
    marginLeft:12,
    marginRight:12
  },
  footer:{
    alignItems:'center',
    justifyContent:'center',
    height:40,
    marginBottom:10
  },
  footerText:{
    fontSize:12,
    lineHeight:14,
    color:'#333'
  },
  headerContent:{
    width:80,
    height:80,
    borderRadius:40
  },
  footerContent:{
    color:'#007AFF',
    fontSize:12,
    lineHeight:14
  }
});
