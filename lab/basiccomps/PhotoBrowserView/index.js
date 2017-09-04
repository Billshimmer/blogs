'use strict';

import React, {
  Component,
  PropTypes,
} from 'react';
import ReactNative, {
  StyleSheet,
  View,
  requireNativeComponent,
} from 'react-native';

export default class PhotoBrowserView extends Component {

  static propTypes = {
    ...View.propTypes,
    options: PropTypes.shape({
      photos: PropTypes.array,
      currentIndex: PropTypes.number,
    }),
    onPhotoTap: PropTypes.func,
    onPhotoSelected: PropTypes.func,
  };

  // static defaultProps = {
  // };

  constructor(props, context) {
    super(props, context);

  }

  render() {
    return <LABPhotoBrowser
      {...this.props} />;
  }
}
const LABPhotoBrowser = requireNativeComponent('LABPhotoBrowser', PhotoBrowserView);
