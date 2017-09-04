'use strict';

const path = require('path');
const fs = require('fs');

const gulp = require('gulp');
const del = require('del');
const mergeStream = require('merge-stream');

const {
  cliArgs,
  cliConfig,
  buildConfig,
} = require('./local-cli/lab-gulp');

gulp.task('default', function() {
  console.log('gulp default');
});

gulp.task('clean-minify', function() {
  return del(['build/lab4-min']);
});

gulp.task('cpoy-none-minify', ['clean-minify'], function() {
  return gulp.src(['**', '!node_modules', '!node_modules/**', '!**/build', '!**/build/**', '!**/Build', '!**/Build/**',
      '!ios/Pods/**', '!android/.*', '!android/local.properties',
      '!android/LABRepository/**/*-debug.aar*', '!android/LABRepository/**/*-release.aar*',
      '!android/android-keystore', '!android/android-keystore/**', '!android/gradle.properties',
      '!core', '!core/**', '!parse', '!parse/**', '!redux', '!redux/**',
      '!android/lablibrary', '!android/lablibrary/**',
      '!rn-cli.config.js', '!local-cli/upload-config.js',
    ])
    .pipe(gulp.dest('build/lab4-min'));
});

gulp.task('minify-lab4-local-cli', ['clean-minify', 'cpoy-none-minify'], function(cb) {
  const babel = require('gulp-babel');
  const uglify = require('gulp-uglify');
  const pump = require('pump');
  pump([
    gulp.src(['local-cli/**/*.js', '!local-cli/upload-config.js']),
    babel({presets: ['es2015']}),
    uglify(),
    gulp.dest('build/lab4-min/local-cli')],
    cb);
});

/**
 * 混淆框架 输出到build/lab4-minify
 */
gulp.task('minify', ['clean-minify', 'cpoy-none-minify', 'minify-lab4-local-cli'], function() {
  const folders = ['core', 'parse', 'redux',];
  const rnMinifyGulp = require('./local-cli/rn-minify-gulp');
  let tasks = folders.map((folderName) => {
    return gulp.src([folderName + '/**'])
      .pipe(rnMinifyGulp())
      .pipe(gulp.dest('build/lab4-min/' + folderName))
  });
  return mergeStream(tasks);
});
