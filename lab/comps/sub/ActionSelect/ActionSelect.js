'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, {
  StyleSheet,
  View,
  Text,
  Animated,
  Dimensions,
  Picker,
  ScrollView,
  Modal,
  ListView,
} from 'react-native';
import LAB, { requireComp } from 'lab4';

const Touchable = requireComp('com.Touchable');

const DEFAULT_ANIMATE_TIME = 300;
const DEFAULT_BOTTOM = -300;
let { height, width } = Dimensions.get('window');

export default class ActionSelect extends LAB.Component {
  static propTypes = {
    visible: PropTypes.bool,
    onCancel: PropTypes.func,
    onSelect: PropTypes.func,
    data: PropTypes.array,
    indexData: PropTypes.array,
    confirmText: PropTypes.string,
    type: PropTypes.oneOf(['index', 'noIndex']),
  };
  static defaultProps = {
    confirmText: '确认',
    type: 'noIndex',
  };

  constructor(props, context) {
    super(props, context);
    let ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });
    this.state = {
      dataSource: ds.cloneWithRows(
        this.props.type == 'noIndex' ? this.props.data : this.props.indexData
      ),
      value: null,
      temp: {
        value: null,
        key: 0,
      },
      background: new Animated.Value(0),
      isPop: false,
    };
    this.defaultStyles = styles;
    this.onValueChange = this.onValueChange.bind(this);
  }
  componentWillReceiveProps(newProps) {
    if (newProps.visible) {
      this.setState({ isPop: newProps.visible });
      return Animated.timing(this.state.background, {
        toValue: 1, //newProps.visible ? 1: 0,
        duration: 300,
        delay: 300,
      }).start();
    } else {
      return Animated.timing(this.state.background, {
        toValue: 0, //newProps.visible ? 1: 0,
        duration: 200,
      }).start(this.onAnimatedEnd.bind(this));
    }
  }
  onAnimatedEnd() {
    this.setState({ isPop: false });
  }
  getValue() {
    return this.state.value;
  }

  onValueChange(value, key) {
    //console.log(this.props.indexData[key]);
    this.setState({
      temp: {
        value: value,
        key: key,
      },
    });
  }
  confirm() {
    let temp = this.state.temp;
    if (temp.value === null) {
      temp.value = this.props.type == 'noIndex'
        ? this.props.data[0]
        : this.props.indexData[0];
    }
    if (this.props.type == 'noIndex') {
      this.setState({ value: temp });
      this.props.onSelect && this.props.onSelect(temp);
    } else {
      this.setState({
        value: {
          value: this.props.indexData[temp.key],
          key: temp.key,
        },
      });
      this.props.onSelect &&
        this.props.onSelect(this.props.indexData[temp.key]);
    }
  }

  render() {
    if (this.props.type != 'noIndex') {
      return (
        <Modal
          transparent={true}
          animationType="slide"
          visible={this.state.isPop}
        >
          <View style={{ flex: 1 }}>
            <Animated.View
              style={[
                this.getStyle('background'),
                { opacity: this.state.background },
              ]}
            />
            <View style={this.getStyle('container')}>
              <Touchable style={{ flex: 1 }} onPress={this.props.onCancel} />
              <View style={{ paddingHorizontal: 20 }}>

                <View style={this.getStyle('selectContainerIOS')}>
                  <Picker
                    style={{ backgroundColor: '#FBFAFC' }}
                    selectedValue={this.state.temp.value}
                    onValueChange={this.onValueChange}
                  >
                    {this.props.indexData.map((item, i) => {
                      return (
                        <Picker.Item
                          key={i}
                          label={item.value}
                          value={item.key}
                        />
                      );
                    })}
                  </Picker>
                </View>
                <Touchable
                  style={this.getStyle('confirmButton')}
                  onPress={() => {
                    this.confirm(), this.props.onCancel();
                  }}
                >
                  <Text style={this.getStyle('confirmText')}>
                    {this.props.confirmText}
                  </Text>
                </Touchable>

              </View>
            </View>
          </View>
        </Modal>
      );
    } else {
      return (
        <Modal
          transparent={true}
          animationType="slide"
          visible={this.state.isPop}
        >
          <View style={{ flex: 1 }}>
            <Animated.View
              style={[
                this.getStyle('background'),
                { opacity: this.state.background },
              ]}
            />
            <View style={this.getStyle('container')}>
              <Touchable style={{ flex: 1 }} onPress={this.props.onCancel} />
              <View style={{ paddingHorizontal: 20 }}>

                <View style={this.getStyle('selectContainerIOS')}>
                  <Picker
                    style={{ backgroundColor: '#FBFAFC' }}
                    selectedValue={this.state.temp.value}
                    onValueChange={this.onValueChange}
                  >
                    {this.props.data.map((item, i) => {
                      return <Picker.Item key={i} label={item} value={item} />;
                    })}
                  </Picker>
                </View>
                <Touchable
                  style={this.getStyle('confirmButton')}
                  onPress={() => {
                    this.confirm(this.state.temp), this.props.onCancel();
                  }}
                >
                  <Text style={this.getStyle('confirmText')}>
                    {this.props.confirmText}
                  </Text>
                </Touchable>

              </View>
            </View>
          </View>
        </Modal>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    justifyContent: 'flex-end',
    //backgroundColor: 'rgba(0, 0, 0, 0.5)',//改成动画
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  background: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  selectContainerIOS: {
    overflow: 'hidden',
  },
  buttonText: {
    color: '#0069d5',
    alignSelf: 'center',
    fontSize: 18,
  },
  button: {
    flex: 1,
    height: 40,
    backgroundColor: 'white',
    borderColor: 'gray',
    borderBottomWidth: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  confirmText: {
    alignSelf: 'center',
  },
  confirmButton: {
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  // fullOverlay: {
  //     top: 0,
  //     bottom: 0,
  //     left: 0,
  //     right: 0,
  //     backgroundColor: 'transparent',
  //     position: 'absolute'
  // },
  // emptyOverlay: {
  //     top: 1000,
  //     bottom: 0,
  //     backgroundColor: '#7fff00',
  //     position: 'absolute'
  // },
});
