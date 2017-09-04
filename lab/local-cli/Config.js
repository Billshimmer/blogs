'use strict';

const fs = require('fs');
const path = require('path');
const minimist = require('minimist');
const BuildConfig = require('./BuildConfig');

const LAB_CLI_CONFIG = 'lab-cli.config.js';

const Config = {
  /**
   * 初始化加载配置
   * cliArgs: {
   *   'lab-cli-config': String, //配置文件的路径，如果是相对路径则相对于process.cwd()
   * }
   */
  init(cliArgs) {
    if (this._cliConfig) {
      return;
    }
    if (!cliArgs) {
      cliArgs = minimist(process.argv.slice(2));
    }

    let cwd;
    let pathToConfig;
    if (cliArgs['lab-cli-config'] != null) {
      cwd = process.cwd();
      pathToConfig = cliArgs['lab-cli-config'];
    } else {
      cwd = __dirname;
      pathToConfig = findConfigPath(cwd);
    }

    let defaultConfig = require('./default.config.js');
    let baseConfig;
    if (pathToConfig) {
      baseConfig = path.isAbsolute(pathToConfig) ?
        require(pathToConfig) :
        require(path.join(cwd, pathToConfig));
    }

    if (cliArgs.dev == null) {
      cliArgs.dev = true;
    } else if (typeof cliArgs.dev === 'string') {
      cliArgs.dev = cliArgs.dev.toLocaleLowerCase() === 'true' ? true : false;
    }
    this._cliArgs = cliArgs;
    this._cliConfig = Object.assign({}, defaultConfig, baseConfig);
  },

  getCliArgs() {
    return this._cliArgs;
  },

  getCliConfig() {
    return this._cliConfig;
  },

  getBuildConfig() {
    if (!this._buildConfig) {
      this._buildConfig = new BuildConfig({
        cliConfig: this.getCliConfig(),
      });
    }
    return this._buildConfig;
  },
};

function findConfigPath(cwd) {
  const parentDir = findParentDirectory(cwd, LAB_CLI_CONFIG);
  return parentDir ? path.join(parentDir, LAB_CLI_CONFIG) : null;
}

function findParentDirectory(currentFullPath, filename) {
  const root = path.parse(currentFullPath).root;
  const testDir = (parts) => {
    if (parts.length === 0) {
      return null;
    }

    const fullPath = path.join(root, parts.join(path.sep));

    var exists = fs.existsSync(path.join(fullPath, filename));
    return exists ? fullPath : testDir(parts.slice(0, -1));
  };

  return testDir(currentFullPath.substring(root.length).split(path.sep));
}

module.exports = Config;
