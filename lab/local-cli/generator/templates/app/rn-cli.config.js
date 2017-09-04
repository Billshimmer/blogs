'use strict';

var blacklist = require('react-native/packager/blacklist');
var path = require('path');

var lrnwBlacklist = [
  /node_modules[/\\]lab-react-native-web[/\\].*/, // 忽略lab-react-native-web
  /build[/\\]outputs[/\\].*/,
];

var config = {

  /**
   * 扩展黑名单目录
   */
  getBlacklistRE() {
    return blacklist(lrnwBlacklist);
  },

  serverBuildBundleInterceptorModulePath: path.join(__dirname, 'node_modules/lab4/local-cli/serverBuildBundleInterceptor'),

};

module.exports = config;
