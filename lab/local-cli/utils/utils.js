'use strict';

const fs = require('fs');
const path = require('path');
const child_process = require('child_process');

const request = require('request');
const ProgressBar = require('progress');

function capitalize(str) {
  if (!str) {
    return str;
  }
  return str[0].toUpperCase() + str.slice(1);
}

/**
 * 对request 封装 返回Promise
 */
function xRequest(options) {
  return new Promise((resolve, reject) => {
    request(options, (err, httpResponse, body) => {
      console.log('ddddddd', body);
      if (err) {
        reject(err);
      } else {
        resolve(httpResponse);
      }
    });
  });
}

/**
 * 基于request 的简单upload
 * @param options: {
 *   ... request 参数
 *   _filePath, //要上传的文件 用于获取总大小
 *   retryLimit, //最大重试次数
 * }
 * @return Promise
 */
function xUpload(options) {
  let retryLimit = options.retryLimit;
  if (retryLimit == null) {
    retryLimit = 5;
  }
  let attempts = 0;
  let resolve;
  let reject;
  let promise = new Promise((rs, rj) => {
    resolve = rs;
    reject = rj;
  });
  let fileStat = fs.lstatSync(options._filePath);
  function _upload() {
    let progressBar = new ProgressBar(
      'uploading [:bar] :percent :eta seconds remaining',
      {
        total: fileStat.size,
      }
    );
    let bytesWritten = 0;
    let req = request
      .post(options, (err, httpResponse, body) => {
        if (!err && options.json && typeof httpResponse.body !== 'object') {
          try {
            httpResponse.body = JSON.parse(httpResponse.body);
          } catch (e) {
            err = e;
          }
        }
        if (err) {
          if (++attempts < retryLimit) {
            console.log('upload error:', err);
            console.log('retry...');
            setTimeout(_upload, Math.random(4000) + 800);
          } else {
            reject(err);
          }
        } else {
          resolve(httpResponse);
        }
      })
      .on('drain', event => {
        //console.log('decoded drain: ', event, req.req.connection._bytesDispatched);

        let newBytesWritten = req.req.connection._bytesDispatched;
        progressBar.tick(newBytesWritten - bytesWritten);
        bytesWritten = newBytesWritten;
      });
  }

  _upload();

  return promise;
}

// function curlUpload(options) {
//   let pgyCliArgs = ['-F', "file=@"+options.file,
//                     '-F', "uKey="+options.uKey,
//                     '-F', "_api_key="+options._api_key,
//                     "https://qiniu-storage.pgyer.com/apiv1/app/upload"];

//   return new Promise((resolve, reject) => {
//     let pgyCli = child_process.spawn('curl', pgyCliArgs, {
//       stdio: [process.stdin, null, process.stderr],
//     });
//     //console.log(rnp.stderr, rnp.stdout);
//     let result = "";
//     pgyCli.stdout.on('data', (data) => {
//       process.stdout.write(data);
//       result += String(data);
//       //console.log(String(data));
//     });
//     pgyCli.on('close', (code) => {
//       if (code) {
//         reject({
//           code,
//           message: 'pgy publish process error:' + code,
//         });
//         return;
//       }
//       try {
//         resolve(JSON.parse(result));
//       } catch (e) {
//         reject(e);
//       }
//     });
//   });
// }

/**
 * options: {
 *   uKey,
 *   _api_key,
 *   changelog,
 *   file,
 * }
 */
