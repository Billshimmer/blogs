'use strict';

const fs = require('fs');
const path = require('path');
const requireConfig = require('./requireConfig');
const buildUtils = require('./Builder/buildUtils');

function mergeConfig(dest, source) {
  let extra = Object.assign({}, dest.extra, source && source.extra);
  return Object.assign({}, dest, source, {
    extra,
  });
}

function mergePlatformConfig(config, platform) {
  let merged = mergeConfig(config, config[platform]);
  delete merged['android'];
  delete merged['ios'];
  delete merged['web'];
  return merged;
}

/**
 * 验证配置的合法性
 */
function verifyConfig(config) {
  if (!config || !config.default) {
    throw new Error('config.js 格式错误');
  }
  return config;
}

/**
 * 版本号 [0, 214] . [0, 999] . [0, 9999]
 */
function parseVersionCode(version) {
  const varr = version.split('.');
  return Number(varr[2]) + Number(varr[1]) * 10000 + Number(varr[0]) * 10000000;
}

class BuildConfig {

  constructor(options) {
    this._cliConfig = options.cliConfig;
    const projectRoot = this._cliConfig.getProjectRoot();
    this._packageJson = require(path.join(projectRoot, 'package.json'));
    this._buildDir = path.join(projectRoot, 'build');
    this._configCache = Object.create(null);
    this._initLab4Config();
  }

  _initLab4Config() {
    // 不考虑package.json 文件的变化,如果改变package.json 则需重启程序
    this._lab4Config = this._packageJson.lab4 || {};
    if (!this._lab4Config.mainModule) {
      this._lab4Config.mainModule = this._packageJson.name;
    }
    if (!this._lab4Config.modules) {
      this._lab4Config.modules = [this._lab4Config.mainModule.toLowerCase()];
    }
  }

  getPackageJson() {
    return this._packageJson;
  }

  getProjectName() {
    return this._packageJson.name;
  }

  /**
   * 获取package.json 文件中的lab4配置项
   */
  getLab4Config() {
    return this._lab4Config;
  }

  /**
   * 获取module 的配置文件路径
   */
  getModuleConfigPath(module) {
    return path.join(this.getModuleDir(module), 'config.js');
  }

  /**
   * 获取module 的config对象
   * buildType platform 未合并
   */
  getModuleConfig(module) {
    if (!this._configCache[module]) {
      const configPath = this.getModuleConfigPath(module);
      const config = verifyConfig(requireConfig(configPath));
      // 如果不单独配置version 则使用package.json的
      if (!config.version) {
        config.version = this._packageJson.version;
      }
      config.versionCode = parseVersionCode(config.version);
      this._configCache[module] = {
        config,
      };
    }

    return this._configCache[module].config;
  }

  /**
   * 获取platform buildType合并之后的config
   */
  getConfig({
    module,
    platform = '_',
    buildType
  }) {
    let moduleConfig = this.getModuleConfig(module);
    let pbKey = `__${platform}:${buildType}`;
    let moduleConfigCache = this._configCache[module];
    if (!moduleConfigCache[pbKey]) {
      let config = mergePlatformConfig(moduleConfig.default, platform);
      if (moduleConfig.buildTypes && moduleConfig.buildTypes[buildType]) {
        let buildTypeConfig = mergePlatformConfig(moduleConfig.buildTypes[buildType], platform);
        config = mergeConfig(config, buildTypeConfig);
      } else {
        console.warn('BuildConfig getConfig buildType不存在!', buildType);
      }
      //将version 设置到config上
      config.version = moduleConfig.version;
      config.versionCode = moduleConfig.versionCode;
      config.buildType = buildType;
      if (!config.extra) {
        // 确保extra字段必定存在
        config.extra = {};
      }
      moduleConfigCache[pbKey] = config;
    }
    return moduleConfigCache[pbKey];
  }

  /**
   * 清除 config缓存
   * @param module 如果为空则清除所有module 否则清除对应的
   */
  clearCache(module) {
    if (!module) {
      this._configCache = Object.create(null);
    } else {
      this._configCache[module] = null;
    }
  }

