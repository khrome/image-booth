"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Filter = void 0;
var _action = require("./action.js");
class Filter extends _action.Action {
  constructor(name, engine) {
    super(name, engine);
  }
  act(layer, controls) {
    return this.filter(layer, controls);
  }
  filter(layer, controls) {
    throw new Error('.filter() must be implemented in the filter class');
  }
  convolve(pixels, filter, filter_div, offset) {
    return this.engine.convolve(pixels, filter, filter_div, offset);
  }
}
exports.Filter = Filter;
;