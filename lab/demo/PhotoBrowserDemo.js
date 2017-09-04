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
  utils,
  requireComp,
} from 'lab4';

import SimplePage from 'lab4/demo/SimplePage';
import TestHelper from 'lab4/demo/TestHelper';

import PhotoBrowserView from 'lab4/basiccomps/PhotoBrowserView';

const PhotoBrowserPage = requireComp('com.PhotoBrowserPage');
const HeaderBar = requireComp('com.HeaderBar');

const PHOTOS = [
  ['http://www.rmzt.com/uploads/allimg/150917/1-15091G10F1.jpg', 'http://www.3lian.com/d/file/201701/03/78e2d5cdc24c6cb8560f30ccdde63519.jpg', 'http://img.tuku.cn/file_big/201504/772d5eb2a5ce45b59fa4998c41e51c99.jpg', 'http://img4.imgtn.bdimg.com/it/u=2327492003,3023022027&fm=11&gp=0.jpg'],
  ['http://www.3lian.com/d/file/201701/03/0f2be5699c075392390d21f2478e8b45.jpg', 'http://pic36.nipic.com/20131218/14154807_222309556183_2.jpg', 'http://tupian.enterdesk.com/2013/mxy/12/10/15/3.jpg'],
];

export default class PhotoBrowserDemo extends SimplePage {

  constructor(props, context) {
    super(props, context);

    this.state = {
      options: {
        photos: PHOTOS[0],
        currentIndex: 0,
      },
    };
  }

  testOpenPhotoBrowserPage() {
    PhotoBrowserPage.open(this.router, {
      photos: this.state.options.photos,
      currentIndex: this.state.options.currentIndex,
      closeOnTap: true, //默认为true 
      renderHeader(photoBrowserPage) {
        return (
          <HeaderBar
            left={{icon:'arrow-back', color: '#fff',}}
            onLeftPress={() => {
              photoBrowserPage.router.pop();
            }}
            overlayHeader={true}
            style={{backgroundColor: 'rgba(0, 0, 0, 0.3)', elevation: null,}}/>
        );
      },
    });
  }

  testChangePhotos() {
    const photos = PHOTOS[(Math.random() * PHOTOS.length) << 0];
    const currentIndex = (Math.random() * photos.length) << 0;
    this.setState({
      options: {
        photos,
        currentIndex,
      },
    });
  }

  renderTest() {
    return (
      <PhotoBrowserView
        options={this.state.options}
        onPhotoTap={() => {
          console.log('onPhotoTap');
        }}
        onPhotoSelected={(e) => {
          console.log('onPhotoSelected', e.nativeEvent);
        }}
        style={styles.container} />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
