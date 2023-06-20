"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Round3px = void 0;
var _brush = require("../brush.cjs");
class Round3px extends _brush.Brush {
  constructor(name = '3px-round', engine) {
    super(name || '3px-round', engine);
  }
  kernel(control) {
    return [[25, 100, 25], [100, 255, 100], [25, 100, 25]];
  }
}
exports.Round3px = Round3px;
;