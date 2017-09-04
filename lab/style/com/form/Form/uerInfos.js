import React, {
  Component,
  PropTypes,
} from 'react';
import ReactNative, {
  StyleSheet,
} from 'react-native';
export default StyleSheet.create({
  container: {
    backgroundColor:'#ffffff'
  },
  fieldContainer: {
    marginLeft: 12,
  },
  fieldContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex:1,
    paddingRight:12
  },
  fieldLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fieldLabelText: {
    width: 98,
    fontSize: 16,
    color: Theme.primaryTextColor,
    alignItems:'center'
  },
  fieldIcon: {
    color: Theme.primaryColor,
    width:44,
    fontSize:18,
    paddingLeft:12,
    paddingRight:12,
  },
  fieldImage: {
    width: 30,
    height: 30,
  },
  fieldError: {
    color: Theme.dangerColor,
    fontSize: 16,
  },
});
