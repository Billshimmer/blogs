'use strict';

const fs = require('fs-extra');
const path = require('path');
const buildUtils = require('./buildUtils');
const buildComps = require('./buildComps');
const buildStyles = require('./buildStyles');
const buildImages = require('./buildImages');
const buildTpls = require('./buildTpls');
const execSync = require('child_process').execSync;
const sane = require('sane');

const canUseWatchman = (function() {
  try {
    execSync('watchman version', {stdio: ['ignore']});
    return true;
  } catch (e) {
    console.log('canUseWatchman execSync error', e);
  }
  return false;
})();

const WatcherClass = canUseWatchman ? sane.WatchmanWatcher : sane.NodeWatcher;

//输出config.json 文件中不需要的字段(主要是一些在构建时使用的的设置)
const outputConfigBlackFields = [
  'android', 'ios', 'web',
  'tplUrl', 'packageWhitelist', 'imageBlacklist', 'compBlacklist', 'packageWhiteList', 'imageBlackList',
];

function optionsHash(options) {
  return JSON.stringify(options);
}

class Builder {

  /**
   * options: {
   *   cliConfig,
   *   buildConfig: BuildConfig,
   *   DEBUG: boolean,
   *   nonPersistent: Boolean, //是否不需要缓存
   * }
   */
  constructor(options) {
    this.DEBUG = options.DEBUG;
    this._cliConfig = options.cliConfig;
    this._buildConfig = options.buildConfig;
    this._nonPersistent = options.nonPersistent;
    this._compsCache = Object.create(null);
    this._stylesCache = Object.create(null);
    this._imagesCache = Object.create(null);
    this._tplsCache = Object.create(null);
    this._configCache = Object.create(null);

    if (!options.nonPersistent) {
      this._initWatchers();
    }
  }

  _initWatchers() {
    let buildConfig = this._buildConfig;
    // TODO comps style 的匹配规则应该根据projectConfigs确定
    const compsPathReg = /^(?:node_modules[\\/]lab4[\\/])?comps(?:[\\/].*)?$/;
    const stylePathReg = /^(?:node_modules[\\/]lab4[\\/])?style(?:[\\/].*)?$/;
    const imgPathReg = /^img(?:[\\/].*)?$/;
    //const tplsPathReg = /^build[\\/]tpls(?:[\\/].*)?$/;
    let modules = buildConfig.getLab4Config().modules;
    let routeManifestRegs = modules.map((module) => {
      // XXX new RegExp(`^${module}[\\\\/]RouteManifest.js$`)
      return `${module}${path.sep}RouteManifest.js`;
    });
    let configRegs = modules.map((module) => {
      return `${module}${path.sep}config.js`;
    });

    this._fileWatcher = new WatcherClass(this._cliConfig.getProjectRoot());
    this._fileWatcher.on('all', (event, filePath, root) => {
      //console.log('watcher', event, filePath);
      let addOrDelete = event === 'add' || event === 'delete';
      if (addOrDelete) {
        if (compsPathReg.test(filePath)) {
          this._compsCache = Object.create(null);
        } else if (stylePathReg.test(filePath)) {
          this._stylesCache = Object.create(null);
        } else if (imgPathReg.test(filePath)) {
          this._imagesCache = Object.create(null);
        }
      }
      if (filePath === 'RouteManifest.js' || routeManifestRegs.some(v => v === filePath)) {
        this._tplsCache = Object.create(null);
      } else if (filePath === 'config.js' || configRegs.some(v => v === filePath)) {
        // TODO cache区分module
        buildConfig.clearCache();
        this._configCache = Object.create(null);
      }
    });
  }

