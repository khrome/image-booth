"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Operation = void 0;
var _action = require("./action.js");
class Operation extends _action.Action {
  constructor(name, engine) {
    super(name, engine);
  }
  act(layer, controls) {
    return this.operate(layer, controls);
  }
  operate(layer, controls) {
    throw new Error('.operate() must be implemented in the filter class');
  }
  convolve(pixels, filter, filter_div, offset) {
    return this.engine.convolve(pixels, filter, filter_div, offset);
  }
}
exports.Operation = Operation;
;