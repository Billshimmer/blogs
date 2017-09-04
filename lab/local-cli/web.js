'use strict';

const fs = require('fs-extra');
const path = require('path');
const child_process = require('child_process');
const gulp = require('gulp');
const CleanCSS = require('clean-css');

function bundle({
  module,
  buildType,
  entryFile,
  buildConfig,
  cliConfig,
  outputDir,
}) {
  const moduleDir = buildConfig.getModuleDir(module);

  const bundleJsDir = path.join(outputDir, 'js');
  if (!fs.existsSync(bundleJsDir)) {
    fs.ensureDirSync(bundleJsDir);
  }

  const webDir = path.join(cliConfig.getProjectRoot(), 'web');
  let webEntry;
  if (buildType === 'debug') {
    webEntry = 'index.html';
  } else {
    webEntry = 'index.' + buildType + '.html';
  }
  webEntry = path.join(webDir, webEntry);
  if (!fs.existsSync(webEntry)) {
    return Promise.reject({
      code: 'web-entry-not-exists',
      message: '网页入口不存在:' + webEntry,
    });
  }

  const bundlePromise = new Promise((resolve, reject) => {
    const bundleProcess = child_process.spawn('node', [path.join(cliConfig.getProjectRoot(), 'node_modules/lab-react-native-web/local-cli/cli.js'), 'bundle',
      '--platform', 'web',
      '--dev', 'false',
      '--entry-file', path.relative(cliConfig.getProjectRoot(), path.join(moduleDir, entryFile)),
      '--bundle-output', path.join(bundleJsDir, 'app.js'),
      '--assets-dest', outputDir,
      '--css-dest', path.join(outputDir, 'css')], {
      stdio: [process.stdin, process.stdout, process.stderr],
    });
    bundleProcess.on('close', (code) => {
      if (code) {
        reject({
          code,
          message: 'bundle web error module:' + module,
        });
      } else {
        resolve();
      }
    });
  });

  return bundlePromise.then(() => {
    console.log('copying resource ...');
    let copyPromises = [];
    //拷贝lab4资源
    const lab4WebDir = path.join(cliConfig.getProjectRoot(), 'node_modules', 'lab4', 'web');
    if (fs.existsSync(lab4WebDir)) {
      copyPromises = copyPromises.concat(copyResources(lab4WebDir, outputDir));
    }

    // copy 当前工程下的资源
    copyPromises = copyPromises.concat(copyResources(webDir, outputDir));

    // copy index.html
    copyPromises.push(streamToPromise(fs.createReadStream(webEntry)
      .pipe(fs.createWriteStream(path.join(outputDir, 'index.html')))));

    if (copyPromises.length) {
      return Promise.all(copyPromises);
    }
  }).then(() => {
    const appCssPath = path.join(outputDir, 'css', 'app.css');
    if (!fs.existsSync(appCssPath)) {
      return;
    }
    console.log('minify app.css ...');
    return new CleanCSS({
      returnPromise: true,
      compatibility: 'ie9',
    }).minify([appCssPath]).then((output) => {
      fs.writeFileSync(path.join(outputDir, 'css', 'app.min.css'), output.styles, { encoding: 'utf8', });
    });
  });
}

function copyResources(fromDir, toDir) {
  return ['js', 'css', 'fonts'].map((dir) => {
    return streamToPromise(gulp.src(path.join(fromDir, dir, '**'))
      .pipe(gulp.dest(path.join(toDir, dir))));
  });
}

function streamToPromise(stream) {
  return new Promise((resolve, reject) => {
    stream.on('finish', (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

module.exports = {
  bundle,
};