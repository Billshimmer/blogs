'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, {
  StyleSheet,
  Platform,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import LAB from 'lab4';

export default class Loading extends LAB.Component {
  static contextTypes = {
    popup: PropTypes.object,
  };

  static propTypes = {
    message: PropTypes.string,
    containerStyle: View.propTypes.style,
    messageStyle: Text.propTypes.style,
  };

  // static defaultProps = {
  // };

  constructor(props, context) {
    super(props, context);
    this.defaultStyles = styles;
  }

  render() {
    return (
      <View style={styles.outContainer}>
        <View style={[this.getStyle('container'), this.props.containerStyle]}>
          <ActivityIndicator
            animating={true}
            color="#FFFFFF"
            size={Platform.OS === 'ios' ? 'small' : 'large'}
          />
          {this.props.message &&
            <Text style={[this.getStyle('message'), this.props.messageStyle]}>
              {this.props.message}
            </Text>}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  outContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: 120,
    height: 120,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    fontSize: 15,
    color: '#FFFFFF',
    marginTop: 14,
  },
});
