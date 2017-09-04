'use strict';

const path = require('path');
const TerminalAdapter = require('yeoman-environment/lib/adapter.js');
const yeoman = require('yeoman-environment');

class CreateSuppressingTerminalAdapter extends TerminalAdapter {
  constructor() {
    super();
    // suppress 'create' output generated by yeoman
    this.log.create = function() {};
  }
}

/**
 * Creates the template for a React Native project given the provided
 * parameters:
 *   - projectDir: templates will be copied here.
 *   - argsOrName: project name or full list of custom arguments to pass to the
 *                 generator.
 */
function init(projectDir, argsOrName) {
  console.log('Setting up new LAB4 app in ' + projectDir);
  const env = yeoman.createEnv(
    undefined,
    undefined,
    new CreateSuppressingTerminalAdapter()
  );

  env.register(
    require.resolve(path.join(__dirname, '../generator')),
    'lab4:app'
  );

  // argv is for instance
  // ['node', 'lab', 'init', 'AwesomeApp', '--verbose']
  // args should be ['AwesomeApp', '--verbose']
  const args = Array.isArray(argsOrName)
    ? argsOrName
    : [argsOrName].concat(process.argv.slice(4));

  const generator = env.create('lab4:app', {args: args});
  generator.destinationRoot(projectDir);
  generator.run();
}

module.exports = init;
