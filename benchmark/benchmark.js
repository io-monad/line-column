"use strict";

var Benchmark = require("benchmark");
var findLineColumn = require("find-line-column");
var lineColumn = require("../lib/line-column");
var fs = require("fs");

var longText = fs.readFileSync(__dirname + "/long.txt").toString();
var shortText = fs.readFileSync(__dirname + "/short.txt").toString();

var cachedLineColumn1;
var cachedLineColumn2;

suite
.add("long text  + line-column (not cached)", function () {
  var index = Math.floor(Math.random() * longText.length);
  lineColumn(longText).fromIndex(index);
})
.add("long text  + line-column (cached)", function () {
  if (!cachedLineColumn1) cachedLineColumn1 = lineColumn(longText);
  var index = Math.floor(Math.random() * longText.length);
  cachedLineColumn1.fromIndex(index);
})
.add("long text  + find-line-column", function () {
  var index = Math.floor(Math.random() * longText.length);
  findLineColumn(longText, index);
})
.add("short text + line-column (not cached)", function () {
  var index = Math.floor(Math.random() * shortText.length);
  lineColumn(shortText).fromIndex(index);
})
.add("short text + line-column (cached)", function () {
  if (!cachedLineColumn2) cachedLineColumn2 = lineColumn(shortText);
  var index = Math.floor(Math.random() * shortText.length);
  cachedLineColumn2.fromIndex(index);
})
.add("short text + find-line-column", function () {
  var index = Math.floor(Math.random() * shortText.length);
  findLineColumn(shortText, index);
})
.on("cycle", function(event) {
  console.log(event.target.toString());
})
.run({ async: true });
