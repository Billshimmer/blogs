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
var fs = require('fs');
var path = require('path');
var yeoman = require('yeoman-generator');

function validatePackageName(name) {
  if (!name.match(/^([a-zA-Z][a-zA-Z\d_]*\.)+([a-zA-Z_][a-zA-Z\d_]*)$/)) {
    return false;
  }
  return true;
}

module.exports = yeoman.generators.NamedBase.extend({
  constructor: function() {
    yeoman.generators.NamedBase.apply(this, arguments);

    this.option('package', {
      desc: 'Package name for the application (com.example.app)',
      type: String,
      defaults: 'com.backustech.apps.' + this.name.toLowerCase()
    });
    this.option('upgrade', {
      desc: 'Specify an upgrade',
      type: Boolean,
      defaults: false
    });

    // 读取lab4配置
    this._lab4Config = this.fs.readJSON(this.destinationPath('package.json')).lab4;
  },

  initializing: function() {
    if (!validatePackageName(this.options.package)) {
      throw new Error('Package name ' + this.options.package + ' is invalid');
    }
  },

  _generateModule: function({
    packageName,
    moduleName,
    zhcnModuleName,
    moduleFolderName = moduleName,
    entryFile,
    templateParams,
  }) {
    templateParams = Object.assign({
      package: packageName,
      moduleName,
      zhcnModuleName,
      entryFile,
    }, templateParams);
    this.fs.copyTpl(
      this.templatePath(path.join('module', '**')),
      this.destinationPath(path.join('android', moduleFolderName)),
      templateParams
    );
    this.fs.copy(
      this.templatePath(path.join('moduleBin', '**')),
      this.destinationPath(path.join('android', moduleFolderName))
    );
    var javaPath = path.join.apply(
      null,
      ['android', moduleFolderName, 'src', 'main', 'java'].concat(packageName.split('.'))
    );
    this.fs.copyTpl(
      this.templatePath(path.join('package', '**')),
      this.destinationPath(javaPath),
      templateParams
    );
  },

  writing: function() {
    var templateParams = {
      name: this.name,
      nameLowerCase: this.name.toLowerCase(),
    };
    let modules = this._lab4Config.modules;
    let zhcnNames = this._lab4Config._zhcnNames;
    this.fs.copyTpl(
      this.templatePath(path.join('src', '**')),
      this.destinationPath('android'),
      templateParams
    );
    this.fs.copy(
      this.templatePath(path.join('bin', '**')),
      this.destinationPath('android')
    );

    let settingsProjectInclude = `include ':react-native-image-picker'\nproject(':react-native-image-picker').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-image-picker/android')`;

    if (modules.length < 2) {
      this._generateModule({
        packageName: this.options.package,
        moduleName: modules[0],
        zhcnModuleName: zhcnNames[0],
        moduleFolderName: modules[0],
        entryFile: 'main',
        templateParams,
      });
      this.fs.write(this.destinationPath(path.join('android', 'settings.gradle')), `rootProject.name = '${templateParams.name}'\ninclude ':${modules[0]}'\n${settingsProjectInclude}`);
    } else {
      let settingsContents = [`rootProject.name = '${templateParams.name}`];
      for (let i = 0; i < modules.length; ++i) {
        let packageName = this.options.package;
        if (templateParams.nameLowerCase != modules[i]) {
          packageName = packageName + '.' + modules[i];
        }
        this._generateModule({
          packageName,
          moduleName: modules[i],
          zhcnModuleName: zhcnNames[i],
          entryFile: modules[i] + '/main',
          templateParams,
        });
        settingsContents.push(`include ':${modules[i]}'`);
      }
      settingsContents.push(settingsProjectInclude);
      this.fs.write(this.destinationPath(path.join('android', 'settings.gradle')), settingsContents.join('\n'));
    }
  },

  end: function() {
    var projectPath = this.destinationRoot();
    this.log(chalk.white.bold('To run your app on Android:'));
    this.log(chalk.white('   Have an Android emulator running (quickest way to get started), or a device connected'));
    this.log(chalk.white('   cd ' + projectPath));
    this.log(chalk.white('   react-native run-android'));
  }
});
