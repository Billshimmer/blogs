import React, { Component, PropTypes } from 'react';
import ReactNative, {
  StyleSheet,
  View,
  Text,
  ScrollView,
  ListView,
  RefreshControl,
  StatusBar,
  TouchableOpacity,
  Image,
  Picker,
} from 'react-native';

import LAB, { Page, requireComp } from 'lab4';

import SimplePage from 'lab4/demo/SimplePage';
import TestHelper from 'lab4/demo/TestHelper';

const Button = requireComp('com.Button');
const ActionTab = requireComp('com.ActionTab');

export default class ActionViewDemo extends SimplePage {
  static contextTypes = {
    ...LAB.Component.componentContextTypes,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      show: false,
    };
  }

  renderContent() {
    return (
      <View style={styles.container}>

        <Button
          onPress={() => {
            this.setState({ show: true });
          }}
        >
          123
        </Button>

        <ActionView
          onCancel={() => {
            this.setState({ show: false });
          }}
          show={this.state.show}
        >
          <View style={{ flex: 1, backgroundColor: 'red', margin: 12 }}>
            <Text>321</Text>
          </View>
        </ActionView>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
    backgroundColor: 'white',
  },
});
