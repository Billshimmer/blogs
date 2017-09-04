'use strict';

const runServer = require('./runServer');

function onServerBeforeBundle(options) {

}

function start(argv, args, Config) {
  __LAB__.onServerBeforeBundle = onServerBeforeBundle;

  let rncli;
  if (args.labWeb) {
    rncli = require('react-native/local-cli/cli');
  } else {
    rncli = require('react-native-web/local-cli/cli');
  }
  rncli.run();
}

module.exports = {
  name: 'start',
  func: start,
  description: 'starts the react-native webserver',
  options: [{
    command: '--lab-web',
    description: 'react-native start | lab-react-native-web start',
    default: false,
  }],
};
