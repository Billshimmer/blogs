'use strict';

const commander = require('commander');
const chalk = require('chalk');
const minimist = require('minimist');
const path = require('path');
const fs = require('fs');

const commands = require('./commands');
const pkg = require('../package.json');

commander.version(pkg.version);

const defaultOptParser = (val) => val;

const handleError = (err) => {
  console.error();
  console.error(err.message || err);
  console.error();
  process.exit(1);
};

function printUnknownCommand(cmdName) {
  console.log([
    '',
    cmdName
      ? chalk.red(`  Unrecognized command '${cmdName}'`)
      : chalk.red('  You didn\'t pass any command'),
    `  Run ${chalk.cyan('lab --help')} to see list of all available commands`,
    '',
  ].join('\n'));
}

const addCommand = (command, config) => {
  const options = command.options || [];

  const cmd = commander
    .command(command.name, undefined, {
      noHelp: !command.description,
    })
    .description(command.description)
    .action(function runAction() {
      const passedOptions = this.opts();
      const argv = Array.from(arguments).slice(0, -1);

      Promise.resolve()
        .then(() => {
          return command.func(argv, passedOptions, config);
        })
        .catch(handleError);
    });

  options
    .forEach(opt => cmd.option(
      opt.command,
      opt.description,
      opt.parse || defaultOptParser,
      typeof opt.default === 'function' ? opt.default(config) : opt.default
    ));
};

function run(argv = process.argv) {
  const Config = require('./Config');
  Config.init(minimist(argv.slice(2)));

  commands.forEach(cmd => addCommand(cmd, Config));

  commander.parse(argv);

  const isValidCommand = commands.find(cmd => cmd.name.split(' ')[0] === argv[2]);

  if (!isValidCommand) {
    printUnknownCommand(argv[2]);
    return;
  }

  if (!commander.args.length) {
    commander.help();
  }
}

if (require.main === module) {
  run();
}

module.exports = {
  run: run,
  get init() { return require('./init') },
};
