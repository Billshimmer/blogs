'use strict';

import React, {
  Component,
  PropTypes,
} from 'react';
import ReactNative, {
  StyleSheet,
  Platform,
  View,
  Text,
  ScrollView,
} from 'react-native';
import LAB, {
  Page,
  Toast,
  requireComp,
} from 'lab4';

import SimplePage from 'lab4/demo/SimplePage';
import TestHelper from 'lab4/demo/TestHelper';
const Layer = requireComp('com.Layer.BasicLayer');
const Dialog = requireComp('com.Dialog');

export default class PopupDemo extends SimplePage {

  static contextTypes = {
    ...SimplePage.contextTypes,
    appPopup: PropTypes.object,
  }

  constructor(props, context) {
    super(props, context);
    // this.state = {
    // };
  }

  testAlert() {
    this.context.popup.alert({
      title: 'alert',
      message: 'alert',
      buttons: [
        {
          text: 'calcel',
        },
      ]
    });
  }

  testDialog() {
    this.context.popup.dialog({
      title: 'dialog',
      message: 'dialog',
      autoClose: true,
      buttons: [
        {
          text: 'calcel',
        }, {
          text: 'global alert',
          onPress: () => {
            this.testGlobalDialog();
          }
        }
      ]
    });
  }

  testGlobalDialog() {
    this.context.appPopup.dialog({
      title: 'global alert',
      message: 'global alert',
      autoClose: false,
      buttons: [
        {text: 'calcel', },
        {
          text: 'ok',
          onPress: () => {
            console.log('alert ok');
            this.context.appPopup.hide();
          }
        }, {
          text: 'toast',
          onPress: () => {
            Toast.show('Toast', {
              duration: 3000,
            });
          }
        }
      ]
    });
  }

  testLoading() {
    this.context.popup.showLoading({
      message: 'Loading...',
    });
    // this.context.popup.alert({
    //   message: 'test',
    //   buttons: [
    //     {
    //       text: 'ok',
    //     }
    //   ]
    // })
    setTimeout(() => {
      this.context.popup.hideLoading();
    }, 3000);
  }

  testAddView() {
    let popupId = this.context.popup.addView({
      showMask: true,
      render: () => {
        return (
          <Dialog
            title="xxx"
            message="xxxx"
            buttons={[{text: 'calcel', }, {text: 'ok', onPress: () => {
              this.context.popup.hide(popupId);
              this.testLoading();
            }}]}
            contentView={null}
            style_class={null}
          />
        );
      },
    });
  }

  renderTest() {
    return (
      <View style={{flex: 1, backgroundColor: '#bdbdbd'}}>
        <Dialog
          title="xxx"
          message="xxxx"
          buttons={[{text: 'calcel', }, {text: 'ok', }]}
          contentView={null}
          style_class={null}
          style={{marginTop: 40,}}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
});
