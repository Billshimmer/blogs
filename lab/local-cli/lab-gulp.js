/**
 * lab gulp扩展
 */
'use strict';

const fs = require('fs');
const path = require('path');
const gulp = require('gulp-help')(require('gulp'));
const minimist = require('minimist');
const child_process = require('child_process');

const del = require('del');
const chalk = require('chalk');

const utils = require('./utils/utils');
const Config = require('./Config');

/**
 * 公共命令行参数
 * --module [string]  module名字 default mainModule 也可以是','分割的多个module 使用'_'表示所有module
 * --build-type [string]  default beta 构建类型
 * --platform [string]  android ios web native all
 * --lab-cli-config [string]  lab-cli.config.js文件的路径
 * --upload-dest [string]  pgyer fir  default pgyer 上传的目标平台
 */
Config.init(minimist(process.argv.slice(2), {
  // default: {
  //   'build-type': 'debug',
  // },
}));

const cliArgs = Config.getCliArgs();
const cliConfig = Config.getCliConfig();
const buildConfig = Config.getBuildConfig();

const PLATFORMS = ['android', 'ios', 'web', 'native', 'all'];

const MODULE_DESC = '模块';
const MODULES_DESC = '模块 可以是","分割的多个模块,"_" 表示当前项目所有模块';
const BUILD_TYPE_DESC = '构建类型';
const PLATFORM_DESC = '平台 android ios web';
const PLATFORMS_DESC = '平台 可以是","分割的多个平台,"all" 表示所有平台';
const UPLOAD_DEST_DESC = '上传平台 pyger fir';

/**
 * @param  defaultModule 默认module 如果不给(undefined)则默认会取mainModule
 */
function getModuleName(defaultModule) {
  let module = cliArgs['module'];
  if (!module && defaultModule !== undefined) {
    return defaultModule;
  }
  module = buildConfig.normalizeModuleName(module);
  if (!buildConfig.checkModuleName(module)) {
    throw new Error('module 不合法 module:', module, 'modules:', buldConfig.getLab4Config().modules);
  }
  return module;
}

/**
 * 获取buildType
 */
function getBuildType(defaultBuildType) {
  return buildConfig.normalizeBuildType(cliArgs['build-type'] || defaultBuildType);
}

/**
 * defaultPlatform 给null 则表示允许为空
 */
function getPlatform(defaultPlatform) {
  let platform = cliArgs['platform'];
  if (!platform) {
    if (defaultPlatform === null) {
      return null;
    }
    platform = defaultPlatform;
  }
  if (PLATFORMS.indexOf(platform) < 0) {
    throw new Error('platform 不合法 platform:', platform);
  }
  return platform;
}

function getNativePlatforms(defaultPlatform) {
  let platform = cliArgs['platform'];
  if (!platform) {
    platform = defaultPlatform;
  }
  if (!platform) {
    return [];
  }
  if (platform === 'all') {
    return ['android', 'ios'];
  }
  if (platform !== 'android' && platform !== 'ios') {
    throw new Error('invalid native platform', platform);
  }
  return [platform];
}

/**
 * 获取module 数组
 * @param defaultModule 默认的 与--module 参数格式相同
 * @return module 数组
 */
function getModules(defaultModule) {
  let module = cliArgs['module'];
  if (!module) {
    module = defaultModule;
  }
  if (!module) {
    return [];
  }
  if (module === '_') {
    return buildConfig.getLab4Config().modules.slice();
  }
  let modules = module.split(',');
  for (let i = 0; i < modules.length; ++i) {
    modules[i] = buildConfig.normalizeModuleName(modules[i]);
    if (!buildConfig.checkModuleName(modules[i])) {
      throw new Error('module 不合法 module:', modules[i], 'modules:', buildConfig.getLab4Config().modules);
    }
  }

  return modules;
}

function getUploadDest(defaultUploadDest) {
  return cliArgs['upload-dest'] || defaultUploadDest;
}

gulp.task('clean-build', '清空build', function() {
  return del(['build']);
});

function downloadTpl() {
  let outputDir = buildConfig.getTplsDownloadDestPath();
  return new Promise((resolve, reject) => {
    if (!buildConfig.getLab4Config().tplUrl) {
      reject('未配置tplUrl!');
      return;
    }
    del([outputDir]).then(() => {
      require('./downloadTpl').run({
        tplUrlsFile: buildConfig.getTplUrlsFile(),
        outputDir: outputDir,
        baseUrl: buildConfig.getLab4Config().tplUrl,
      }, resolve);
    }).catch((e) => {
      reject(e);
    });
  });
}

