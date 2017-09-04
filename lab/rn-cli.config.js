'use strict';

var blacklist = require('react-native/packager/blacklist');
var path = require('path');

var lrnwBlacklist = [
  /node_modules[/\\]lab-react-native-web[/\\].*/, // 忽略lab-react-native-web
  /build[/\\]outputs[/\\].*/,
  /build[/\\]lab4-min[/\\].*/,
];

// lab4 测试用 npmignore 需要忽略本文件
var config = {

  /**
   * 扩展黑名单目录
   */
  getBlacklistRE() {
    return blacklist(lrnwBlacklist);
  },

  serverBuildBundleInterceptorModulePath: path.join(__dirname, '/local-cli/serverBuildBundleInterceptor'),

};

module.exports = config;