  /**
   * 规范化外部传入的moduleName
   * 如果moduleName 为空则默认使用mainModule
   * 如果moduleName 为app(约定为android中的默认module) 也使用mainModule
   * 如果moduleName 与packageJson中的name名字相同 也使用mainModule
   * @param defaultModuleName 如果给出defaultModuleName 则在moduleName为空时使用该值，否则使用mainModule
   */
  normalizeModuleName(moduleName, defaultModuleName) {
    if (!moduleName && (defaultModuleName != undefined)) {
      return defaultModuleName;
    }
    if (!moduleName) {
      return this._lab4Config.mainModule;
    }
    moduleName = moduleName.toLowerCase();
    if (moduleName === 'app' || moduleName === this._packageJson.name.toLowerCase()) {
      return this._lab4Config.mainModule;
    }
    return moduleName;
  }

  /**
   * 检测moduleName 是否合法
   */
  checkModuleName(module) {
    if (this._lab4Config.modules.includes(module)) {
      return true;
    }
    return module === this._lab4Config.mainModule;
  }

  /**
   * 规范化buildType名字
   */
  normalizeBuildType(buildType) {
    return buildType && buildType.toLowerCase();
  }

  /**
   * 由moduleName 获取platform 中对应的module
   * 一般名字是相同的
   * 在android中,如果module 是主module 则可以对应android中的app
   */
  getPlatformModuleName(platform, module) {
    if (!module) {
      module = this._lab4Config.mainModule;
    }
    let platformPath = this.getPlatformPath(platform);
    if (platform === 'android') {
      if (fs.existsSync(path.join(platformPath, module))) {
        return module;
      }
      if (module === this._lab4Config.mainModule) {
        return 'app';
      }
    }
    // else if (platform === 'ios') {
    //   if (fs.existsSync(path.join(platformPath, module))) {
    //     return module;
    //   }
    //   if (module === this._lab4Config.mainModule) {
    //     return this.getProjectName();
    //   }
    // }
    return module;
  }

  /**
   * 获取platform 的path
   */
  getPlatformPath(platform) {
    return path.join(this._cliConfig.getProjectRoot(), platform);
  }

  /**
   * 获取 build/<module>/<buildType>
   */
  getBuildDestPath(module, buildType) {
    return path.join(this._buildDir, module, buildType);
  }

  /**
   * @return build/outputs
   */
  getOutputsPath() {
    return path.join(this._buildDir, 'outputs');
  }

  /**
   * @return build/outputs/<platform>
   */
  getOutputDir(platform) {
    return path.join(this._buildDir, 'outputs', platform);
  }

  /**
   * @return comps/
   */
  getCompsPath() {
    return path.join(this._cliConfig.getProjectRoot(), 'comps');
  }

  /**
   * @return style/
   */
  getStylesPath() {
    return path.join(this._cliConfig.getProjectRoot(), 'style');
  }

  /**
   * @return img/
   */
  getImagesPath() {
    return path.join(this._cliConfig.getProjectRoot(), 'img');
  }

  /**
   * @return build/tpls/
   */
  getTplsDownloadDestPath() {
    return path.join(this._buildDir, 'tpls');
  }

  /**
   * 获取项目下载模板地址配置文件
   */
  getTplUrlsFile() {
    return path.join(this._cliConfig.getProjectRoot(), 'TplUrls.js');
  }

  /**
   * 获取module 入口文件与配置文件所在的目录
   */
  getModuleDir(module) {
    let dir = path.join(this._cliConfig.getProjectRoot(), module);
    if (this._lab4Config.mainModule === module && !fs.existsSync(dir)) {
      // 主模块允许直接放在项目根目录
      dir = this._cliConfig.getProjectRoot();
    }
    return dir;
  }

  /**
   * 获取module RouteManifest.js path
   */
  getModuleRouteManifestPath(module) {
    return path.join(this.getModuleDir(module), 'RouteManifest.js');
  }

