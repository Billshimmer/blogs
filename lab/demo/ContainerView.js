import React, { PropTypes } from 'react';
import { requireNativeComponent, View } from 'react-native';

var RCTContainerView = {
  name: 'RCTContainerView',
  propTypes: {
    style: View.propTypes.style,
    options: PropTypes.object,
    ...View.propTypes,
  },
};
var _RCTContainerView = requireNativeComponent(
  'RCTContainerView',
  RCTContainerView
);
export default _RCTContainerView;
