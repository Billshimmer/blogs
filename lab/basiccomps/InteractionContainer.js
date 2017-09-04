'use strict';

import React, {
  Component,
  PropTypes,
} from 'react';
import ReactNative, {
  InteractionManager,
} from 'react-native';

export default class InteractionContainer extends Component {

  componentWillMount() {
    InteractionManager.runAfterInteractions(() => {
      if (this._mounted) {
        this.setState({
          render: true,
        });
      }
    });
  }

  componentDidMount() {
    this._mounted = true;
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  render() {
    return this.state.render ? this.props.children : null;
  }

}
