'use strict'

import React, {
  Component,
  PropTypes,
} from 'react';
import ReactNative, {
  StyleSheet,
  View,
  Text,
} from 'react-native';

/**
 * SimpleTab used for viewPager switch use components
 */
export default class SimpleTab extends Component {

  constructor(props, context) {
    super(props, context);
  }

  static propTypes = {
    text: PropTypes.string,
    color: PropTypes.string,
    activeColor: PropTypes.string,
    activeBackgroundColor: PropTypes.string,
    textStyle: PropTypes.any,
    isActive: PropTypes.bool,
    badgeText: PropTypes.string,
    badgeContainerStyle: PropTypes.any,
    badgeTextStyle: PropTypes.any,
  };

  static defaultProps = {
    activeColor: '#5DCF1B'
  };

  render() {
    var containerStyle,
      textStyle;
    if(this.props.isActive) {
      if(this.props.activeColor) {
        textStyle = {
          color: this.props.activeColor
        };
      }
      if(this.props.activeBackgroundColor) {
        containerStyle = {
          backgroundColor: this.props.activeBackgroundColor
        };
      }
    } else {
      if(this.props.color) {
        textStyle = {
          color: this.props.color
        };
      }
    }
    return (
      <View ref="_main" style={[styles.container, this.props.style, containerStyle]}>
        <View>
          <Text style={[styles.text, this.props.textStyle, textStyle]}>{this.props.text}</Text>
          {this._renderBadge()}
        </View>
      </View>
    );
  }

  _renderBadge() {
    let badgeText = this.props.badgeText;
    if (badgeText && badgeText != "") {
      return (
        <View style={[styles.badgeContainer, this.props.badgeContainerStyle]}>
          <Text style={[styles.badgeText, this.props.badgeTextStyle]}>{badgeText}</Text>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  badgeContainer: {
    backgroundColor:"#FB1F1F",
    borderRadius:12,
    paddingLeft:5,paddingRight:5,
    alignItems:"center",
    justifyContent:"center",
    position:"absolute",
    overflow:'hidden',
    top:-10,
    right:-20,
  },
  badgeText: {
    fontSize:14,
    color:"#FFF",
  },
  container: {
    flex: 1,
    alignSelf: 'stretch',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
  }
});
