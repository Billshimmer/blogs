'use strict';
import React, { Component, PropTypes } from 'react';
import ReactNative, {
  StyleSheet,
  Text,
  View,
  ListView,
  AsyncStorage,
  TextInput,
  Platform,
} from 'react-native';
import LAB, { Page, Link, requireComp } from 'lab4';
import DemoHelper from './DemoHelper';
import _Camera from './lab-camera';

const Camera = DemoHelper.cameraEnabled ? _Camera : null;

const HeaderBar = requireComp('com.HeaderBar');
const Button = requireComp('com.Button');
const Touchable = requireComp('com.Touchable');

import DebugPage from 'lab4/demo/DebugPage';

import TestHelper from './TestHelper';

export default class Home extends Page {
  constructor(props, context) {
    super(props, context);
    var ds = new ListView.DataSource({
      sectionHeaderHasChanged: (h1, h2) => h1 !== h2,
      rowHasChanged: (r1, r2) => r1 !== r2,
    });
    this.state = {
      dataSource: ds.cloneWithRowsAndSections(DemoHelper.getDemos()),
      debugConfig: this.props.route.debugConfig || {},
      showScanner: false,
    };
    this.renderListHeader = this.renderListHeader.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.renderSectionHeader = this.renderSectionHeader.bind(this);
    this._onDebugPress = this._onDebugPress.bind(this);
    this._onPressRow = this._onPressRow.bind(this);

    this.autoLoad = false;
  }

  componentWillFocus() {
    //console.log('Home componentWillFocus ');
    const debugConfig = this.state.debugConfig;
    debugConfig.isDebugPageOpen = false;
    debugConfig.demoCompName = null;
    DemoHelper.saveTestState(debugConfig);
  }

  renderHeader() {
    return <HeaderBar title="LAB4 Demo" />;
  }

  _onDebugPress(e, isPage = false) {
    const debugConfig = this.state.debugConfig;
    if (!debugConfig.debugUrl) {
      return;
    }
    debugConfig.isDebugPageOpen = true;
    debugConfig.demoCompName = null;
    debugConfig.isPage = isPage;
    DemoHelper.saveTestState(debugConfig);
    this.router.push({
      id: 'debugPage',
      comp: DebugPage,
      url: debugConfig.debugUrl,
      isPage,
    });
  }

  _onPressRow(demo) {
    //console.log('row press');
    const debugConfig = this.state.debugConfig;
    if (demo.url) {
      debugConfig.isDebugPageOpen = true;
      debugConfig.demoCompName = null;
      debugConfig.isPage = demo.isPage == null ? true : demo.isPage;
      this.router.push({
        id: 'debugPage',
        comp: DebugPage,
        url: demo.url,
        isPage: debugConfig.isPage,
      });
    } else {
      debugConfig.isDebugPageOpen = false;
      debugConfig.demoCompName = demo.title;
      this.router.push(DemoHelper.getDemoRoute(demo));
    }
    DemoHelper.saveTestState(debugConfig);
  }

  renderListHeader() {
    return (
      <View style={styles.container}>
        <TextInput
          ref={input => {
            this.debugTextInput = input;
          }}
          placeholder="请输入测试url"
          onChangeText={debugUrl => {
            this.state.debugConfig.debugUrl = debugUrl;
          }}
          defaultValue={this.state.debugConfig.debugUrl}
          multiline={true}
          style={styles.debugTextInput}
        />
        <View style={styles.debugButtonArea}>
          {Camera &&
            <Button
              onPress={() => {
                this.setState({ showScanner: true });
              }}
              style_class="small1"
              style={{ marginBottom: 5, marginRight: 10, width: null }}
            >
              二维码
            </Button>}
          <Button
            onPress={() => {
              this.debugTextInput.clear();
              this.state.debugConfig.debugUrl = '';
            }}
            style_class="small1"
            style={{ marginBottom: 5, marginRight: 10, width: null }}
          >
            清空
          </Button>
          <Button
            onPress={this._onDebugPress}
            style_class="small1"
            style={{ marginBottom: 5, marginRight: 10, width: null }}
          >
            测试组件
          </Button>
          <Button
            onPress={e => {
              this._onDebugPress(e, true);
            }}
            style_class="small1"
            style={{ marginBottom: 5, marginRight: 10, width: null }}
          >
            测试页面
          </Button>
        </View>
      </View>
    );
  }

  renderSectionHeader(data, section) {
    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>
          {section}
        </Text>
      </View>
    );
  }

  renderRow(demo, i) {
    return (
      <Touchable style={styles.row} onPress={() => this._onPressRow(demo)}>
        <Text style={[styles.rowTitleText, demo.isNew && { color: '#f44336' }]}>
          {demo.title || demo.name}
        </Text>
      </Touchable>
    );
  }

  renderContent() {
    return (
      <View style={styles.container}>
        <ListView
          style={styles.listView}
          showsVerticalScrollIndicator={true}
          indicatorStyle="black"
          dataSource={this.state.dataSource}
          renderHeader={this.renderListHeader}
          renderRow={this.renderRow}
          renderSectionHeader={this.renderSectionHeader}
          enableEmptySections={true}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="always"
          initialListSize={20}
          pageSize={5}
        />
        {this.state.showScanner && this.renderBarcodeScanner()}
      </View>
    );
  }

  renderBarcodeScanner() {
    return (
      <Camera
        ref="camera"
        style={styles.camera}
        aspect={Camera.constants.Aspect.fill}
        onBarCodeRead={this._onBarCodeRead.bind(this)}
        scanBoxType="qrcode"
      >
        <Button
          onPress={() => {
            this.setState({ showScanner: false });
          }}
          style_class="small1"
          style={{}}
        >
          关闭
        </Button>
      </Camera>
    );
  }

  _onBarCodeRead(e) {
    //console.log('_onBarCodeRead e', e);
    this.state.debugConfig.debugUrl = e.data;
    this.setState({ showScanner: false });
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5FCFF' },
  listView: { flex: 1 },
  sectionHeader: {
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 20,
    backgroundColor: '#D1D1D1',
  },
  sectionHeaderText: { fontSize: 18 },
  row: {
    backgroundColor: 'white',
    justifyContent: 'center',
    paddingLeft: 20,
    paddingVertical: 8,
  },
  rowTitleText: { fontSize: 18, fontWeight: '500' },
  debugTextInput: { height: 80 },
  debugButtonArea: { flexDirection: 'row', justifyContent: 'flex-end' },
  camera: { position: 'absolute', left: 0, top: 0, right: 0, bottom: 0 },
});
