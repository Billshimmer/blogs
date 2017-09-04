'use strict';

const path = require('path');
const fs = require('fs');

const gulp = require('gulp');
const mergeStream = require('merge-stream');

const {
  cliArgs,
  cliConfig,
  buildConfig,
} = require('lab4/local-cli/lab-gulp');