/**
 * 构建多个module 和platform
 * @return Promise 没有reject状态
 * {
 *   android: [files],
 *   ios: [files],
 *   error_android: [errors],
 *   error_ios: [errors],
 * }
 */
function assembleNative({
  modules,
  platforms,
  buildType,
}) {
  const android = require('./android');
  const ios = require('./ios');

  let assembleResult = {};
  let p = Promise.resolve(null);
  platforms.forEach((platform) => {
    assembleResult[platform] = [];
    let api = platform === 'android' ? android : ios;
    modules.forEach((module) => {
      p = p.then(() => {
        return api.assemble({
          outputDir: buildConfig.getOutputDir(platform),
          module,
          buildType,
          buildConfig,
          cliConfig,
        }).then((res) => {
          assembleResult[platform].push(res.file);
        }, (err) => {
          if (!assembleResult['error_' + platform]) {
            assembleResult['error_' + platform] = [];
          }
          assembleResult['error_' + platform].push(err);
          console.error(chalk.red(`========= assembleNative error platform: ${platform} module: ${module} buildType: ${buildType}`, err));
        });
      });
    });
  });
  return p.then(() => {
    return assembleResult;
  });
}

function printUploadResult(uploadResult) {
  function _print(res) {
    console.log(res);
  }
  if (uploadResult.android) {
    console.log(chalk.green('Android:'));
    _print(uploadResult.android);
  }
  if (uploadResult.ios) {
    console.log(chalk.green('iOS:'));
    _print(uploadResult.ios);
  }
}

function upload() {
  let modules = getModules('_');
  let platform = getPlatform('all');
  let buildType = getBuildType('beta');
  let uploadDest = getUploadDest('pgyer');
  let platforms = getNativePlatforms('all');

  console.log('upload modules:', modules, 'platform:', platform, 'buildType:', buildType, 'uploadDest:', uploadDest);

  return assembleNative({
    modules,
    platforms,
    buildType,
  }).then((assembleResult) => {
    console.log(chalk.green('assemble finished'));
    console.log(assembleResult);
    console.log();
    delete assembleResult['error_android'];
    delete assembleResult['error_ios'];
    return utils.uploadAppByPlatform({
      platformFiles: assembleResult,
      uploadDest,
      config: cliConfig,
    }).then((uploadResult) => {
      console.log('\n', chalk.green('upload finished'));
      printUploadResult(uploadResult);
    }, (err) => {
      console.error(chalk.red('upload error:'), err);
    });
  }, (err) => {
    console.error(chalk.red('assemble error:'), err);
  });
}

/**
 * 下载模板
 * 读取工程package.json中lab4.tplUrl
 * 以及工程根目录tplUrls.js配置文件
 * 下载之后放入build/tpls/
 */
gulp.task('download-tpl', '下载模板', function() {
  return downloadTpl();
});

/**
 * 构建lab4相关(comps, styles, images, tpls)
 * 由于build已整合到react-native bundle 所以一般不需要手动执行
 * 需要参数
 * --module
 * --build-type
 */
gulp.task('build-lab4', '手动build', function() {
  let module = getModuleName();
  let buildType = getBuildType('debug');
  console.log('build-lab4 module:', module, 'buildType:', buildType);
  const Builder = require('./Builder');
  const builder = new Builder({
    DEBUG: false,
    cliConfig,
    buildConfig,
    nonPersistent: true,
  });
  builder.build({
    module,
    buildType,
  });
}, {
  options: {
    'module': MODULE_DESC,
    'build-type': BUILD_TYPE_DESC,
  },
});

/**
 * 构建android 和 ios
 * 需要参数
 * --module 可以是','分割的多个module default '_'
 * --platform default all
 * --build-type default beta
 */
gulp.task('assemble', '打包', function() {
  let modules = getModules('_');
  let platform = getPlatform('all');
  let buildType = getBuildType('beta');
  let platforms = getNativePlatforms('all');

  console.log('assemble modules:', modules, 'platform:', platform, 'buildType:', buildType);

  return assembleNative({
    modules,
    platforms,
    buildType,
  }).then((res) => {
    console.log(chalk.green('assemble result:'), res);
  }, (err) => {
    console.error(chalk.red('assemble error:'), err);
  });
}, {
  options: {
    'module': MODULES_DESC + ' default "_"',
    'build-type': BUILD_TYPE_DESC + ' default "beta"',
    'platform': PLATFORMS_DESC + ' default "all"',
  },
});

/**
 * 构建生成android apk
 * 需要参数
 * --module 不给出module 代表所有module
 * --build-type
 */
