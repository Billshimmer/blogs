import React, { PropTypes } from 'react';
import { requireNativeComponent, View } from 'react-native';

var RCTIMIChatView= {
    name: 'RCTIMIChatView',
    propTypes: {
        style: View.propTypes.style,
        options: PropTypes.object,
        ...View.propTypes,
    },
};
var _RCTIMIChatView = requireNativeComponent('RCTIMIChatView', RCTIMIChatView);
export default _RCTIMIChatView;
