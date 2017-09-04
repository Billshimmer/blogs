// import React, {
//   Component,
//   PropTypes,
// } from 'react';
import ReactNative, {
  StyleSheet,
} from 'react-native';

const CommonStyle = (function () {
  const styleObject = {
    flex1: {
      flex: 1,
    },
  };
  const CommonStyle = StyleSheet.create(styleObject);

  for (let styleName in styleObject) {
    if (styleObject.hasOwnProperty(styleName)) {
      CommonStyle[styleName + 'Object'] = styleObject[styleName];
    }
  }
  return CommonStyle;
})();

CommonStyle.absoluteFill = StyleSheet.absoluteFill;
CommonStyle.absoluteFillObject = StyleSheet.absoluteFillObject;

export default CommonStyle;
