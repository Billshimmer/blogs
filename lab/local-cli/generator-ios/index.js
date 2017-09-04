/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */
'use strict';

var chalk = require('chalk');
var path = require('path');
var yeoman = require('yeoman-generator');

module.exports = yeoman.generators.NamedBase.extend({
  constructor: function() {
    yeoman.generators.NamedBase.apply(this, arguments);

    // 读取lab4配置
    this._lab4Config = this.fs.readJSON(this.destinationPath('package.json')).lab4;
  },
  writing: function() {
    var templateParams = {
      name: this.name,
    };
    let modules = this._lab4Config.modules;
    let zhcnNames = this._lab4Config._zhcnNames;

    // TODO 目前只支持一个module
    // module
    var moduleTemplateParams = Object.assign({
      moduleName: modules[0],
      zhcnModuleName: zhcnNames[0],
      entryFile: modules.length < 2 ? 'main' : modules[0] + '/main',
    }, templateParams);
    this.fs.copyTpl(
      this.templatePath(path.join('app', '**')),
      this.destinationPath(path.join('ios', this.name)),// TODO modules[0])),
      moduleTemplateParams
    );

    // project
    this.fs.copyTpl(
      this.templatePath(path.join('Template.xcodeproj', 'project.pbxproj')),
      this.destinationPath(path.join('ios', this.name + '.xcodeproj', 'project.pbxproj')),
      moduleTemplateParams
    );
    this.fs.copyTpl(
      this.templatePath(path.join('Template.xcodeproj', 'xcshareddata', 'xcschemes', 'Template.xcscheme')),
      this.destinationPath(path.join('ios', this.name + '.xcodeproj', 'xcshareddata', 'xcschemes', this.name + '.xcscheme')),
      moduleTemplateParams
    );

    this.fs.copyTpl(
      this.templatePath('Podfile'),
      this.destinationPath(path.join('ios', 'Podfile')),
      moduleTemplateParams
    );
  },

  end: function() {
    var projectPath = path.resolve(this.destinationRoot(), 'ios', this.name);
    this.log(chalk.white.bold('To run your app on iOS:'));
    this.log(chalk.white('   cd ' + this.destinationRoot()));
    this.log(chalk.white('   react-native run-ios'));
    this.log(chalk.white('   - or -'));
    this.log(chalk.white('   Open ' + projectPath + '.xcodeproj in Xcode'));
    this.log(chalk.white('   Hit the Run button'));
  }
});
