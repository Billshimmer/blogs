'use strict';
import React, {Component,PropTypes} from 'react';
import ReactNative, {
  StyleSheet,
  View,
  requireNativeComponent
} from 'react-native';

export default class SideIndexView extends Component {
  static propTypes = {
    ...View.propTypes,
    letters: PropTypes.array,
    onLetterChange: PropTypes.func,
  };

  _onLetterChange(event) {
    this.props.onLetterChange && this.props.onLetterChange(
      event.nativeEvent.letter,
      event.nativeEvent.position
    );
  }

  constructor(props, context) {
    super(props, context);
    this._onLetterChange = this._onLetterChange.bind(this);
  }

  render() {
    if (this.props.letters !== this._lastLetters) {
      this._options = {
        letters: this.props.letters,
      };
    }
    return (
      <LABSideIndexView
        {...this.props}
        options={this._options}
        onLetterChange={this._onLetterChange} />
    );
  }
}

const LABSideIndexView = requireNativeComponent('LABSideIndexView', {
  name: SideIndexView.name,
  propTypes: {
    ...SideIndexView.propTypes,
    options: PropTypes.object,
  },
});