  /**
   * options: {
   *   module,
   *   buildType,
   *   platform,
   *   configOnly, //只构建config.json
   *   outputDir, //输出目录 如果给出则缓存无效
   *   ignoreCache, // 是否忽略已有缓存
   *   enableCache, // 构建完成之后是否写入缓存
   * }
   * @return res: {
   *   fileChanged, //是否有写文件
   * }
   */
  build({
    module,
    buildType,
    platform,
    configOnly,
    outputDir,
    ignoreCache = false,
    enableCache = true
  }) {
    console.time('Builder build time');
    if (!module || !buildType) {
      throw new Error('Error: !module || !buildType');
    }
    let buildConfig = this._buildConfig;
    let buildDestPath = outputDir || buildConfig.getBuildDestPath(module, buildType);
    if (outputDir) {
      ignoreCache = true;
      enableCache = false;
    }
    if (!fs.existsSync(buildDestPath)) {
      ignoreCache = true;
      fs.ensureDirSync(buildDestPath);
    }

    if (!configOnly) {
      const packageWhitelist = buildConfig.getPackageWhitelist(module, buildType);
      const imageBlacklist = buildConfig.getImageBlacklist(module, buildType);
      const compBlacklist = buildConfig.getCompBlacklist(module, buildType);
      const compFilter = buildConfig.getCompFilter(module, buildType);

      const cacheKeyCompStyle = optionsHash({
        module,
        buildType,
        packageWhitelist,
        compBlacklist,
      });

      //comps
      this._buildAndOutput({
        cacheKey: cacheKeyCompStyle,
        options: {
          DEBUG: this.DEBUG,
          compsDir: 'comps',
          projectConfigs: buildConfig.getProjectConfigs(),
          compFilter,
        },
        buildFunc: buildComps,
        buildDestPath,
        destFileName: 'comps.js',
        cache: this._compsCache,
        ignoreCache,
        enableCache,
      });

      //styles
      this._buildAndOutput({
        cacheKey: cacheKeyCompStyle,
        options: {
          DEBUG: this.DEBUG,
          styleDir: 'style',
          projectConfigs: buildConfig.getProjectConfigs(),
          compFilter,
        },
        buildFunc: buildStyles,
        buildDestPath,
        destFileName: 'styles.js',
        cache: this._stylesCache,
        ignoreCache,
        enableCache,
      });

      //images
      this._buildAndOutput({
        cacheKey: optionsHash({
          module,
          buildType,
          imageBlacklist,
        }),
        options: {
          DEBUG: this.DEBUG,
          projectName: buildConfig.getProjectName(),
          projectRoot: this._cliConfig.getProjectRoot(),
          imgDir: buildConfig.getImagesPath(),
          imageBlacklist,
        },
        buildFunc: buildImages,
        buildDestPath,
        destFileName: 'images.js',
        cache: this._imagesCache,
        ignoreCache,
        enableCache,
      });

      //tpls
      this._buildAndOutput({
        cacheKey: optionsHash({
          module,
          buildType,
        }),
        options: {
          DEBUG: this.DEBUG,
          projectName: buildConfig.getProjectName(),
          projectRoot: this._cliConfig.getProjectRoot(),
          tplsDir: buildConfig.getTplsDownloadDestPath(),
          routeManifestFile: buildConfig.getModuleRouteManifestPath(module),
        },
        buildFunc: buildTpls,
        buildDestPath,
        destFileName: 'tpls.js',
        cache: this._tplsCache,
        ignoreCache,
        enableCache,
      });
    }

    // config
    this._outputConfig({
      module,
      buildType,
      buildDestPath,
      ignoreCache,
      platform,
      configOnly,
      enableCache,
    });

    console.timeEnd('Builder build time');

    const fileChanged = this._fileChanged;
    this._fileChanged = false;
    return {
      fileChanged,
    };
  }

  _outputConfig({module, buildType, buildDestPath, ignoreCache, platform, configOnly, enableCache}) {
    let cacheKey = optionsHash({
      module,
      buildType,
    });
    let cache = this._configCache;
    if (!ignoreCache && cache[cacheKey]) {
      //console.log('cache _outputConfig', cacheKey);
      return;
    }
    if (enableCache) {
      cache[cacheKey] = true;
    }
    if (this.DEBUG) console.log('outputConfig begin');
    let platforms = platform ? [platform] : ['android', 'ios', 'web'];
    platforms.forEach((plat) => {
      this._outputPlatformConfig({
        module,
        buildType,
        platform: plat,
        buildDestPath,
        configOnly,
      });
    });
    if (this.DEBUG) console.log('outputConfig end');
  }

  _outputPlatformConfig({module, buildType, platform, buildDestPath, configOnly}) {
    let config = this._buildConfig.getConfig({
      module,
      buildType,
      platform,
    });
    outputConfigBlackFields.forEach((v) => {
      delete config[v];
    });
    this._output(path.join(buildDestPath, `config.${platform}.json`), JSON.stringify(config, null, 2));
    if (!configOnly) {
      //对应的js文件，方便require(由于.json 不能实现按不同平台自动查找)
      this._output(path.join(buildDestPath, `config.${platform}.js`), `module.exports = require('./config.${platform}.json');`);
    }
  }

  _buildAndOutput({cacheKey, options, buildFunc, buildDestPath, destFileName, cache, ignoreCache, enableCache}) {
    if (!ignoreCache && cache[cacheKey]) {
      //console.log('cache _buildAndOutput', cacheKey);
      return;
    }
    if (enableCache) {
      cache[cacheKey] = true;
    }
    let code = buildFunc(options);
    this._output(path.join(buildDestPath, destFileName), code);
  }

  _output(outputPath, data) {
    let oldData;
    if (fs.existsSync(outputPath)) {
      oldData = fs.readFileSync(outputPath, {
        encoding: 'UTF-8',
      });
    }
    if (oldData === data) {
      return;
    }
    fs.writeFileSync(outputPath, data);
    if (!this._fileChanged) {
      this._fileChanged = true;
    }
  }

}

module.exports = Builder;
