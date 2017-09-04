'use strict';

const fs = require('fs-extra');
const path = require('path');
const URI = require('urijs');
const request = require('request');

const MAX_CONCURRENT_REQUEST = 5;

/**
 * config: {
 *   tplUrlsFile,
 *   outputDir,
 *   baseUrl,
 * }
 */
function run(config, done) {

  // console.log('downloadTpl start');
  // let startTime = Date.now();

  let tplUrls = require(config.tplUrlsFile);
  let outputDir = config.outputDir;
  let baseUrl = config.baseUrl || '';

  if (!fs.existsSync(outputDir)) {
    fs.ensureDirSync(outputDir);
  }

  let index = 0;
  let downloadCount = 0;

  function getSaveFileName(url) {
    let uri = new URI(url);
    let query = uri.query(true);
    let compType = query.comp_type || query.tpl;
    let dataName = query.data_name || 'default';
    return compType + '-' + dataName + '.json';
  }

  function downloadNext() {
    if (index >= tplUrls.length) {
      return;
    }
    let url = baseUrl + tplUrls[index++];
    request(url)
      .on('error', (error) => {
        console.log('downloadTpl error url:', url, 'error:', error);
        done(error);
      })
      .on('end', () => {
        console.log('downloadTpl end url:', url);
        ++downloadCount;
        if (downloadCount >= tplUrls.length) {
          //console.log('downloadTpl end time:', (Date.now() - startTime));
          done();
        } else {
          downloadNext();
        }
      })
      .pipe(fs.createWriteStream(path.join(outputDir, getSaveFileName(url))));
  }

  for (let i = 0; i < MAX_CONCURRENT_REQUEST; ++i) {
    downloadNext();
  }
}

module.exports = {
  name: 'download-tpl',
  func: (argv, config, args) => {
    // TODO
  },
  description: 'starts download tpl',

  run,
};
