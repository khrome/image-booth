"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Square1px = void 0;
var _brush = require("../brush.cjs");
class Square1px extends _brush.Brush {
  constructor(name = '1px-square', engine) {
    super(name || '1px-square', engine);
  }
  kernel(control) {
    return [[255]];
  }
}
exports.Square1px = Square1px;
;