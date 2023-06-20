"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Round5px = void 0;
var _brush = require("../brush.cjs");
class Round5px extends _brush.Brush {
  constructor(name = '5px-round', engine) {
    super(name || '5px-round', engine);
  }
  kernel(control) {
    return [[0, 120, 255, 120, 0], [120, 255, 255, 255, 120], [255, 255, 255, 255, 255], [120, 255, 255, 255, 120], [0, 120, 255, 120, 0]];
  }
}
exports.Round5px = Round5px;
;