'use strict'

import React,{
  Component,
  PropTypes,
} from 'react';

import ReactNative,{
  StyleSheet,
  View,
  requireNativeComponent,
} from 'react-native';

export default class LABScrollView extends Component{
  static propTypes={
    ...View.propTypes
  };

  constructor(props,context){
    super(props,context);
  }

  render(){
    return <LABScrollView {...this.props}/>
  }
}

var LABScrollView = requireNativeComponent('LABScrollView',,{

});
