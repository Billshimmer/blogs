#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;
const execSync = require('child_process').execSync;
const spawn = require('child_process').spawn;
const chalk = require('chalk');
const prompt = require('prompt');
const semver = require('semver');
const argv = require('minimist')(process.argv.slice(2));

const CLI_MODULE_PATH = function() {
  return path.resolve(
    process.cwd(),
    'node_modules',
    'lab4',
    'local-cli',
    'index.js'
  );
};

const LAB4_PACKAGE_JSON_PATH = function() {
  return path.resolve(
    process.cwd(),
    'node_modules',
    'lab4',
    'package.json'
  );
};

// Use Yarn if available, it's much faster than the npm client.
// Return the version of yarn installed on the system, null if yarn is not available.
function getYarnVersionIfAvailable() {
  let yarnVersion;
  try {
    // execSync returns a Buffer -> convert to string
    if (process.platform.startsWith('win')) {
      yarnVersion = (execSync('yarn --version').toString() || '').trim();
    } else {
      yarnVersion = (execSync('yarn --version 2>/dev/null').toString() || '').trim();
    }
  } catch (error) {
    return null;
  }
  // yarn < 0.16 has a 'missing manifest' bug
  try {
    if (semver.gte(yarnVersion, '0.16.0')) {
      return yarnVersion;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Cannot parse yarn version: ' + yarnVersion);
    return null;
  }
}

checkForVersionArgument();

let cli;
let cliPath = CLI_MODULE_PATH();
if (fs.existsSync(cliPath)) {
  cli = require(cliPath);
}

// minimist api
let commands = argv._;
if (cli) {
  cli.run();
} else {
  if (commands.length === 0) {
    console.error(
      'You did not pass any commands, did you mean to run `lab-cli init`?'
    );
    process.exit(1);
  }

  switch (commands[0]) {
  case 'init':
    if (!commands[1]) {
      console.error(
        'Usage: lab-cli init <ProjectName> [--verbose]'
      );
      process.exit(1);
    } else {
      const lab4Package = argv['lab4-package'];
      init(commands[1], argv.verbose, lab4Package, argv.npm);
    }
    break;
  default:
    console.error(
      'Command `%s` unrecognized. ' +
      'Make sure that you have run `npm install` and that you are inside a lab4 project.',
      commands[0]
    );
    process.exit(1);
    break;
  }
}

function validateProjectName(name) {
  if (!name.match(/^[$A-Z_][0-9A-Z_$]*$/i)) {
    console.error(
      '"%s" is not a valid name for a project. Please use a valid identifier ' +
        'name (alphanumeric).',
      name
    );
    process.exit(1);
  }

  if (name === 'React') {
    console.error(
      '"%s" is not a valid name for a project. Please do not use the ' +
        'reserved word "React".',
      name
    );
    process.exit(1);
  }
}

/**
 * @param name Project name, e.g. 'AwesomeApp'.
 * @param verbose If true, will run 'npm install' in verbose mode (for debugging).
 * @param lab4Package
 * @param forceNpmClient If true, always use the npm command line client,
 *                       don't use yarn even if available.
 */
function init(name, verbose, lab4Package, forceNpmClient) {
  if (forceNpmClient == null) {
    forceNpmClient = true;
  }
  validateProjectName(name);

  if (fs.existsSync(name)) {
    createAfterConfirmation(name, verbose, lab4Package, forceNpmClient);
  } else {
    createProject(name, verbose, lab4Package, forceNpmClient);
  }
}

function createAfterConfirmation(name, verbose, lab4Package, forceNpmClient) {
  prompt.start();

  let property = {
    name: 'yesno',
    message: 'Directory ' + name + ' already exists. Continue?',
    validator: /y[es]*|n[o]?/,
    warning: 'Must respond yes or no',
    default: 'no'
  };

  prompt.get(property, function (err, result) {
    if (result.yesno[0] === 'y') {
      createProject(name, verbose, lab4Package, forceNpmClient);
    } else {
      console.log('Project initialization canceled');
      process.exit();
    }
  });
}

function createProject(name, verbose, lab4Package, forceNpmClient) {
  let root = path.resolve(name);
  const projectName = path.basename(root);
  const projectNameLowerCase = projectName.toLowerCase();

  console.log(
    'This will walk you through creating a new LAB4 project in',
    root
  );

  if (!fs.existsSync(root)) {
    fs.mkdirSync(root);
  }

  const packageJson = {
    name: projectName,
    version: '1.0.0',
    private: true,
    scripts: {
      start: 'node node_modules/react-native/local-cli/cli.js start',
    },
    dependencies: {
      lab4: lab4Package || 'git+ssh://git@git.dev.backustech.com:lab4/lab4.git',
    },
    // TODO
    devDependencies: {
      'yeoman-environment': '1.5.3',
      'yeoman-generator': 'yeoman-generator'
    },
    lab4: {
      mainModule: projectNameLowerCase,
      modules: [
        projectNameLowerCase
      ],
      tplUrl: "",
      _zhcnNames: [
        projectNameLowerCase
      ],
    },
  };
  fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify(packageJson, null, 2));
  process.chdir(root);

  const vimPackageJson = spawn('vim', ['package.json'], {
    stdio: [process.stdin, process.stdout, process.stderr],
  });

  vimPackageJson.on('close', (code) => {
    // TODO 检查配置合法性
    if (verbose) {
      runVerbose(root, projectName, forceNpmClient);
    } else {
      run(root, projectName, forceNpmClient);
    }
  });
}