  /**
   * 获取comps style 需要与当前项目合并的其它项目根目录数组
   * 排在前面的优先级高
   */
  getMergeRoots() {
    if (!this._mergeRoots) {
      this._mergeRoots = [];
      let lab4Dir = path.join(this._cliConfig.getProjectRoot(), 'node_modules', 'lab4');
      if (fs.existsSync(lab4Dir)) {
        this._mergeRoots.push(lab4Dir);
      }
    }
    return this._mergeRoots;
  }

  /**
   * 获取buildComps 和 buildStyles 需要的各project 配置
   */
  getProjectConfigs() {
    if (!this._projectConfigs) {
      let projectRoots = [this._cliConfig.getProjectRoot()];
      projectRoots = projectRoots.concat(this.getMergeRoots());
      this._projectConfigs = buildUtils.createProjectConfigs(projectRoots, this._cliConfig.getProjectRoot());
    }
    return this._projectConfigs;
  }

  /**
   * 判断一个config 是否开启debug
   * debug buildType 默认是开启的
   */
  isDebugEnable(module, buildType) {
    let config = this.getConfig({
      module,
      buildType,
    });
    return this._isConfigDebugEnable(config, buildType);
  }

  _isConfigDebugEnable(config, buildType) {
    if (config.debug != null) {
      return config.debug;
    }
    return buildType === 'debug';
  }

  /**
   * 获取依赖包的白名单，与platform无关，platform 不允许单独配置packageWhitelist
   */
  getPackageWhitelist(module, buildType) {
    let config = this.getConfig({
      module,
      buildType,
    });
    let packageWhitelist = config.packageWhitelist || config.packageWhiteList;
    if (!packageWhitelist) {
      // 默认的白名单为 com 和当前项目目录下除其他module之外的package 如果是debug 则包括test
      packageWhitelist = ['com'];
      let compsPath = this.getCompsPath();
      if (fs.existsSync(compsPath)) {
        let curPackages = fs.readdirSync(compsPath);
        packageWhitelist = packageWhitelist.concat(curPackages.filter((name) => {
          if (name === module) {
            return true;
          }
          if (name[0] === '.') {
            return false;
          }
          return !this._lab4Config.modules.includes(name);
        }));
      }
      if (this._isConfigDebugEnable(config, buildType) && !packageWhitelist.includes('test')) {
        packageWhitelist.push('test');
      }
    }
    return packageWhitelist;
  }

  /**
   * 获取依赖图片的黑名单，与platform无关，platform不允许配置imageBlackList
   */
  getImageBlacklist(module, buildType) {
    let config = this.getConfig({
      module,
      buildType,
    });
    let imageBlacklist = config.imageBlacklist || config.imageBlackList;
    if (!imageBlacklist) {
      imageBlacklist = this._lab4Config.modules.filter((name) => name != module);
    }
    return imageBlacklist;
  }

  /**
   * 获取组件黑名单 与platform无关
   */
  getCompBlacklist(module, buildType) {
    const config = this.getConfig({
      module,
      buildType,
    });
    return config.compBlacklist || [];
  }

  getCompFilter(module, buildType) {
    const config = this.getConfig({
      module,
      buildType,
    });
    if (!config.__compFilter) {
      const packageWhitelist = this.getPackageWhitelist(module, buildType);
      const compBlacklist = this.getCompBlacklist(module, buildType);

      const packageWhitelistMap = packageWhitelist.reduce((map, value) => {
        map[value] = true;
        return map;
      }, Object.create(null));
      const compBlacklistMap = compBlacklist.reduce((map, value) => {
        map[value] = true;
        return map;
      }, Object.create(null));

      const filter = (compName) => {
        const firstPackageName = compName.slice(0, compName.indexOf('.'));
        if (!packageWhitelistMap[firstPackageName]) {
          return false;
        }
        return !compBlacklistMap[compName];
      };

      Object.defineProperty(config, '__compFilter', {
        writable: false,
        enumerable: false,
        value: filter,
      });
    }
    return config.__compFilter;
  }
}

module.exports = BuildConfig;
