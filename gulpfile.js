'use strict';

var gulp = require('gulp'),
    webpack = require('webpack'),
    del = require('del');


gulp.task('clean-tests', function(cb) {
  del(['./tests/build'], cb);
});

gulp.task('bundle-tests', function(cb) {
  webpack({
    target: 'web',
    debug: true,
    bail: true,
    entry: {
      basic: 'mocha!./tests/basic.js'
    },
    output: {
      path: './tests/build/',
      filename: '[name].bundle.js'
    }
  }, cb);
});

gulp.task('copy-tests', function() {
  return gulp.src(['./tests/index.html', './tests/mocha.css'])
    .pipe(gulp.dest('./tests/build/'));
});

gulp.task('tests', ['bundle-tests', 'copy-tests']);

gulp.task('clean', function(cb) {
  del(['build'], cb);
});

gulp.task('bundle', function(cb) {
  webpack({
    target: 'web',
    debug: true,
    bail: true,
    entry: {
      main: './main.js'
    },
    output: {
      path: './build/',
      filename: '[name].bundle.js'
    }
  }, cb);
});

gulp.task('copy', function() {
  return gulp.src(['./manifest.json'])
    .pipe(gulp.dest('./build/'));
});

gulp.task('default', ['bundle', 'copy']);