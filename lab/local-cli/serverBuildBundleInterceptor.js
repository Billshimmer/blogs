'use strict';

const Config = require('./Config');
const Builder = require('./Builder');

const moduleNameReg = /^[/\\]?([A-Za-z][A-Za-z0-9]*)[/\\]/;

function getModuleName(buildConfig, entryFile) {
  let match = moduleNameReg.exec(entryFile);
  return match ? match[1] : buildConfig.getLab4Config().mainModule;
}

function getLabExtra(labExtraStr) {
  return {
    buildType: labExtraStr,
  };
}

let builderInstance;

/**
 * @param  options {
 *   bundleOptions: {
 *     entryFile,
 *     dev,
 *     minify,
 *     platform,
 *     extraNodeModules,
 *     __lab__extra, // buildType
 *   },
 *   options: {
 *     nonPersistent,
 *   },
 *   entryFuncName,
 * }
 */
module.exports = function(options) {
  console.log('serverBuildBundleInterceptor', options);

  Config.init();

  let bundleOptions = options.bundleOptions;
  let buildConfig = Config.getBuildConfig();
  let moduleName = getModuleName(buildConfig, bundleOptions.entryFile);
  moduleName = buildConfig.normalizeModuleName(moduleName);
  if (!buildConfig.checkModuleName(moduleName)) {
    throw new Error('module not found', moduleName);
  }
  let platform = bundleOptions.platform;
  let labExtra = getLabExtra(bundleOptions.__lab__extra || Config.getCliArgs()['lab-extra']);
  let buildType = buildConfig.normalizeBuildType(labExtra.buildType || process.env.LAB_BUILD_TYPE || (Config.getCliArgs().dev ? 'debug' : 'release'));

  let builder = builderInstance;
  if (!builder) {
    builder = new Builder({
      cliConfig: Config.getCliConfig(),
      buildConfig: buildConfig,
      nonPersistent: options.options.nonPersistent,
    });
    if (!options.options.nonPersistent) {
      builderInstance = builder;
    }
  }

  console.log('serverBuildBundleInterceptor module:', moduleName, 'buildType:', buildType);

  let buildRes = builder.build({
    module: moduleName,
    buildType,
  });

  let newBundleOptions =  Object.assign({}, bundleOptions, {
    extraNodeModules: {
      'lab-config': buildConfig.getBuildDestPath(moduleName, buildType),
    },
  });
  console.log(newBundleOptions);
  return {
    bundleOptions: newBundleOptions,
    fileChanged: buildRes.fileChanged,
  };
};