function uploadToPgyer(options) {
  console.log('upload pgyer file:', options.file);

  const pgyCliArgs = [
    '-F',
    'file=@' + options.file,
    '-F',
    'uKey=' + options.uKey,
    '-F',
    '_api_key=' + options._api_key,
    'https://qiniu-storage.pgyer.com/apiv1/app/upload',
  ];

  return new Promise((resolve, reject) => {
    let pgyCli = child_process.spawn('curl', pgyCliArgs, {
      stdio: [process.stdin, null, process.stderr],
    });
    //console.log(rnp.stderr, rnp.stdout);
    let result = '';
    pgyCli.stdout.on('data', data => {
      process.stdout.write(data);
      result += String(data);
      // console.log('xxxxx', String(data));
    });
    pgyCli.on('close', code => {
      if (code) {
        reject({
          code,
          message: 'pgy publish process error:' + code,
        });
        return;
      }
      try {
        resolve(JSON.parse(result));
      } catch (e) {
        reject(e);
      }
    });
  }).then(res => {
    if (!res.data.appShortcutUrl) {
      return Promise.reject({
        code: 'upload-pgy-error',
        message: 'can not get downloadUrl',
      });
    }

    return {
      url: 'https://www.pgyer.com/' + res.data.appShortcutUrl,
      appBuildVersion: res.data.appBuildVersion,
    };
  });

  // const formData = {
  //   uKey: options.uKey,
  //   _api_key: options._api_key,
  //   updateDescription: options.changelog,
  //   file: {
  //     value: fs.createReadStream(options.file),
  //     options: {
  //       filename: path.parse(options.file).base,
  //     },
  //   },
  // };
  // return xUpload({
  //     url:'http://www.pgyer.com/apiv1/app/upload',
  //     formData,
  //     json: true,
  //     timeout: 600000,
  //     _filePath: options.file,
  //     jsonReviver: JSON.parse,
  //   }).then((res) => {
  //     let data = res.body;
  //     if (data.code) {
  //       return Promise.reject(data);
  //     }
  //     data = data.data;
  //     data.downloadUrl = 'https://www.pgyer.com/' + data.appShortcutUrl;
  //     return data;
  //   });
  // let formData = new FormData();
  // formData.append('uKey', options.uKey);
  // formData.append('_api_key', options._api_key);
  // if (options.updateDescription) {
  //   formData.append('updateDescription', options.updateDescription);
  // }
  // formData.append('file', fs.createReadStream(options.file));
  //
  // return axios({
  //   url: 'http://www.pgyer.com/apiv1/app/upload',
  //   method: 'post',
  //   data: formData,
  //   headers: formData.getHeaders(),
  //   responseType: 'json',
  //   onUploadProgress: (event) => {
  //     console.log('onUploadProgress', event);
  //   }
  // }).then((res) => {
  //   res.doenloadUrl = 'https://www.pgyer.com/' + res.appShortcutUrl;
  //   return res;
  // });
}

/**
 * options: {
 *   apiToken,
 *   changelog,
 *   file,
 * }
 */
function uploadFir(options) {
  let firCliArgs = ['publish', options.file, '-T', options.apiToken];
  if (options.changelog) {
    firCliArgs.push('-c');
    firCliArgs.push(options.changelog);
  }
  //console.log(firCliArgs);
  const response = {};
  return new Promise((resolve, reject) => {
    let firCli = child_process.spawn('fir', firCliArgs, {
      stdio: [process.stdin, null, process.stderr],
    });
    //console.log(rnp.stderr, rnp.stdout);
    firCli.stdout.on('data', data => {
      process.stdout.write(data);
      let line = String(data);
      if (line.indexOf('Published succeed:') > 0) {
        let start =
          line.indexOf('Published succeed:') + 'Published succeed:'.length;
        let end = line.indexOf('\n', start);
        if (end < 0) {
          end = line.lenght;
        }
        response.url = line.slice(start, end).trim();
      }
      //console.log(String(data));
    });
    firCli.on('close', code => {
      if (code) {
        reject({
          code,
          message: 'fir publish process error:' + code,
        });
      } else {
        if (!response.url) {
          reject({
            code: 'upload-fir-error',
            message: 'can not get downloadUrl',
          });
        } else {
          resolve(response);
        }
      }
    });
  });
}

/**
 * options: {
 *   app_key,
 *   app_id,
 *   changelog,
 *   file,
 * }
 */
function uploadBugly(options) {
  //TODO
  let formData = {
    app_key: options.app_key,
    app_id: options.app_id,
    file: fs.createReadStream(options.file),
  };
  console.log('upload bugly file:', file);
  return xUpload({
    url: 'https://api.bugly.qq.com/beta/apiv1/exp',
    formData,
    timeout: 600000,
    _filePath: options.file,
  }).then(res => {
    console.log(res);
  });
}

