'use strict';

import React, { PropTypes } from 'react';
import ReactNative, { StyleSheet, View, Platform } from 'react-native';
import ReactElement from 'react/lib/ReactElement';
import LAB from 'lab4';

export default class BlockList extends LAB.Component {
  static propTypes = {
    separateTop: PropTypes.bool,
    separateBottom: PropTypes.bool,
    line: PropTypes.object,
    blank: PropTypes.object,
  };

  // static defaultProps = {};

  constructor(props, context) {
    super(props, context);
  }

  render() {
    const rendered = (
      <View
        {...this.props}
        style={[this.getStyle('container'), this.props.style]}
      >
        {this._renderChildrenWithSeparate()}
      </View>
    );
    this._separate = undefined;
    return rendered;
  }

  _renderChildrenWithSeparate() {
    const arr = [];
    if (this.props.separateTop) {
      this._renderSeparate(arr, 'top-sp');
    }

    React.Children.forEach(this.props.children, (element, index) => {
      if (element) {
        if (element.key == null) {
          arr.push(ReactElement.cloneAndReplaceKey(element, 'c-' + index));
        } else {
          arr.push(element);
        }
        this._renderSeparate(arr, 'sp-' + index);
      }
    });

    if (!this.props.separateBottom && this._separate) {
      arr.pop();
    }

    return arr;
  }

  _renderSeparate(arr, key) {
    if (this._separate === undefined) {
      if (this.props.line) {
        this._separate = LAB.render(this.props.line, { key });
        arr.push(this._separate);
      } else if (this.props.blank) {
        this._separate = LAB.render(this.props.blank, { key });
        arr.push(this._separate);
      } else {
        this._separate = null;
      }
    } else if (this._separate) {
      arr.push(ReactElement.cloneAndReplaceKey(this._separate, key));
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexShrink: 1,
  },
});
BlockList.defaultStyles = styles;
