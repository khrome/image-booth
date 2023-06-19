"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Square5px = void 0;
var _brush = require("../brush.js");
class Square5px extends _brush.Brush {
  constructor(name = '5px-square', engine) {
    super(name || '5px-square', engine);
  }
  kernel(control) {
    return [[255, 255, 255, 255, 255], [255, 255, 255, 255, 255], [255, 255, 255, 255, 255], [255, 255, 255, 255, 255], [255, 255, 255, 255, 255]];
  }
}
exports.Square5px = Square5px;
;