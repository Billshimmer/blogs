'use strict';

require('react-native/local-cli/cli');

const path = require('path');
const fs = require('fs-extra');

const defaultConfig = require('react-native/local-cli/default.config');
const Config = require('react-native/local-cli/util/Config');
const defaultAssetExts = require('react-native/packager/defaultAssetExts');
const Server = require('react-native/packager/react-packager/src/Server');
const minify = require('react-native/packager/react-packager/src/JSTransformer/worker/minify');

function getRNCliConfig() {
  let cwd = __dirname;
  let configPath = Config.findConfigPath(cwd);

  return Config.get(cwd, defaultConfig, configPath);
}

/**
 * 使用react-native Server.getDependencies 的尝试
 * options: {
 *   outputDir,
 * }
 */
function getLab4Dependencies(options) {
  const config = getRNCliConfig();
  const assetExts = (config.getAssetExts && config.getAssetExts()) || [];

  const serverOptions = {
    projectRoots: config.getProjectRoots(),
    assetExts: defaultAssetExts.concat(assetExts),
    assetRoots: config.getAssetRoots(),
    blacklistRE: config.getBlacklistRE(),
    getTransformOptionsModulePath: config.getTransformOptionsModulePath,
    transformModulePath: config.getTransformModulePath(),
    extraNodeModules: config.extraNodeModules,
    nonPersistent: true,
    resetCache: true,
  };

  const projectRoot = config.getProjectRoots()[0];

  const serverInstance = new Server(serverOptions);
  return serverInstance.getDependencies({
    entryFile: path.join(__dirname, '../index.js'),
    dev: true,
    minify: true,
    platform: 'android', //先请求android的 对结果中以.native.js 或.android.js 结尾的在寻找其它平台的模块 .js .ios.js .web.js
  }).then((resolutionResponse) => {
    //console.log(resolutionResponse);
    return resolutionResponse.dependencies.filter((module) => {
      if (module.isPolyfill()) {
        return false;
      }
      if (module.path.indexOf('node_modules') >= 0) {
        return false;
      }
      if (!module.path.startsWith(projectRoot)) {
        return false;
      }
      return true;
    });
  }).then((modules) => {
    return Promise.all(modules.map(module => {
      return outputModule(module, projectRoot, options.outputDir);
    }));
  }, (error) => {
    console.log('error:', error);
  });
}

function outputModule(module, projectRoot, outputDir) {
  return module.getCode()
    .then(code => {
      if (!module.isJSON()) {
        code = minify(null, code, null).code;
      }
      let relativePath = path.relative(projectRoot, module.path);
      let fileOutputPath = path.join(outputDir, relativePath);
      let fileOutputDir = path.dirname(fileOutputPath);
      if (!fs.existsSync(fileOutputDir)) {
        fs.ensureDirSync(fileOutputDir);
      }
      return new Promise((resolve, reject) => {
        fs.writeFile(fileOutputPath, code, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve(fileOutputPath);
          }
        });
      });
    })
}

module.exports = getLab4Dependencies;
