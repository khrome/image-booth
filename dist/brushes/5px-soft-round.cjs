"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SoftRound5px = void 0;
var _brush = require("../brush.cjs");
class SoftRound5px extends _brush.Brush {
  constructor(name = '5px-soft-round', engine) {
    super(name || '5px-soft-round', engine);
  }
  kernel(control) {
    return [[0, 100, 120, 100, 0], [100, 150, 175, 150, 100], [120, 175, 200, 175, 120], [100, 150, 175, 150, 100], [0, 100, 120, 100, 0]];
  }
}
exports.SoftRound5px = SoftRound5px;
;