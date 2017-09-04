'use strict';

function build(argv, args, Config) {
  //console.log('build-lab4 ', argv, args);
  let buildConfig = Config.getBuildConfig();
  const Builder = require('./Builder');
  const builder = new Builder({
    DEBUG: false,
    cliConfig: Config.getCliConfig(),
    buildConfig,
    nonPersistent: true,
  });
  let module = buildConfig.normalizeModuleName(args.module);
  if (!buildConfig.checkModuleName(module)) {
    throw new Error('module not found', module);
  }
  let buildType = buildConfig.normalizeBuildType(args.buildType);
  builder.build({
    module,
    buildType,
    platform: args.platform,
    configOnly: args.configOnly,
    outputDir: args.outputDir,
  });
  let moduleConfig = Config.getBuildConfig().getConfig({
    module,
    buildType,
    platform: args.platform,
  });
  // console输出必要信息供native 项目构建使用
  console.log('================');
  console.log('version: ' + moduleConfig.version);
  console.log('versionCode: ' + moduleConfig.versionCode);
}

module.exports = {
  name: 'build',
  func: build,
  description: 'build lab4',
  options: [{
    command: '--platform [string]',
    description: 'platform',
  }, {
    command: '--build-type <string>',
    description: 'buildType',
  }, {
    command: '--module <string>',
    description: 'module',
  }, {
    command: '--config-only',
    description: 'only build config',
    default: false,
  }, {
    command: '--output-dir [string]>',
    description: 'output dir',
  }],
};
