"use strict";

var LineColumnFinder = require("../lib/line-column");
var assert = require("power-assert");

var testString = [
  "ABCDEFG\n",         // line:0, index:0
  "HIJKLMNOPQRSTU\n",  // line:1, index:8
  "VWXYZ\n",           // line:2, index:23
  "日本語の文字\n",    // line:3, index:29
  "English words"      // line:4, index:36
].join("");            // length:49

describe("LineColumnFinder", function () {

  describe("#constructor", function () {
    it("can be called with new operator", function () {
      assert(new LineColumnFinder("TEST") instanceof LineColumnFinder);
    });
    it("can be called without new operator", function () {
      assert(LineColumnFinder("TEST") instanceof LineColumnFinder);
    });
    it("builds lineToIndex properly", function () {
      assert.deepEqual(
        LineColumnFinder(testString).lineToIndex,
        [0, 8, 23, 29, 36]
      );
    });
    it("can be shorthand for #fromIndex", function () {
      assert.deepEqual(LineColumnFinder(testString, 15), { line: 2, col: 8 });
    });
    it("can be called without arguments", function () {
      assert(LineColumnFinder() instanceof LineColumnFinder);
    });
  });

  describe("#fromIndex", function () {

    context("with 1-origin", function () {
      var lineColumn = LineColumnFinder(testString);

      it("returns line-column for the first line", function () {
        assert.deepEqual(lineColumn.fromIndex(3), { line: 1, col: 4 });
      });
      it("returns line-column for the middle line", function () {
        assert.deepEqual(lineColumn.fromIndex(15), { line: 2, col: 8 });
      });
      it("returns line-column for the line containing wide chars", function () {
        assert.deepEqual(lineColumn.fromIndex(33), { line: 4, col: 5 });
      });
      it("returns line-column for the last line", function () {
        assert.deepEqual(lineColumn.fromIndex(43), { line: 5, col: 8 });
      });
      it("returns line-column for the last character", function () {
        assert.deepEqual(lineColumn.fromIndex(48), { line: 5, col: 13 });
      });

      it("returns null for an index < 1", function () {
        assert(lineColumn.fromIndex(-1) === null);
      });
      it("returns null for an index >= str.length", function () {
        assert(lineColumn.fromIndex(49) === null);
      });
      it("returns null for a NaN index", function () {
        assert(lineColumn.fromIndex(NaN) === null);
      });
    });

    context("with 0-origin", function () {
      var lineColumn = LineColumnFinder(testString, { origin: 0 });

      it("returns line-column for the first line", function () {
        assert.deepEqual(lineColumn.fromIndex(3), { line: 0, col: 3 });
      });
      it("returns line-column for the middle line", function () {
        assert.deepEqual(lineColumn.fromIndex(15), { line: 1, col: 7 });
      });
      it("returns line-column for the line containing wide chars", function () {
        assert.deepEqual(lineColumn.fromIndex(33), { line: 3, col: 4 });
      });
      it("returns line-column for the last line", function () {
        assert.deepEqual(lineColumn.fromIndex(43), { line: 4, col: 7 });
      });
      it("returns line-column for the last character", function () {
        assert.deepEqual(lineColumn.fromIndex(48), { line: 4, col: 12 });
      });

      it("returns null for an index < 0", function () {
        assert(lineColumn.fromIndex(-1) === null);
      });
      it("returns null for an index >= str.length", function () {
        assert(lineColumn.fromIndex(49) === null);
      });
      it("returns null for a NaN index", function () {
        assert(lineColumn.fromIndex(NaN) === null);
      });
    });

  });

  describe("#toIndex", function () {

    context("with 1-origin", function () {
      var lineColumn = LineColumnFinder(testString);

      it("returns an index for the first line", function () {
        assert(lineColumn.toIndex(1, 4) === 3);
      });
      it("returns an index for the middle line", function () {
        assert(lineColumn.toIndex(2, 8) === 15);
      });
      it("returns an index for the line containing wide chars", function () {
        assert(lineColumn.toIndex(4, 5) === 33);
      });
      it("returns an index for the last line", function () {
        assert(lineColumn.toIndex(5, 8) === 43);
      });
      it("returns an index for the last character", function () {
        assert(lineColumn.toIndex(5, 13) === 48);
      });
      it("allows column == line.length", function () {
        assert(lineColumn.toIndex(1, 8) === 7);
      });

      it("accepts an Object of { line, col }", function () {
        assert(lineColumn.toIndex({ line: 2, col: 8 }) === 15);
      });
      it("accepts an Object of { line, column }", function () {
        assert(lineColumn.toIndex({ line: 2, column: 8 }) === 15);
      });
      it("accepts an Array of [ line, col ]", function () {
        assert(lineColumn.toIndex([2, 8]) === 15);
      });

      it("returns -1 for line < 1", function () {
        assert(lineColumn.toIndex(0, 4) === -1);
      });
      it("returns -1 for column < 1", function () {
        assert(lineColumn.toIndex(2, 0) === -1);
      });
      it("returns -1 for line >= lines.length", function () {
        assert(lineColumn.toIndex(6, 1) === -1);
      });
      it("returns -1 for column >= line.length", function () {
        assert(lineColumn.toIndex(1, 9) === -1);
      });
      it("returns -1 for line + column >= str.length", function () {
        assert(lineColumn.toIndex(5, 14) === -1);
      });

      it("returns -1 for missing column", function () {
        assert(lineColumn.toIndex(1) === -1);
      });
      it("returns -1 for NaN line", function () {
        assert(lineColumn.toIndex(NaN, 1) === -1);
      });
      it("returns -1 for NaN column", function () {
        assert(lineColumn.toIndex(1, NaN) === -1);
      });
    });

    context("with 0-origin", function () {
      var lineColumn = LineColumnFinder(testString, { origin: 0 });

      it("returns an index for the first line", function () {
        assert(lineColumn.toIndex(0, 3) === 3);
      });
      it("returns an index for the middle line", function () {
        assert(lineColumn.toIndex(1, 7) === 15);
      });
      it("returns an index for the line containing wide chars", function () {
        assert(lineColumn.toIndex(3, 4) === 33);
      });
      it("returns an index for the last line", function () {
        assert(lineColumn.toIndex(4, 7) === 43);
      });
      it("returns an index for the first character", function () {
        assert(lineColumn.toIndex(0, 0) === 0);
      });
      it("returns an index for the last character", function () {
        assert(lineColumn.toIndex(4, 12) === 48);
      });
      it("allows column == line.length", function () {
        assert(lineColumn.toIndex(0, 7) === 7);
      });

      it("accepts an Object of { line, col }", function () {
        assert(lineColumn.toIndex({ line: 1, col: 7 }) === 15);
      });
      it("accepts an Object of { line, column }", function () {
        assert(lineColumn.toIndex({ line: 1, column: 7 }) === 15);
      });
      it("accepts an Array of [ line, col ]", function () {
        assert(lineColumn.toIndex([1, 7]) === 15);
      });
      it("returns an index for { line: 0, col: 0 }", function () {
        assert(lineColumn.toIndex({ line: 0, col: 0 }) === 0);
      });
      it("returns an index for { line: 0, column: 0 }", function () {
        assert(lineColumn.toIndex({ line: 0, column: 0 }) === 0);
      });
      it("returns an index for [ 0, 0 ]", function () {
        assert(lineColumn.toIndex([0, 0]) === 0);
      });

      it("returns -1 for line < 0", function () {
        assert(lineColumn.toIndex(-1, 3) === -1);
      });
      it("returns -1 for column < 0", function () {
        assert(lineColumn.toIndex(1, -1) === -1);
      });
      it("returns -1 for line >= lines.length", function () {
        assert(lineColumn.toIndex(5, 0) === -1);
      });
      it("returns -1 for column >= line.length", function () {
        assert(lineColumn.toIndex(0, 8) === -1);
      });
      it("returns -1 for line + column >= str.length", function () {
        assert(lineColumn.toIndex(4, 13) === -1);
      });

      it("returns -1 for missing column", function () {
        assert(lineColumn.toIndex(1) === -1);
      });
      it("returns -1 for NaN line", function () {
        assert(lineColumn.toIndex(NaN, 1) === -1);
      });
      it("returns -1 for NaN column", function () {
        assert(lineColumn.toIndex(1, NaN) === -1);
      });
    });

  });

});
