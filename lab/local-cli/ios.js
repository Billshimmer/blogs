'use strict';

const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const minimist = require('minimist');
const child_process = require('child_process');

const utils = require('./utils/utils');

/**
 * @param options: {
 *   module,
 *   buildType,
 *   outputDir,
 * }
 * @return Promise
 * resolve:
 * {
 *   file,
 * }
 */
function assemble({module, buildType, outputDir, buildConfig, cliConfig}) {
  let labOutputSymbol = utils.generateAssembleOutputFileSymbol();
  const bconfig = buildConfig.getConfig({module, buildType, platform: 'ios'});
  console.log('assemble ios module:', module, 'buildType:', buildType, 'version:', bconfig.version, 'labOutputSymbol:', labOutputSymbol);

  //查找ios 主模块 ios 主模块一般跟项目名字相同
  let iosModule = module;
  if (iosModule === buildConfig.getLab4Config().mainModule && !fs.existsSync(path.join(buildConfig.getPlatformPath('ios'), iosModule))) {
    iosModule = buildConfig.getProjectName();
  }

  return new Promise((resolve, reject) => {
    let processBuild = child_process.spawn('ruby', ['package.rb', '--module', iosModule, '--build-type', utils.capitalize(buildType),
      '--output-dir', outputDir, '--build-code', labOutputSymbol, '--build-version', bconfig.version], {
      cwd: path.join(cliConfig.getProjectRoot(), 'ios'),
      stdio: [process.stdin, process.stdout, process.stderr],
    });
    processBuild.on('close', (code) => {
      if (code) {
        reject({
          code,
          message: 'assemble ios error module:' + module,
        });
      } else {
        let outputFile = utils.findOutputFile({
          dir: outputDir,
          symbol: labOutputSymbol,
          version: bconfig.version,
          ext: 'ipa',
        });
        if (!outputFile) {
          reject({
            code: 'ios-output-file-not-found',
            message: 'assemble ios 输出文件未找到 module:' + module,
          });
        } else {
          resolve({
            file: outputFile,
          });
        }
      }
    });
  });
}

module.exports = {
  assemble,
};
