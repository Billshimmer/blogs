'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, {
  StyleSheet,
  View,
  Text,
  Image,
  Alert,
  NetInfo,
} from 'react-native';
import LAB, { requireComp } from 'lab4';
import LocationManager from 'lab4/apis/LocationManager';
import MapView from 'lab4/basiccomps/MapView/LABMapView';

import img_current_location from './current_location.png';

const Button = requireComp('com.Button');

export default class Map extends LAB.Component {
  static propTypes = {
    ...MapView.propTypes,
  };

  static defaultProps = {
    showsUserLocation: true,
    detail: null,
  };

  static contextTypes = {
    popup: PropTypes.object,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      region: props.region,
    };
    this._latitudeDelta =
      (this.state.region && this.state.region.latitudeDelta) || 0.05;
    this._longitudeDelta =
      (this.state.region && this.state.region.longitudeDelta) || 0.05;
    this._init = true;
    this._handlePress = this._handlePress.bind(this);
    this._handleRegion = this._handleRegion.bind(this);
    this._handleConnectionInfoChange = this._handleConnectionInfoChange.bind(
      this
    );
  }

  _handlePress(e) {
    LocationManager.getCurrentPosition()
      .then(result => {
        let longitude = result.longitude === this.state.region.longitude
          ? result.longitude - 0.0000000000001
          : result.longitude;
        let latitude = result.latitude === this.state.region.latitude
          ? result.latitude - 0.0000000000001
          : result.latitude;
        let latitudeDelta = this._latitudeDelta
          ? this._latitudeDelta
          : this.state.latitudeDelta;
        let longitudeDelta = this._longitudeDelta
          ? this._longitudeDelta
          : this.state.longitudeDelta;
        this.setState({
          region: {
            longitude: longitude,
            latitude: latitude,
            latitudeDelta: latitudeDelta,
            longitudeDelta: longitudeDelta,
          },
        });
      })
      .catch(() => {
        this.context.popup.alert({
          message: '定位失败,请检查网络设置',
          buttons: [
            {
              text: '确定',
            },
          ],
        });
      })
      .finally(() => {});
  }

  _handleRegion(region) {
    if (!this._init) {
      this._latitudeDelta = region.latitudeDelta;
      this._longitudeDelta = region.longitudeDelta;
    }
  }

  _handleConnectionInfoChange(isConnected) {
    if (isConnected) {
      this._getLocation();
    } else {
      this.context.popup.alert({
        message: '定位失败,请检查网络设置',
        buttons: [
          {
            text: '确定',
          },
        ],
      });
    }
  }

  _getLocation() {
    LocationManager.getCurrentPosition()
      .then(result => {
        this.setState({
          region: {
            longitude: result.longitude,
            latitude: result.latitude,
            latitudeDelta: this._latitudeDelta,
            longitudeDelta: this._longitudeDelta,
          },
        });
        this._init = false;
      })
      .catch(e => {
        if (__DEV__) console.log('getCurrentPosition error: ' + e);
      });
  }

  componentDidMount() {
    NetInfo.isConnected.fetch().done(isConnected => {
      if (isConnected) {
        this._getLocation();
      }
    });
    NetInfo.isConnected.addEventListener(
      'change',
      this._handleConnectionInfoChange
    );
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener(
      'change',
      this._handleConnectionInfoChange
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          {...this.props}
          style={styles.map}
          region={this.state.region}
          onRegionChangeComplete={this._handleRegion}
        />
        <View style={styles.bottom}>
          <Button onPress={this._handlePress} style={styles.button}>
            <Image source={img_current_location} />
          </Button>
          {this.props.detail}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  button: {
    width: 40,
    height: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    marginLeft: 10,
    marginBottom: 10,
    borderColor: null,
    borderWidth: 0,
    borderRadius: 0,
    backgroundColor: null,
  },
  bottom: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,
  },
});
