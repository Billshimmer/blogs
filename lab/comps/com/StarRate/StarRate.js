'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, { StyleSheet, View, Text } from 'react-native';

import LAB, { requireComp } from 'lab4';

import img_star from './star.png';
import img_star_half from './star_half.png';
import img_star_gray from './star_gray.png';

const Touchable = requireComp('com.Touchable');
const Image = requireComp('com.Image');
const Icon = requireComp('com.Icon');

/**
 * 星星选择评价组件
 * 
 * @export
 * @class StarRate
 * @extends {LAB.Component}
 */
export default class StarRate extends LAB.Component {
  static propTypes = {
    //均不传入时使用默认icon
    icon: PropTypes.string,
    halfIcon: PropTypes.string,
    activeIcon: PropTypes.string,
    //传入图片则覆盖icon样式
    image: PropTypes.string,
    halfImage: PropTypes.string,
    activeImage: PropTypes.string,

    maxStar: PropTypes.number,
    defaultStar: PropTypes.number,
    correct: PropTypes.number, //半星条件修正 左右缩进0.1-0.4
    //当defaultStar=0 && hide=true 时显示的文本
    defaultText: PropTypes.string,
    //hide则必disabled 隐藏未选中star
    disabled: PropTypes.bool,
    hide: PropTypes.bool,
    //点击star时的透明度 为1则不闪烁
    activeOpacity: PropTypes.number,
  };
  static defaultProps = {
    // icon:'star-border',
    // activeIcon:'star',
    correct: 0,
    defaultStar: 0,
    maxStar: 5,
    hide: false,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      value: this.props.defaultStar < this.props.maxStar
        ? this.props.defaultStar
        : this.props.maxStar,
    };
    this.defaultStyles = styles;
  }

  componentWillReceiveProps(newProps) {
    if (newProps.defaultStar != this.props.defaultStar) {
      let temp = newProps.defaultStar < newProps.maxStar
        ? newProps.defaultStar
        : newProps.maxStar;
      if (temp != this.state.value) {
        this.setState({
          value: temp,
        });
      }
    }
  }

  getValue() {
    return this.state.value;
  }

  setValue(value) {
    this.setState({ value: value });
  }

  render() {
    let starList = [];
    if (this.props.hide) {
      if (this.state.value <= 0 && this.props.defaultText) {
        starList.push(
          <Text key={0} style={this.getStyle('defaultText')}>
            {this.props.defaultText}
          </Text>
        );
      } else {
        if (this.props.activeImage) {
          for (let i = 1; i <= this.state.value + 0.5; i++)
            starList.push(
              <View key={i} style={this.getStyle('itemView')}>
                <Image
                  uri={this.props.activeImage}
                  style={this.getStyle('image')}
                />
              </View>
            );
        } else if (this.props.activeIcon) {
          for (let i = 1; i <= this.state.value + 0.5; i++)
            starList.push(
              <View key={i} style={this.getStyle('itemView')}>
                <Icon
                  name={this.props.activeIcon}
                  style={this.getStyle('icon')}
                />
              </View>
            );
        } else {
          for (let i = 1; i <= this.state.value + 0.5; i++)
            starList.push(
              <View key={i} style={this.getStyle('itemView')}>
                <Image source={img_star} style={this.getStyle('image')} />
              </View>
            );
        }
      }
    } else {
      if (this.props.activeImage) {
        for (let i = 1; i <= this.props.maxStar + 0.5; i++) {
          if (
            this.props.halfImage &&
            i > this.props.defaultStar + this.props.correct &&
            i - 1 < this.props.defaultStar - this.props.correct
          ) {
            starList.push(
              <Touchable
                key={i}
                activeOpacity={this.props.activeOpacity}
                disabled={this.props.disabled}
                onPress={() => this.onPress(i)}
                style={this.getStyle('itemView')}
              >
                <Image
                  uri={this.props.halfImage}
                  style={this.getStyle('image')}
                />
              </Touchable>
            );
          } else {
            if (i > this.state.value + this.props.correct) {
              starList.push(
                <Touchable
                  key={i}
                  activeOpacity={this.props.activeOpacity}
                  disabled={this.props.disabled}
                  onPress={() => this.onPress(i)}
                  style={this.getStyle('itemView')}
                >
                  <Image
                    uri={this.props.image}
                    style={this.getStyle('image')}
                  />
                </Touchable>
              );
            } else {
              starList.push(
                <Touchable
                  key={i}
                  activeOpacity={this.props.activeOpacity}
                  disabled={this.props.disabled}
                  onPress={() => this.onPress(i)}
                  style={this.getStyle('itemView')}
                >
                  <Image
                    uri={this.props.activeImage}
                    style={this.getStyle('image')}
                  />
                </Touchable>
              );
            }
          }
        }
      } else if (this.props.activeIcon) {
        for (let i = 1; i <= this.props.maxStar + 0.5; i++) {
          if (
            this.props.halfIcon &&
            i > this.props.defaultStar + this.props.correct &&
            i - 1 < this.props.defaultStar - this.props.correct
          ) {
            starList.push(
              <Touchable
                key={i}
                activeOpacity={this.props.activeOpacity}
                disabled={this.props.disabled}
                onPress={() => this.onPress(i)}
                style={this.getStyle('itemView')}
              >
                <Icon
                  key={i}
                  name={this.props.halfIcon}
                  style={this.getStyle('icon')}
                />
              </Touchable>
            );
          } else {
            i > this.state.value + this.props.correct
              ? starList.push(
                  <Touchable
                    key={i}
                    activeOpacity={this.props.activeOpacity}
                    disabled={this.props.disabled}
                    onPress={() => this.onPress(i)}
                    style={this.getStyle('itemView')}
                  >
                    <Icon
                      key={i}
                      name={this.props.icon}
                      style={this.getStyle('icon')}
                    />
                  </Touchable>
                )
              : starList.push(
                  <Touchable
                    key={i}
                    activeOpacity={this.props.activeOpacity}
                    disabled={this.props.disabled}
                    onPress={() => this.onPress(i)}
                    style={this.getStyle('itemView')}
                  >
                    <Icon
                      key={i}
                      name={this.props.activeIcon}
                      style={this.getStyle('icon')}
                    />
                  </Touchable>
                );
          }
        }
      } else {
        for (let i = 1; i <= this.props.maxStar + 0.5; i++) {
          if (
            i > this.props.defaultStar + this.props.correct &&
            i - 1 < this.props.defaultStar - this.props.correct
          ) {
            starList.push(
              <Touchable
                key={i}
                activeOpacity={this.props.activeOpacity}
                disabled={this.props.disabled}
                onPress={() => this.onPress(i)}
                style={this.getStyle('itemView')}
              >
                <Image source={img_star_half} style={this.getStyle('image')} />
              </Touchable>
            );
          } else {
            if (i > this.state.value + this.props.correct) {
              starList.push(
                <Touchable
                  key={i}
                  activeOpacity={this.props.activeOpacity}
                  disabled={this.props.disabled}
                  onPress={() => this.onPress(i)}
                  style={this.getStyle('itemView')}
                >
                  <Image
                    source={img_star_gray}
                    style={this.getStyle('image')}
                  />
                </Touchable>
              );
            } else {
              starList.push(
                <Touchable
                  key={i}
                  activeOpacity={this.props.activeOpacity}
                  disabled={this.props.disabled}
                  onPress={() => this.onPress(i)}
                  style={this.getStyle('itemView')}
                >
                  <Image source={img_star} style={this.getStyle('image')} />
                </Touchable>
              );
            }
          }
        }
      }
    }

    return (
      <View style={this.getStyle('container')}>
        {starList}
      </View>
    );
  }

  onPress(value) {
    this.setState({ value: value });
    this.props.onChange && this.props.onChange(value);
  }
}

const styles = StyleSheet.create({
  container: {
    //flex:1,
    // alignItems: 'center',
    //justifyContent: 'center',
    flexDirection: 'row',
  },
});
