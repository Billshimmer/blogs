'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, { StyleSheet, Text, View } from 'react-native';
import LAB, { http, requireComp } from 'lab4';

const Icon = requireComp('com.Icon');
const Image = requireComp('com.Image');

export default class MultiImagePicker extends LAB.Component {
  static propTypes = {
    value: PropTypes.array,
    maxLength: PropTypes.number,
    icon: PropTypes.string,
  };

  static defaultProps = {
    maxLength: 3,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      onshow: true,
      files: this.props.value || [],
      token: '',
      domain: '',
    };
  }

  componentDidMount() {
    http
      .post('/Content/Index/getQiniuToken')
      .then(response => {
        if (this.props.value && this.props.value.length) {
          this.setState({
            token: response.DATA.token,
            domain: response.DATA.domain,
            onshow: false,
          });
        } else {
          this.setState({
            token: response.DATA.token,
            domain: response.DATA.domain,
          });
        }
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
    var uppic;

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
        let arr = this.state.files;
        let newArr = arr.concat(
          'http://' +
            this.state.domain +
            '/' +
            JSON.parse(oReq.responseText).key
        );
        if (newArr.length >= this.props.maxLength) {
          this.setState({
            files: newArr,
            onshow: false,
          });
        } else {
          this.setState({
            files: newArr,
            onshow: true,
          });
        }
      }
    };
  }

  getValue() {
    return this.state.files;
  }

  _del(ind, item) {
    let arr2 = this.state.files;
    arr2.splice(ind, 1);

    if (arr2.length >= this.props.maxLength) {
      this.setState({
        files: arr2,
        onshow: false,
      });
    } else {
      this.setState({
        files: arr2,
        onshow: true,
      });
    }
  }

  render() {
    let items = [];
    if (this.state.files.length) {
      for (var i = 0; i < this.state.files.length; i++) {
        items.push(
          <div style={styles.items} key={i}>
            <img style={styles.imgs} src={this.state.files[i]} />
            <span style={styles.del} onClick={this._del.bind(this, i)}>
              {this.props.value && this.props.value.length
                ? null
                : <Icon name="clear" style={{ color: '#e4393c' }} />}
            </span>
          </div>
        );
      }
    }

    return (
      <div style={styles.container}>
        {items}
        {this.state.onshow
          ? <div style={styles.thumb_box}>
              <Image style={styles.img} uri={this.props.icon} />
              <input
                style={styles.fileInput}
                type="file"
                ref="fileInput"
                onChange={this._onChange.bind(this)}
              />
            </div>
          : null}
      </div>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  thumb_box: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dotted',
    position: 'relative',
    float: 'left',
  },
  img: {
    width: 30,
    height: 30,
    position: 'absolute',
    left: 35,
    top: 35,
  },
  fileInput: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    left: 0,
    top: 0,
    opacity: 0,
  },
  imgs: {
    width: 100,
    height: 100,
  },
  items: {
    position: 'relative',
    width: 100,
    height: 100,
    marginRight: 5,
    marginBottom: 5,
    float: 'left',
  },
  del: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
});