gulp.task('assemble-android', function() {
  let modules = getModules('_');
  let buildType = getBuildType('beta');

  console.log('assemble-android modules:', modules, 'buildType:', buildType);

  return assembleNative({
    modules,
    platforms: ['android'],
    buildType,
  }).then((res) => {
    console.log('assemble-android result:', res);
  }, (err) => {
    console.error('assemble-android error:', err);
  });
});

/**
 * 构建生成ios ipa
 * 需要参数
 * --module 不给出module 代表所有module
 * --build-type
 */
gulp.task('assemble-ios', function() {
  let modules = getModules('_');
  let buildType = getBuildType('beta');

  console.log('assemble-ios modules:', modules, 'buildType:', buildType);

  return assembleNative({
    modules,
    platforms: ['ios'],
    buildType,
  }).then((res) => {
    console.log('assemble-ios result:', res);
  }, (err) => {
    console.error('assemble-ios error:', err);
  });
});

/**
 * 构建生成web bundle
 * 需要参数
 * --module
 * --build-type
 * 输出目录 build/outputs/web/rwpublic
 */
gulp.task('assemble-web', function() {

});

/**
 * assemble并上传
 * 需要参数
 * --module 可以是','分割的多个module default '_'
 * --platform default all
 * --build-type default beta
 * --upload-dest default pgyer
 */
gulp.task('upload', '打包并上传', function() {
  return upload();
}, {
  options: {
    'module': MODULES_DESC + ' default "_"',
    'build-type': BUILD_TYPE_DESC + ' default "beta"',
    'platform': PLATFORMS_DESC + ' default "all"',
    'upload-dest': UPLOAD_DEST_DESC + ' default "pyger"'
  },
});

/**
 * 上传outputs中最后打包的app
 * 需要参数
 * --module 可以是','分割的多个module default '_'
 * --platform default all
 * --build-type default beta
 * --upload-dest default pgyer
 * --current-version 是否需要版本号与当前配置相同 默认true
 */
gulp.task('upload-last', '上传最后打包的', function() {
  let modules = getModules('_');
  let platform = getPlatform('all');
  let buildType = getBuildType('beta');
  let uploadDest = getUploadDest('pgyer');
  let uploadCurrentVersion = cliArgs['current-version'];
  if (uploadCurrentVersion !== false) {
    uploadCurrentVersion = true;
  }
  let platforms = getNativePlatforms('all');

  let platformFiles = {};
  platforms.forEach((platform) => {
    platformFiles[platform] = [];
    let ext = platform === 'android' ? 'apk' : 'ipa';
    modules.forEach((module) => {
      let lastFile = utils.findLastOutputFile({
        platform,
        module,
        buildType,
        version: uploadCurrentVersion ? buildConfig.getConfig({
          module,
          buildType,
        }).version : null,
        buildConfig,
        ext,
      });
      if (lastFile) {
        platformFiles[platform].push(lastFile);
      }
    });
  });

  console.log(chalk.green('upload-last platformFiles:'));
  console.log(platformFiles);

  return utils.uploadAppByPlatform({
    platformFiles,
    uploadDest,
    config: cliConfig,
  }).then((uploadResult) => {
    console.log(chalk.green('upload finished'));
    printUploadResult(uploadResult);
  }, (err) => {
    console.error(chalk.green('upload error:'), err);
  });

}, {
  options: {
    'module': MODULES_DESC + ' default "_"',
    'build-type': BUILD_TYPE_DESC + ' default "beta"',
    'platform': PLATFORMS_DESC + ' default "all"',
    'upload-dest': UPLOAD_DEST_DESC + ' default "pyger"',
    'current-version': '必须上传与当前配置的version相同的版本，如果未找到当前version的最新包则不会上传  default true',
  },
});

/**
 * 清空outputs 文件夹
 * 需要参数
 * --platform  必须  web android ios all
 */
gulp.task('clean-outputs', '清空build/outputs/platform', function() {
  let platform = getPlatform(null);
  switch (platform) {
    case 'android':
    case 'ios':
    case 'web':
      return del(['build/outputs/' + platform]);
    case 'all':
      return del(['build/outputs']);
    default:
      console.log('必须给出platform参数');
      break;
  }
}, {
  options: {
    'platform': PLATFORMS_DESC,
  },
});

/**
 * 删除outputs目录中旧的构建输出 保留最新的几个
 * 需要参数
 * --platform  必须  web android ios all
 */
gulp.task('clean-old-outputs', function() {
  //TODO
});

/**
 * 增加version的最后一位,并重新写入config.js
 * TODO
 * 需要参数
 * --module  default mainModule
 */
