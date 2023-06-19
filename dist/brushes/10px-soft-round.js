"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SoftRound10px = void 0;
var _brush = require("../brush.js");
class SoftRound10px extends _brush.Brush {
  constructor(name = '10px-soft-round', engine) {
    super(name || '10px-soft-round', engine);
  }
  kernel(control) {
    return [[0, 0, 0, 5, 10, 10, 5, 0, 0, 0], [0, 0, 5, 30, 50, 50, 30, 5, 0, 0], [0, 5, 30, 100, 120, 120, 100, 30, 5, 0], [5, 30, 100, 160, 180, 180, 160, 100, 30, 5], [10, 50, 120, 180, 200, 200, 180, 120, 50, 10], [10, 50, 120, 180, 200, 200, 180, 120, 50, 10], [5, 30, 100, 160, 180, 180, 160, 100, 30, 5], [0, 5, 30, 100, 120, 120, 100, 30, 5, 0], [0, 0, 5, 30, 50, 50, 30, 5, 0, 0], [0, 0, 0, 5, 10, 10, 5, 0, 0, 0]];
  }
}
exports.SoftRound10px = SoftRound10px;
;