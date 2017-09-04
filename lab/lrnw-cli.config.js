'use strict';

var path = require('path');

// lab4 测试用 npmignore 需要忽略本文件
var config = {

  serverBuildBundleInterceptorModulePath: path.join(__dirname, '/local-cli/serverBuildBundleInterceptor'),

};

module.exports = config;