/**
 * options: {
 *   files,
 *   uploadDest,
 *   config,
 * }
 * 
 * @return Promise 没有reject状态
 * [{
 *   fileName,
 *   url,
 *   appBuildVersion,
 * }]
 */
function uploadApp(options) {
  const uploadConfig = options.config.getUploadConfig();
  const result = [];

  function _upload(file) {
    let p;
    const fileName = path.basename(file);
    if (options.uploadDest === 'fir') {
      p = uploadFir(
        Object.assign({}, uploadConfig.fir, {
          changelog: fileName,
          file,
        })
      );
    } else {
      p = uploadToPgyer(
        Object.assign({}, uploadConfig.pyger, {
          changelog: fileName,
          file,
        })
      );
    }
    return p.then(
      res => {
        res.fileName = fileName;
        result.push(res);
      },
      err => {
        err.fileName = fileName;
        result.push(err);
      }
    );
  }

  let p = Promise.resolve();
  options.files.forEach(file => {
    p = p.then(() => {
      return _upload(file);
    });
  });

  return p.then(() => {
    return result;
  });
}

/**
 * options: {
 *   platformFiles: {
 *     android: [files],
 *     ios: [files],
 *   },
 *   uploadDest,
 *   config,
 * }
 */
function uploadAppByPlatform(options) {
  let p = Promise.resolve();
  const uploadResult = {};
  for (let platform in options.platformFiles) {
    if (options.platformFiles.hasOwnProperty(platform)) {
      if (options.platformFiles[platform].length) {
        p = p.then(() => {
          return uploadApp({
            files: options.platformFiles[platform],
            uploadDest: options.uploadDest,
            config: options.config,
          }).then(res => {
            uploadResult[platform] = res;
          });
        });
      }
    }
  }
  return p.then(() => {
    return uploadResult;
  });
}

/**
 * 生成唯一标记，传入构建脚本，
 */
function generateAssembleOutputFileSymbol() {
  return String((Math.random() * 10000) << 0) + String(Date.now()).slice(4);
}

/**
 * 在构建脚本输出目录中根据symbol查找目标文件
 * @return file path  null 未找到
 */
function findOutputFile({ dir, symbol, version, ext }) {
  let files = fs.readdirSync(dir);
  let fileName = files.find(name => {
    return (
      name.indexOf(version) > 0 &&
      name.indexOf(symbol) > 0 &&
      name.endsWith(ext)
    );
  });
  return fileName ? path.join(dir, fileName) : null;
}

function findLastOutputFile({
  platform,
  module,
  buildType,
  version,
  buildConfig,
  ext,
}) {
  let dir = buildConfig.getOutputDir(platform);
  if (!fs.existsSync(dir)) {
    return null;
  }
  module = buildConfig.getPlatformModuleName(platform, module);
  let files = fs.readdirSync(dir);
  files = files.filter(name => {
    name = name.toLowerCase();
    if (!name.startsWith(module)) {
      return false;
    }
    if (buildType && name.indexOf(`-${buildType}-`) < 0) {
      return false;
    }
    if (version && name.indexOf(`-${version}-`) < 0) {
      return false;
    }
    if (ext && !name.endsWith(ext)) {
      return false;
    }
    return true;
  });
  if (!files.length) {
    return null;
  }
  let maxmtime = 0;
  return files.reduce((last, file) => {
    let time = fs.lstatSync(path.join(dir, file)).mtime.getTime();
    if (time > maxmtime) {
      maxmtime = time;
      return path.join(dir, file);
    }
    return last;
  }, null);
}

module.exports = {
  capitalize,
  xRequest,
  uploadToPgyer,
  uploadFir,
  uploadBugly,
  uploadApp,
  uploadAppByPlatform,
  generateAssembleOutputFileSymbol,
  findOutputFile,
  findLastOutputFile,
};
