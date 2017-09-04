import React, {
  Component,
  PropTypes,
} from 'react';
import ReactNative, {
  StyleSheet,
} from 'react-native';

export default StyleSheet.create({
  container: {
    paddingBottom: 6,
  },
  selectContainerIOS: {
      borderRadius:6,
      backgroundColor:'white',
  },
  confirmButton:{
    marginTop:6,
    borderRadius:6,
    height: 40,
    backgroundColor: 'white',
    borderColor: 'gray',
    borderBottomWidth: 1,
  },
  confirmText:{
    color:'red',
    fontSize: 18
  },

});
