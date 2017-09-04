'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, {
  StyleSheet,
  Platform,
  View,
  Text,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';

import { Page, requireComp } from 'lab4';

import SimplePage from 'lab4/demo/SimplePage';
import TestHelper from 'lab4/demo/TestHelper';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import ScrollableTabBar from 'lab4/basiccomps/TabBar/ScrollableTabBar';
import SimpleTab from 'lab4/basiccomps/TabBar/SimpleTab';

const Button = requireComp('com.Button');

export default class ModalTest extends SimplePage {
  constructor(props, context) {
    super(props, context);
    this.state = {
      visible: false,
      visible1: false,
    };
  }

  test1() {
    this.setState({
      visible: true,
    });
    // setTimeout(() => {
    //   this.setState({
    //     visible1: true
    //   });
    // }, 3000);
  }

  test2() {
    Alert.alert('Alert Title', 'My Alert Msg', [
      {
        text: 'Ask me later',
        onPress: () => console.log('Ask me later pressed'),
      },
      { text: 'OK1', onPress: () => console.log('OK Pressed') },
    ]);
  }

  test3() {
    console.log(this.state);
    this.forceUpdate();
  }

  test4() {
    this.setState({
      visible1: !this.state.visible1,
    });
  }

  test5() {}

  test6() {}

  test7() {}

  test8() {}

  test9() {}

  renderContent() {
    return (
      <View>
        <Modal
          transparent={true}
          animated={true}
          onRequestClose={() => {
            console.log('onRequestClose');
          }}
          visible={this.state.visible}
        >
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}
          >
            <View
              style={{
                backgroundColor: '#fff',
                marginLeft: 20,
                marginRight: 20,
                borderRadius: 5,
              }}
            >
              <View style={{ padding: 20 }}>
                <Text>aaaaaaaaa</Text>
              </View>
              <View style={{ height: 20 }}>
                <Button
                  onPress={() => {
                    //this.test1();
                    this.setState({
                      //visible: false,
                      visible1: true,
                    });
                    setTimeout(() => {
                      this.setState({
                        visible: false,
                      });
                    });
                  }}
                  style={{
                    borderBottomLeftRadius: 5,
                    borderBottomRightRadius: 5,
                  }}
                >
                  yes
                </Button>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          transparent={true}
          animated={true}
          onRequestClose={() => {
            console.log('onRequestClose');
          }}
          visible={this.state.visible1}
        >
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}
          >
            <View
              style={{
                backgroundColor: '#fff',
                marginLeft: 20,
                marginRight: 20,
                borderRadius: 5,
              }}
            >
              <View style={{ padding: 20 }}>
                <Text>bbbbbbbbbb</Text>
              </View>
              <View style={{ height: 20 }}>
                <Button
                  onPress={() => {
                    this.setState({
                      visible: false,
                      visible1: false,
                    });
                  }}
                  style={{
                    borderBottomLeftRadius: 5,
                    borderBottomRightRadius: 5,
                  }}
                >
                  yes
                </Button>
              </View>
            </View>
          </View>
        </Modal>
        {this.renderTestBtns()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});
