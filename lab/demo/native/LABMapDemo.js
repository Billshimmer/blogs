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
  MapView,
  NativeModules,
} from 'react-native';

import LAB, {
  Page,
} from 'lab4';

import SimplePage from 'lab4/demo/SimplePage';
import TestHelper from 'lab4/demo/TestHelper';

import LocationManager from 'lab4/apis/LocationManager';
import LABMapView from 'lab4/basiccomps/MapView/LABMapView';

import img_icon1 from 'lab4/demo/img/icon1.png';

export default class LABMapDemo extends SimplePage {

  constructor(props, context) {
    super(props, context);
    this.state = {
      annotations: this._createRandomAnnotations(20),
      region: {
        longitude: 120,
        latitude: 30,
        latitudeDelta: 0.0001,
        longitudeDelta: 0.0001,
      }
    };
    // this.configPage({
    //   scrollable: true, //页面可滚动
    // });
  }

  _createRandomAnnotations(count) {
    let annotations = [];
    for (let i = 0; i < count; ++i) {
      let annotation = {
        longitude: 115 + Math.random() * 10,
        latitude: 27 + Math.random() * 10,
        view: <MarkerView
          type={String(Math.random() * 3 << 0)}
          title={'title-' + i}/>,
        onFocus: () => {
          console.log('annotation onFocus annotation:', annotation);
        },
      };
      annotations.push(annotation);
    }
    return annotations;
  }

  testAddAnnotations() {
    this.setState({
      annotations: this.state.annotations.concat(this._createRandomAnnotations(5)),
    });
  }

  testGetCurrentPosition() {
    LocationManager.getCurrentPosition({
      coorType: 'gcj02',  //坐标类型 目前不支持 可以不提供
    }).then((data) => {
      console.log('getCurrentPosition success', data);
      alert('success: ' + JSON.stringify(data));
    }).catch((error) => {
      console.log('getCurrentPosition error', error);
      alert('error: ' + JSON.stringify(error));
    });
  }

  /**
   * 打开外部地图导航
   */
  testOpenNavigation() {
    LocationManager.openNavigation({
      destLongitude: 120,
      destLatitude: 30,
    }, (error) => {
      if (error) {
        console.log(error);
      }
    });
  }

  /**
   * 定位
   */
  testLocate() {
    this.refs.map.locate();
  }

  testSetMapStatus() {
    // TODO
  }

  testUpdateRegion() {
    this.setState({
      region: {
        ...this.state.region,
        latitude: 35,
      },
    });
  }

  renderTest() {
    //console.log('render', this.state.annotations);
    return (
      <View style={styles.container}>
        <LABMapView
          ref="map"
          showsUserLocation={true}
          showsCompass={true}
          zoomEnabled={true}
          rotateEnabled={false}
          pitchEnabled={true}
          mapType="standard"
          // region={this.state.region}
          annotations={this.state.annotations}
          onRegionChangeComplete={(region) => {
            console.log('onRegionChangeComplete region:', region);
          }}
          style={{height: 400}}/>
      </View>
    );
  }
}

class MarkerView extends React.Component {
  render() {
    return (
      <View>
        <Image source={img_icon1} />
        <Text>{this.props.title}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
