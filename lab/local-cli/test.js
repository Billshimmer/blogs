'use strict';

const path = require('path');
const fs = require('fs');
const child_process = require('child_process');

const request = require('request');
const chalk = require('chalk');
// const axios = require('axios');

const Builder = require('./Builder');
const Config = require('./Config');
const utils = require('./utils/utils');
const del = require('del');

Config.init();

function testBuilder() {
  const builder = new Builder({
    DEBUG: true,
    cliConfig: Config.getCliConfig(),
    buildConfig: Config.getBuildConfig(),
    nonPersistent: false,
  });

  builder.build({
    module: 'demo',
    buildType: 'debug',
  });

  setInterval(() => {
    builder.build({
      module: 'demo',
      buildType: 'debug',
    });
  }, 5000);
}

function testMinimist() {
  const minimist = require('minimist');

  let cliArgs = minimist(process.argv.slice(2));

  console.log(cliArgs);
}

function testPgyerUpload() {
  let file = path.join(__dirname, '../build/outputs/android/app-debug-1.1.0-16-11-21_14-58.apk');
  utils.uploadToPgyer({
    uKey: 'b5660cab6198c4607f660bfc36d84b2b',
    _api_key: 'b8ea37e3abb06238e3ee8c7ace0c01d9',
    changelog: 'xxxx1',
    file,
  }).then((res) => {
    console.log('testPgyerUpload res:', res);
  }, (err) => {
    console.log('testPgyerUpload err:', err);
  });
}

function testAxios() {
  axios.get('http://www.baidu.com')
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
}

function testXRequest() {
  utils.xRequest({
    url: 'http://www.pgyer.com/apiv1/app/upload',
    method: 'get',
    json: true,
  }).then((res) => {
    console.log('xRequest res:', res.body, typeof res.body);
  }, (err) => {
    console.log('xRequest err:', err);
  });
}

function testMinifyLab4() {
  let file = path.join(__dirname, '../basiccomps/ListView/SimpleListView.js');
  require('./rn-minify-gulp').xxx({
    path: file,
    contents: fs.readFileSync(file, {
      encoding: 'UTF-8',
    }),
  });
}

function testChildProcess() {
  // child_process.exec('vim xxx.txt', (error, stdout, stderr) => {
  //   console.log('xxxx error:', error, '\n\nstdout:', String(stdout), '\n\nstderr:', String(stderr));
  // });
  // let stdout = child_process.execSync('react-native --version', {
  //   // 如果这里指定了stdio 则返回的stdout为null
  //   stdio: [process.stdin, process.stdout, process.stderr],
  // });
  // console.log('xxxx stdout:', String(stdout));

  // child_process.execFile('react-native', ['--version'], {
  //
  // }, (error, stdout, stderr) => {
  //   console.log('xxxx error:', error, '\n\nstdout:', String(stdout), '\n\nstderr:', String(stderr));
  // });

  // let stdout = child_process.execFileSync('vim', ['xxx.txt'], {
  //   // 如果这里指定了stdio 则返回的stdout为null
  //   //stdio: [process.stdin, process.stdout, process.stderr],
  // });
  // console.log('xxxx stdout:', String(stdout));

  let rnp = child_process.spawn('vim', ['xxx.txt'], {
    stdio: [process.stdin, process.stdout, process.stderr],
  });
  // //console.log(rnp.stderr, rnp.stdout);
  // rnp.stdout.on('data', (data) => {
  //   process.stdout.write(data);
  //   //console.log(String(data));
  // });
  rnp.on('close', (code) => {
    console.log('xxxx code:', code);
  });
}

function testUploadFir() {
  let file = path.join(__dirname, '../build/outputs/android/app-debug-1.0.1_16-11-15_18-05.apk');
  //console.log(fs.existsSync(file));
  utils.uploadFir({
    apiToken: '9e10a1c2474c668d95e48c575327b9df',
    changelog: 'xxxx1',
    file,
  }).then((res) => {
    console.log('uploadFir success', res);
  }, (error) => {
    console.log('uploadFir error:', error);
  });
}

function testUploadBugly() {
  let file = path.join(__dirname, '../build/outputs/android/app-debug-1.0.1_16-11-15_18-05.apk');
  //console.log(fs.existsSync(file));
  utils.uploadBugly({
    app_key: 'YVWZ5fJGbL8rlk0Z',
    app_id: '900046114',
    changelog: 'xxxx1',
    file,
  }).then((res) => {
    console.log('uploadFir success', res);
  }, (error) => {
    console.log('uploadFir error:', error);
  });
}

function testGenerator() {
  const init = require('./init');
  init(path.join(__dirname, '../build/xxx'), 'AwesomeProject');
}

// testXRequest();

// testGenerator();

// testPgyerUpload();

// testUploadBugly();

//testUploadFir();

//testChildProcess();
// testPgyerUpload();
//
// console.log(path.parse('adfa/adfad.xxxx1').name);
// console.log('xxx', chalk.red({a: 1}));
testPgyerUpload();
