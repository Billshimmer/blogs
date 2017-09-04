'use strict';

var execSync = require('child_process').execSync;
var fs = require('fs');
var path = require('path');
var semver = require('semver');
var yeoman = require('yeoman-generator');

// Use Yarn if available, it's much faster than the npm client.
// Return the version of yarn installed on the system, null if yarn is not available.
function getYarnVersionIfAvailable() {
  let yarnVersion;
  try {
    // execSync returns a Buffer -> convert to string
    if (process.platform.startsWith('win')) {
      yarnVersion = (execSync('yarn --version').toString() || '').trim();
    } else {
      yarnVersion = (execSync('yarn --version 2>/dev/null').toString() || '').trim();
    }
  } catch (error) {
    return null;
  }
  // yarn < 0.16 has a 'missing manifest' bug
  try {
    if (semver.gte(yarnVersion, '0.16.0')) {
      return yarnVersion;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Cannot parse yarn version: ' + yarnVersion);
    return null;
  }
}

/**
 * Check that 'react-native init' itself used yarn to install React Native.
 * When using an old global react-native-cli@1.0.0 (or older), we don't want
 * to install React Native with npm, and React + Jest with yarn.
 * Let's be safe and not mix yarn and npm in a single project.
 * @param projectDir e.g. /Users/martin/AwesomeApp
 */
function isGlobalCliUsingYarn(projectDir) {
  return fs.existsSync(path.join(projectDir, 'yarn.lock'));
}

module.exports = yeoman.generators.NamedBase.extend({
  constructor: function() {
    yeoman.generators.NamedBase.apply(this, arguments);

    // TODO
    this.option('skip-ios', {
      desc: 'Skip generating iOS files',
      type: Boolean,
      defaults: false
    });

    // TODO
    this.option('skip-android', {
      desc: 'Skip generating Android files',
      type: Boolean,
      defaults: false
    });

    // TODO
    this.option('upgrade', {
      desc: 'Specify an upgrade',
      type: Boolean,
      defaults: false
    });
    // Temporary option until yarn becomes stable.
    this.option('npm', {
      desc: 'Use the npm client, even if yarn is available.',
      type: Boolean,
      defaults: false
    });

    // 读取lab4配置
    this._lab4Config = this.fs.readJSON(this.destinationPath('package.json')).lab4;

    // this passes command line arguments down to the composed generators
    var args = {args: arguments[0], options: this.options};
    if (!this.options['skip-ios']) {
      this.composeWith('lab4:ios', args, {
        local: require.resolve(path.resolve(__dirname, '..', 'generator-ios'))
      });
    }
    if (!this.options['skip-android']) {
      this.composeWith('lab4:android', args, {
        local: require.resolve(path.resolve(__dirname, '..', 'generator-android'))
      });
    }
  },

  configuring: function() {
    // TODO
    // utils.copyAndReplace(
    //   this.templatePath('../../../.flowconfig'),
    //   this.destinationPath('.flowconfig'),
    //   {
    //     'Libraries\/react-native\/react-native-interface.js' : 'node_modules/react-native/Libraries/react-native/react-native-interface.js',
    //     '^flow/$' : 'node_modules/react-native/flow\nflow/'
    //   }
    // );

    this.fs.copy(
      this.templatePath('_gitignore'),
      this.destinationPath('.gitignore')
    );
    this.fs.copy(
      this.templatePath('_watchmanconfig'),
      this.destinationPath('.watchmanconfig')
    );

    // TODO
    // this.fs.copy(
    //   this.templatePath('_buckconfig'),
    //   this.destinationPath('.buckconfig')
    // );
  },

  writing: function() {
    if (this.options.upgrade) {
      // never upgrade index.*.js files
      return;
    }
    let templateCommonParams = {
      name: this.name,
      nameLowerCase: this.name.toLowerCase(),
    };
    this.fs.copyTpl(
      this.templatePath(path.join('app', '**')),
      this.destinationRoot(),
      templateCommonParams
    );

    let modules = this._lab4Config.modules;
    let zhcnNames = this._lab4Config._zhcnNames;
    if (modules.length < 2) {
      this.fs.copyTpl(
        this.templatePath(path.join('module', '**')),
        this.destinationRoot(),
        Object.assign({
          moduleName: modules[0],
          zhcnModuleName: zhcnNames[0],
        }, templateCommonParams)
      );
    } else {
      for (let i = 0; i < modules.length; ++i) {
        this.fs.copyTpl(
          this.templatePath(path.join('module', '**')),
          this.destinationPath(modules[i]),
          Object.assign({
            moduleName: modules[i],
            zhcnModuleName: zhcnNames[i],
          }, templateCommonParams)
        );
      }
    }
  },

  install: function() {
    if (this.options.upgrade) {
      return;
    }

    var lab4PackageJson = require('../../package.json');
    var { peerDependencies } = lab4PackageJson;
    if (!peerDependencies) {
      return;
    }

    //TODO 解决 conflict
    this.fs.extendJSON(this.destinationPath('package.json'), {
      dependencies: peerDependencies,
    });
    // 只是将lab4需要的依赖放入package.json 不安装依赖 在工程创建之后手动安装
  }
});