gulp.task('version-patch', function() {
  let module = getModuleName();
  if (!buildConfig.checkModuleName(module)) {
    throw new Error('module not found', module);
  }

  let moduleConfigPath = buildConfig.getModuleConfigPath(module);
  let configStr = fs.readFileSync(moduleConfigPath, {
    encoding: 'UTF-8',
  });

  let oldVersion;
  let newVersion;

  // const blockCommentRe = /\/\*[^]*?\*\//g;
  // const lineCommentRe = /\/\/.*/g;
  const versionRe = /(\bversion\s*:\s*['"`])([^'"`]+)(['"`])/;

  configStr = configStr
    // .replace(blockCommentRe, '')
    // .replace(lineCommentRe, '')
    .replace(versionRe, (match, pre, version, after) => {
      oldVersion = version;
      let varr = version.split('.');
      varr[2] = String(Number(varr[2]) + 1);
      newVersion = varr.join('.');
      return pre + newVersion + after;
    });

  console.log('version-patch oldVersion', oldVersion, 'newVersion', newVersion);
  fs.writeFileSync(moduleConfigPath, configStr);
});

gulp.task('download-tpl-upload', ['download-tpl'], function() {
  return upload();
});

/**
 * duang~
 */
gulp.task('duang', 'git pull -> npm i -> download-tpl -> upload', function() {
  let upProcess;
  if (fs.existsSync('.git')) {
    upProcess = child_process.spawnSync('git', ['pull'], {
      stdio: [process.stdin, process.stdout, process.stderr],
    });
  } else {
    upProcess = child_process.spawnSync('svn', ['up'], {
      stdio: [process.stdin, process.stdout, process.stderr],
    });
  }
  if (upProcess.error) {
    throw upProcess.error;
  }

  const packageDeps = buildConfig.getPackageJson().dependencies || [];
  let needInstallDeps = [];
  // 目前测试 执行npm update 时 不会对git引用并且指定分支的库进行更新，所以需要找出这些依赖库，执行install
  for (let depName in packageDeps) {
    if (packageDeps[depName] && packageDeps[depName].indexOf('git') >= 0 &&packageDeps[depName].indexOf('#') >= 0) {
      needInstallDeps.push(depName);
    }
  }

  if (needInstallDeps.length) {
    let npmProcess1 = child_process.spawnSync('npm', ['install', '--verbose', '--registry', 'https://registry.npm.taobao.org'].concat(needInstallDeps), {
      stdio: [process.stdin, process.stdout, process.stderr],
    });
    if (npmProcess1.error) {
      throw npmProcess1.error;
    }
  }

  let npmProcess = child_process.spawnSync('npm', ['update', '--verbose', '--registry', 'https://registry.npm.taobao.org'], {
    stdio: [process.stdin, process.stdout, process.stderr],
  });
  if (npmProcess.error) {
    throw npmProcess.error;
  }
  let downloadTplPromise;
  if (buildConfig.getLab4Config().tplUrl) {
    downloadTplPromise = downloadTpl();
  } else {
    downloadTplPromise = Promise.resolve(null);
  }
  return downloadTplPromise.then(() => upload());
}, {
  options: {
    'module': MODULES_DESC + ' default "_"',
    'build-type': BUILD_TYPE_DESC + ' default "beta"',
    'platform': PLATFORMS_DESC + ' default "all"',
    'upload-dest': UPLOAD_DEST_DESC + ' default "pyger"',
  },
});

gulp.task('bundle-web', 'web打包', function(done) {
  const module = getModuleName();
  const entryFile = cliArgs['entry-file'];
  if (!entryFile) {
    throw new Error('entry-file 必须提供');
  }
  const outputDir = path.join(buildConfig.getOutputDir('web'), module, 'rwpublic');
  return del([outputDir])
    .then(() => {
      return require('./web').bundle({
        module,
        buildType: cliArgs['build-type'] || 'release',
        outputDir,
        buildConfig,
        cliConfig,
        entryFile,
      });
    }).then(() => {
      console.log('bundle-web success', outputDir);
    }, (err) => {
      console.error(err);
    });
}, {
  options: {
    'module': 'web module',
    'build-type': '使用的html文件 index.[build-type].html',
    'entry-file': '入口文件 相对于module文件夹',
  },
});

module.exports = {
  // 解析后的命令行参数 minimist
  cliArgs,
  // labCliConfig配置对象
  cliConfig,
  // BuildConfig 对象
  buildConfig,
  getModuleName,
  getModules,
  getBuildType,
  getPlatform,
  getNativePlatforms,
};
