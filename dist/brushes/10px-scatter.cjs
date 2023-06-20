"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Scatter10px = void 0;
var _brush = require("../brush.cjs");
class Scatter10px extends _brush.Brush {
  constructor(name = '10px-scatter', engine) {
    super(name || '10px-scatter', engine);
  }
  kernel(control) {
    return [[0, 0, 0, 100, 0, 0, 0, 0, 100, 0], [0, 0, 100, 150, 100, 0, 0, 100, 150, 100], [0, 50, 0, 100, 0, 0, 50, 0, 100, 0], [50, 100, 50, 0, 0, 50, 100, 50, 0, 0], [0, 50, 0, 100, 0, 0, 50, 0, 0, 0], [0, 0, 100, 150, 100, 0, 0, 0, 50, 0], [0, 0, 0, 100, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 50, 0, 0], [0, 50, 0, 0, 50, 0, 50, 100, 50, 0], [0, 0, 0, 0, 0, 0, 0, 50, 0, 0]];
  }
}
exports.Scatter10px = Scatter10px;
;