function run(root, projectName, forceNpmClient) {
  const yarnVersion = (!forceNpmClient) && getYarnVersionIfAvailable();
  let installCommand;
  if (yarnVersion) {
    console.log('Using yarn v' + yarnVersion);
    installCommand = 'yarn install';
  } else {
    if (!forceNpmClient) {
      console.log('Consider installing yarn to make this faster: https://yarnpkg.com');
    }
    installCommand = 'npm install --registry=https://registry.npm.taobao.org';
  }
  exec(installCommand, function(err, stdout, stderr) {
    if (err) {
      console.log(stdout);
      console.error(stderr);
      console.error('Command `' + installCommand + '` failed.');
      process.exit(1);
    }
    checkNodeVersion();
    cli = require(CLI_MODULE_PATH());
    cli.init(root, projectName);
  });
}

function runVerbose(root, projectName, lab4Package, forceNpmClient) {
  // Use npm client, yarn doesn't support --verbose yet
  console.log('Installing lab4 from npm. This might take a while...');
  let proc = spawn(/^win/.test(process.platform) ? 'npm.cmd' : 'npm', ['install', '--registry=https://registry.npm.taobao.org', '--verbose'], {stdio: 'inherit'});
  proc.on('close', function (code) {
    if (code !== 0) {
      console.error('`npm install failed');
      return;
    }

    cli = require(CLI_MODULE_PATH());
    cli.init(root, projectName);
  });
}

function checkNodeVersion() {
  let packageJson = require(LAB4_PACKAGE_JSON_PATH());
  if (!packageJson.engines || !packageJson.engines.node) {
    return;
  }
  if (!semver.satisfies(process.version, packageJson.engines.node)) {
    console.error(chalk.red(
        'You are currently running Node %s but LAB4 requires %s. ' +
        'Please use a supported version of Node.\n' +
        'See https://facebook.github.io/react-native/docs/getting-started.html'
      ),
      process.version,
      packageJson.engines.node);
  }
}

function checkForVersionArgument() {
  if (argv._.length === 0 && (argv.v || argv.version)) {
    console.log('lab-cli: ' + require('./package.json').version);
    try {
      console.log('lab4: ' + require(LAB4_PACKAGE_JSON_PATH()).version);
    } catch (e) {
      console.log('lab4: n/a - not inside a LAB4 project directory');
    }
    process.exit();
  }
}
