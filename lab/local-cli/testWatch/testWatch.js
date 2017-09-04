'use strict';

const fs = require('fs');
const path = require('path');
const execSync = require('child_process').execSync;
const sane = require('sane');

const canUseWatchman = (function() {
  return false;
  try {
    execSync('watchman version', {stdio: ['ignore']});
    return true;
  } catch (e) {
    console.log('canUseWatchman e', e);
  }
  return false;
})();

console.log('canUseWatchman ', canUseWatchman);


const WatcherClass = canUseWatchman ? sane.WatchmanWatcher : sane.NodeWatcher;

const watcher = new WatcherClass(__dirname);

watcher.on('all', (...args) => {
  console.log('watcher dir all', args);
});

fs.mkdirSync(path.join(__dirname, 'ccc.js'))

// const watcherFile = new WatcherClass(path.join(__dirname, 'xxx.js'));
//
// watcherFile.on('all', (...args) => {
//   console.log('watcher file all', args);
// });

// fs.watch(__dirname, {}, (...args) => {
//   console.log('fs.watch dir', args);
// });
//
// fs.watch(path.join(__dirname, 'xxx.js'), {}, (...args) => {
//   console.log('fs.watch file', args);
// });
