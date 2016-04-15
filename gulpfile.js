"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var mocha = require("gulp-mocha");
var istanbul = require("gulp-istanbul");
var coveralls = require("gulp-coveralls");

gulp.task("default", ["coverage"]);

gulp.task("watch", function () {
  gulp.watch(["lib/**", "test/**"], ["test"]);
});

gulp.task("test", function () {
  return gulp.src("test/**/*.js", { read: false })
    .pipe(mocha());
});

gulp.task("pre-coverage", function () {
  return gulp.src("lib/**/*.js")
    .pipe(istanbul())
    .pipe(istanbul.hookRequire());
});

gulp.task("coverage", ["pre-coverage"], function (cb) {
  var mochaError;
  gulp.src("test/**/*.js", { read: false })
    .pipe(plumber())
    .pipe(mocha())
    .on("error", function (err) { mochaError = err })
    .pipe(istanbul.writeReports())
    .on("end", function () { cb(mochaError) });
});

gulp.task("test-ci", ["coverage"], function () {
  return gulp.src("coverage/lcov.info")
    .pipe(coveralls());
});
