'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, { StyleSheet, Text, View } from 'react-native';
import LAB, { http, requireComp } from 'lab4';

const Label = requireComp('com.Label');
const Image = requireComp('com.Image');

export default class HeadImagePicker extends LAB.Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
  };

  // static defaultProps = {};

  // static contextTypes = {
  //   ...LAB.Component.componentContextTypes,
  // };

  constructor(props, context) {
    super(props, context);
    this.state = {
      files: this.props.value,
      token: '',
      domain: '',
    };
  }

  componentDidMount() {
    http
      .post('/Content/Index/getQiniuToken')
      .then(response => {
        this.setState({
          token: response.DATA.token,
          domain: response.DATA.domain,
        });
      })
      .catch(error => {
        console.warn(error);
      });
  }

  _onChange(event) {
    let mfile = event.target.files[0];
    event.preventDefault();
    var target = event.target;
    var files = target.files;
    var count = 1;
    var i;
    for (i = 0; i < count; i++) {
      files[i].thumb = URL.createObjectURL(files[i]);
    }
    files = Array.prototype.slice.call(files, 0);
    files = files.filter(function(file) {
      return /image/i.test(file.type);
    });

    let oMyForm = new FormData();
    let key = '' + new Date().getTime();

    oMyForm.append('token', this.state.token);
    oMyForm.append('file', mfile);
    oMyForm.append('key', key);

    let oReq = new XMLHttpRequest();
    oReq.open('POST', 'http://upload.qiniu.com');
    oReq.send(oMyForm);

    oReq.onreadystatechange = e => {
      if (oReq.readyState !== 4) {
        return;
      }

      if (oReq.status === 200) {
        // console.log(JSON.parse(oReq.responseText));
        this.setState({
          files:
            'http://' +
              this.state.domain +
              '/' +
              JSON.parse(oReq.responseText).key,
        });
      }
    };
  }

  getValue() {
    return this.state.files;
  }

  render() {
    return (
      <View style={styles.container}>
        <Label style_class="formLabel" text="修改头像" />
        <div style={styles.content}>
          <input
            style={styles.fileInput}
            type="file"
            ref="fileInput"
            onChange={this._onChange.bind(this)}
          />
          <div style={styles.thumb_box}>
            <Image style={styles.img} uri={this.state.files} />
          </div>
        </div>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 70,
    marginTop: 10,
  },
  content: {
    alignItems: 'center',
    flex: 1,
  },
  thumb_box: {
    alignItems: 'center',
  },
  fileInput: {
    position: 'absolute',
    opacity: 0,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    zIndex: '99',
  },
  img: {
    width: 60,
    height: 60,
    borderRadius: 30,
    position: 'absolute',
    right: '10%',
  },
});
