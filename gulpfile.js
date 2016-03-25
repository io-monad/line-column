"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var mocha = require("gulp-mocha");
var istanbul = require("gulp-istanbul");

gulp.task("default", ["coverage", "coveralls"]);

gulp.task("watch", function () {
  gulp.watch(["lib/**", "test/**"], ["test-no-coverage"]);
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

gulp.task("coveralls", ["coverage"], function () {
  if (!process.env.CI) return;
  return gulp.src("coverage/lcov.info")
    .pipe(coveralls());
});
