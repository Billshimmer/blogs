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
 *   buildConfig,
 *   cliConfig,
 * }
 * @return Promise
 * resolve:
 * {
 *   file,
 * }
 */
function assemble({module, buildType, outputDir, buildConfig, cliConfig}) {
  let labOutputSymbol = utils.generateAssembleOutputFileSymbol();
  const bconfig = buildConfig.getConfig({module, buildType, platform: 'android'});
  console.log('assemble android module:', module, 'buildType:', buildType, 'version:', bconfig.version, 'labOutputSymbol:', labOutputSymbol);

  const cmd = process.platform.startsWith('win')
      ? 'gradlew.bat'
      : './gradlew';

  let gradleCmd = `:${buildConfig.getPlatformModuleName('android', module)}:assembleAndCopy${utils.capitalize(buildType)}`;
  const gradleArgs = [gradleCmd, '-PlabOutputSymbol=' + labOutputSymbol];

  return new Promise((resolve, reject) => {
    let androidProcess = child_process.spawn(cmd, gradleArgs, {
      cwd: buildConfig.getPlatformPath('android'),
      stdio: [process.stdin, process.stdout, process.stderr],
    });
    androidProcess.on('close', (code) => {
      if (code) {
        reject({
          code,
          message: 'assemble android error module:' + module,
        });
      } else {
        let outputFile = utils.findOutputFile({
          dir: outputDir,
          symbol: labOutputSymbol,
          version: bconfig.version,
          ext: 'apk',
        });
        if (!outputFile) {
          reject({
            code: 'android-output-file-not-found',
            message: 'assemble android 输出文件未找到 module:' + module,
            module,
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
