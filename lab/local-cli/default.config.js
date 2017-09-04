'use strict';

const path = require('path');

let config = {
  getProjectRoot() {
    return getRoot();
  },

  getUploadConfig() {
    return require('./upload-config');
  },
};

function getRoot() {
  if (__dirname.match(/node_modules[\/\\]lab4[\/\\]local-cli$/)) {
    return path.resolve(__dirname, '../../..');
  } else {
    return path.resolve(__dirname, '..');
  }
}

module.exports = config;
